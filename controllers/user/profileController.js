const db = require("../../config/db");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dqem8pi4b",
  api_key: "395699258342138",
  api_secret: "9kxTkWQjBYXr0j-hnn93Kqm5yuo",
});

// Get all blogs
const getProfile = async (req, res) => {
  try {
    const user_id = req.params.id;
    const [data] = await db.query(
      "SELECT fname, lname, email, password, dob, gender, country, city, phoneNumber, profile_picture FROM Users WHERE user_id=?",
      [user_id]
    );
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Unable to retrieve User Information from the database.",
      });
    }

    res.status(200).send({
      success: true,
      message: "User Information retrieved successfully.",
      data: data,
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

const updateProfile = async (req, res) => {
  try {
    const user_id = req.params.id;
    if (!user_id) {
      res.status(404).send({
        success: false,
        message: "User ID not provided.",
      });
    }
    const {
      fname,
      lname,
      dob,
      gender,
      country,
      city,
      password,
      phoneNumber,
      profile_picture,
    } = req.body;

    console.log(gender);
    console.log(
      user_id,
      fname,
      lname,
      dob,
      gender,
      country,
      city,
      password,
      phoneNumber,
      profile_picture
    );

    if (
      !fname ||
      !lname ||
      !dob ||
      !gender ||
      !country ||
      !city ||
      !password ||
      !phoneNumber ||
      !profile_picture
    ) {
      return res.status(400).send({
        success: false,
        message: "Missing values in one of the fields.",
      });
    }

    const getPassword = await db.query(
      "SELECT password FROM Users WHERE user_id=?",
      [user_id]
    );

    let new_pass;
    console.log(password, getPassword[0][0].password);
    if (password == getPassword[0][0].password) {
      new_pass = password;
    } else {
      const isMatch = bcrypt.compare(password, getPassword[0][0].password);
      console.log(
        "Same ditto Password: ",
        password,
        getPassword[0][0].password
      );
      if (isMatch) {
        new_pass = await bcrypt.hash(password, 10);
      }
    }

    const result = await db.query(
      "UPDATE Users SET fname=?, lname=?, dob=?, gender=?, country=?, city=?, password=?, phoneNumber=?, profile_picture=? WHERE user_id=?",
      [
        fname,
        lname,
        dob,
        gender,
        country,
        city,
        password,
        phoneNumber,
        profile_picture,
        user_id,
      ]
    );

    if (!result) {
      return res.status(500).send({
        success: false,
        message: "Unable to Update User Info.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User Information Updated Successfully.",
      data: {
        // id: result.user_id,
        fname,
        lname,
        password,
        dob,
        gender,
        country,
        city,
        password,
        phoneNumber,
        profile_picture,
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

// const deleteAccount = async (req, res) => {
//   try {
//     const admin_id = req.params.id;
//     if (!admin_id) {
//       return res.status(404).send({
//         success: false,
//         message: "No Admin ID provided.",
//       });
//     }

//     const result = await db.query(
//       "UPDATE Admins SET status=0 WHERE admin_id=?",
//       [admin_id]
//     );

//     if (!result) {
//       return res.status(500).send({
//         success: false,
//         message: "Unable to Delete Admin Account.",
//       });
//     }

//     return res.status(200).send({
//       success: true,
//       message: "Admin Account deleted successfully.",
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).send({
//       success: false,
//       message: "Error in Delete Admin API.",
//       error: e,
//     });
//   }
// };

module.exports = { getProfile, updateProfile /*, deleteAccount */ };
