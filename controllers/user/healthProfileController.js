const db = require("../../config/db");

function calculateAge(dobString) {
  const dob = new Date(dobString);
  const ageDiff = new Date(Date.now() - dob.getTime());
  return Math.abs(ageDiff.getUTCFullYear() - 1970);
}
// Get all health profiles
const getHealthProfile = async (req, res) => {
  try {
    const user_id = req.params.id;
    const [data] = await db.query(
      "SELECT `weight (kgs)` as weight, `height (m)` as height, hbA1c, fasting_sugar_level as sugar_level, activity_level, diabetes_type FROM HealthProfile WHERE user_id=?",
      [user_id]
    );
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Unable to retrieve User Information from the database.",
      });
    }

    const [food_data] = await db.query("SELECT food_name, food_id FROM Foods");
    if (!food_data) {
      res.status(404).send({
        success: false,
        message: "Unable to retrieve Food Items from the database.",
      });
    }

    const [liked_foods] = await db.query(
      "SELECT Foods.food_id, Foods.food_name, Likes.reaction FROM Foods JOIN Likes ON Foods.food_id = Likes.food_id WHERE Likes.user_id=?",
      [user_id]
    );

    const [disliked_foods] = await db.query(
      "SELECT Foods.food_id, Foods.food_name, Dislikes.reaction FROM Foods JOIN Dislikes ON Foods.food_id = Dislikes.food_id WHERE Dislikes.user_id=?",
      [user_id]
    );
    // console.log(liked_foods);
    res.status(200).send({
      success: true,
      message: "User Information retrieved successfully.",
      data: data,
      food_data: food_data,
      liked_foods: liked_foods,
      // food_data: disliked_foods,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error in Get User Info API.",
      error: e,
    });
  }
};

const updateHealthProfile = async (req, res) => {
  try {
    const user_id = req.params.id;
    if (!user_id) {
      return res.status(404).send({
        success: false,
        message: "User ID not provided.",
      });
    }
    const {
      weight,
      height,
      sugar_level,
      hbA1c,
      activity_level,
      diabetes_type,
      foodPreferences,
    } = req.body;

    if (
      !weight ||
      !height ||
      !sugar_level ||
      !hbA1c ||
      !activity_level ||
      !diabetes_type
    ) {
      return res.status(400).send({
        success: false,
        message: "Missing values in one of the fields.",
      });
    }

    const result_temp = await db.query(
      "SELECT dob, gender FROM Users WHERE user_id=?",
      [user_id]
    );

    if (!result_temp) {
      res.status(400).send({
        success: false,
        message: "Date Of Birth not retrieved.",
      });
    }

    // Storing Gender
    const gender = result_temp[0][0].gender;

    // Formatting DOB
    let temp_date = result_temp[0][0].dob;
    temp_date = temp_date.toISOString();
    const formattedDate = temp_date.split("T")[0];
    const age = calculateAge(formattedDate);

    // Calculating BMI and BMR
    const BMI = weight / height ** 2;
    let BMR = 0;
    console.log("Gender: ", gender);
    if (gender == "Male")
      BMR = 66.5 + 13.75 * weight + 5.003 * (height * 100) - 6.75 * age;
    else if (gender == "Female")
      BMR = 655.1 + 9.563 * weight + 1.85 * height ** 2 - 4.676 * age;

    // Calculating Total Steps and Total Calories
    let total_steps;
    let total_calories = 0;
    switch (activity_level) {
      case "Sedentary":
        total_steps = 5000;
        total_calories = BMR * 1.2;
        break;
      case "Lightly Active":
        total_steps = 7500;
        total_calories = BMR * 1.375;
        break;
      case "Moderately Active":
        total_steps = 10000;
        total_calories = BMR * 1.55;
        break;
      case "Very Active":
        total_steps = 12500;
        total_calories = BMR * 1.725;
        break;
      case "Extra Active":
        total_steps = 15000;
        total_calories = BMR * 1.9;
      default:
        total_steps = 0;
        total_calories = 0;
        break;
    }

    const result = await db.query(
      "UPDATE HealthProfile SET `weight (kgs)`=?, `height (m)`=?, fasting_sugar_level=?, hbA1c=?, activity_level=?, diabetes_type=?, BMI=?, BMR=?, total_steps=?, caloric_needs=? WHERE user_id=?",
      [
        weight,
        height,
        sugar_level,
        hbA1c,
        activity_level,
        diabetes_type,
        BMI,
        BMR,
        total_steps,
        total_calories,
        user_id,
      ]
    );

    // If the existing foods are sent but are not updated.
    const [liked_foods] = await db.query(
      "SELECT Foods.food_id, Likes.reaction FROM Foods JOIN Likes ON Foods.food_id=Likes.food_id WHERE user_id=?",
      user_id
    );

    liked_foods.forEach(({ food_id, reaction }) => {
      if (foodPreferences[food_id] === reaction) {
        delete foodPreferences[food_id];
      }
    });

    // When the foods have new reaction from user.
    const differentReactions = {};

    liked_foods.forEach(({ food_id, reaction }) => {
      if (
        foodPreferences[food_id] !== undefined &&
        foodPreferences[food_id] !== reaction
      ) {
        differentReactions[food_id] = foodPreferences[food_id];
        delete foodPreferences[food_id];
      }
    });

    for (const [fid, reac] of Object.entries(differentReactions)) {
      await db.query("UPDATE Likes SET reaction=? WHERE food_id=?", [
        reac,
        fid,
      ]);
    }

    // Adding new foods
    for (const [fid, reac] of Object.entries(foodPreferences)) {
      await db.query(
        "INSERT INTO Likes (food_id, reaction, user_id) VALUES (?, ?, ?)",
        [fid, reac, user_id]
      );
    }

    if (!result) {
      return res.status(500).send({
        success: false,
        message: "Unable to Update User Health Profile.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User Health Profile Updated Successfully.",
      data: {
        weight,
        height,
        sugar_level,
        hbA1c,
        activity_level,
        diabetes_type,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Error in Update User API.",
      error: e,
    });
  }
};

module.exports = {
  getHealthProfile,
  updateHealthProfile,
};
