const db = require("../../config/db");

const getAllUsers = async (req, res) => {
  try {
    const [user_data] = await db.query(
      "SELECT user_id, fname, lname, email, dob, gender, country, city, status FROM Users"
    );

    if (!user_data.length) {
      return res.status(400).send({
        success: false,
        message: "Unable to retrieve User's Data",
      });
    }

    const [health_data] = await db.query(
      "SELECT user_id, diabetes_type, `weight (kgs)` as weight, `height (m)` as height, hbA1c, activity_level FROM HealthProfile"
    );

    if (!health_data.length) {
      return res.status(400).send({
        success: false,
        message: "Unable to retrieve User's Health Data",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User Profile and Health Data retrieved successfully.",
      user_data: user_data,
      health_data: health_data,
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Error in Get Users API.",
      error: e.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    if (!user_id) {
      return res.status(400).send({
        success: false,
        message: "User ID not provided.",
      });
    }
    const { fname, lname, dob, gender, country, city } = req.body;
    if (!fname || !lname || !dob || !gender || !country || !city) {
      return res.status(400).send({
        success: false,
        message: "One or more fields are missing.",
      });
    }

    const [result] = await db.query(
      "UPDATE Users SET fname=?, lname=?, dob=?, gender=?, country=?, city=? WHERE user_id=?",
      [fname, lname, dob, gender, country, city, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).send({
        success: false,
        message: "Unable to Update the User Data in the database.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User Data Updated Successfully.",
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Error in Update User Data API.",
      error: e.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    if (!user_id) {
      return res.status(400).send({
        success: false,
        message: "User ID not provided.",
      });
    }

    const [result] = await db.query(
      "DELETE FROM HealthProfile WHERE user_id=?",
      [user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).send({
        success: false,
        message: "Unable to Delete User Health Profile",
      });
    }

    const [result_2] = await db.query("DELETE FROM Users WHERE user_id=?", [
      user_id,
    ]);

    if (result_2.affectedRows === 0) {
      return res.status(400).send({
        success: false,
        message: "Unable to Delete User",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User Deleted Successfully.",
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Error in Delete User API.",
      error: e.message,
    });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser };
