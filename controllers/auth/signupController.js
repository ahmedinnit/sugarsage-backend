const bcrypt = require("bcryptjs");
const db = require("../../config/db");

const signupUser = async (req, res) => {
  try {
    const {
      email,
      password,
      fname,
      lname,
      dob,
      gender,
      country,
      city,
      weight,
      height,
      activityLevel,
      hbA1cScore,
      diabetesType,
    } = req.body;

    console.log(
      email,
      password,
      fname,
      lname,
      dob,
      gender,
      country,
      city,
      weight,
      height,
      activityLevel,
      hbA1cScore,
      diabetesType
    );
    if (
      !email ||
      !password ||
      !fname ||
      !lname ||
      !dob ||
      !gender ||
      !country ||
      !city ||
      !activityLevel ||
      !weight ||
      !height ||
      !hbA1cScore ||
      !diabetesType
    ) {
      return res.status(404).send({
        success: false,
        message: "Registration data not provided.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(password, hashedPassword);

    const result1 = await db.query(
      "INSERT INTO Users(email, password, fname, lname, dob, gender, country, city) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      [email, hashedPassword, fname, lname, dob, gender, country, city]
    );

    if (!result1) {
      return res.status(404).send({
        success: false,
        message: "Unable to Register User Profile Details.",
      });
    }
    const user_id = result1[0].insertId;
    console.log(user_id);
    const result2 = await db.query(
      "INSERT INTO HealthProfile (user_id, diabetes_type, `height (m)`, `weight (kgs)`, hbA1c, activity_level) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, diabetesType, height, weight, hbA1cScore, activityLevel]
    );

    if (!result2) {
      return res.status(404).send({
        success: false,
        message: "Unable to Register User Health Profile Details.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User registered successfully.",
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Error in Register API: " + e,
    });
  }
};

module.exports = { signupUser };
