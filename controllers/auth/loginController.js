const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

const loginUser = async (req, res) => {
  const sec_key = "lambda";
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).send({
        success: false,
        message: "Email ID or Password not provided",
      });
    }

    console.log("Checking user credentials");
    // User login
    const [userResult] = await db.query(
      "SELECT user_id, email, password, fname, lname, profile_picture FROM Users WHERE email=?",
      [email]
    );

    console.log("User query result:", userResult);

    if (userResult.length > 0) {
      console.log("User found");
      const userData = userResult[0];
      const isMatch = await bcrypt.compare(password, userData.password);
      // console.log(isMatch, password, userData.password);
      if (isMatch) {
        const token = jwt.sign({ email: userData.email }, sec_key, {
          expiresIn: "1h",
        });
        return res.status(200).send({
          success: true,
          message: "User Logged in Successfully.",
          token: token,
          role: "user",
          id: userData.user_id,
          username: userData.fname + " " + userData.lname,
          pp: userData.profile_picture,
        });
      } else {
        console.log("Invalid user password");
        return res.status(401).send({
          success: false,
          message: "Invalid Password",
        });
      }
    } else {
      // Admin login
      const [adminResult] = await db.query(
        "SELECT admin_id, email, password, fname, lname, profile_picture FROM Admins WHERE email=?",
        [email]
      );

      console.log("Admin query result:", adminResult);

      if (adminResult.length > 0) {
        const adminData = adminResult[0];
        // const isMatch = true;
        const isMatch = await bcrypt.compare(password, adminData.password);
        console.log(isMatch, adminData.password, password);
        if (isMatch) {
          // Direct comparison since admin passwords are not hashed
          const token = jwt.sign({ email: adminData.email }, sec_key, {
            expiresIn: "1h",
          });
          return res.status(200).send({
            success: true,
            message: "Admin Logged in Successfully.",
            token: token,
            role: "admin",
            id: adminData.admin_id,
            username: adminData.fname + " " + adminData.lname,
            pp: adminData.profile_picture,
          });
        } else {
          console.log("Invalid admin password");
          return res.status(401).send({
            success: false,
            message: "Invalid Password",
          });
        }
      }
    }

    return res.status(404).send({
      success: false,
      message: "Invalid Email ID provided.",
    });
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "Error in Login API.",
      error: e.message,
    });
  }
};

module.exports = { loginUser };
