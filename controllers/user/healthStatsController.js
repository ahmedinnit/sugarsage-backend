const db = require("../../config/db");
const axios = require("axios");

function calculateAge(dobString) {
  const dob = new Date(dobString);
  const ageDiff = new Date(Date.now() - dob.getTime());
  return Math.abs(ageDiff.getUTCFullYear() - 1970);
}

const healthTrack = async (req, res) => {
  try {
    const user_id = req.params.id;
    if (!user_id) {
      res.status(404).send({
        success: false,
        message: "User ID not provided.",
      });
      return;
    }

    const [[user_info]] = await db.query(
      "SELECT dob, gender FROM Users WHERE user_id=?",
      [user_id]
    );

    let temp_date = user_info.dob;
    temp_date = temp_date.toISOString();
    const formattedDate = temp_date.split("T")[0];
    const age = calculateAge(formattedDate);

    const [[health_info]] = await db.query(
      "SELECT caloric_needs, consumed_calories, BMI, BMR, `weight (kgs)`, `height (m)`, activity_level, hbA1c, total_steps, steps_taken FROM HealthProfile WHERE user_id=?",
      [user_id]
    );

    const apiData = {
      Age: age,
      Gender: user_info.gender,
      "Height (m)": health_info["height (m)"],
      "Weight (kg)": health_info["weight (kgs)"],
      BMI: health_info.BMI,
      "HbA1c Level": health_info.hbA1c,
      "Activity Level": health_info.activity_level,
      BMR: health_info.BMR,
    };
    // console.log(apiData);

    const response = await axios.post(
      "https://61d5-39-60-249-131.ngrok-free.app/predict_model_01",
      apiData
    );
    // console.log(user_id);

    if (!response) {
      res.status(400).send({
        success: false,
        message: "No Nutrition Distribution from Model 1.",
      });
      return;
    }
    // console.log(response.data.prediction);

    const fatsPercentage = response.data.prediction[`fats%`];
    const carbsPercentage = response.data.prediction[`carbs%`];
    const proteinsPercentage = response.data.prediction[`proteins%`];

    const totalCalories = health_info.caloric_needs;
    const fatsCalories = (fatsPercentage / 100) * totalCalories;
    const carbsCalories = (carbsPercentage / 100) * totalCalories;
    const proteinsCalories = (proteinsPercentage / 100) * totalCalories;

    console.log(totalCalories);
    const fatsGrams = fatsCalories / 9;
    const carbsGrams = carbsCalories / 4;
    const proteinsGrams = proteinsCalories / 4;

    await db.query(
      "UPDATE HealthProfile SET `fats%` =?, `carbs%`=?, `proteins%`=? WHERE user_id=?",
      [fatsPercentage, carbsPercentage, proteinsPercentage, user_id]
    );

    res.status(200).send({
      success: true,
      message: "User Health Stats retrieved successfully.",
      data: {
        total_steps: health_info.total_steps,
        steps_taken: 4320,
        total_calories: totalCalories,
        consumed_calories: health_info.consumed_calories,
        nutrition: {
          fats: {
            grams: fatsGrams.toFixed(2),
            calories: fatsCalories.toFixed(0),
            percentage: fatsPercentage.toFixed(2),
          },
          carbs: {
            grams: carbsGrams.toFixed(2),
            calories: carbsCalories.toFixed(0),
            percentage: carbsPercentage.toFixed(2),
          },
          proteins: {
            grams: proteinsGrams.toFixed(2),
            calories: proteinsCalories.toFixed(0),
            percentage: proteinsPercentage.toFixed(2),
          },
        },
      },
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in GET Health Track API.",
    });
  }
};

module.exports = { healthTrack };
