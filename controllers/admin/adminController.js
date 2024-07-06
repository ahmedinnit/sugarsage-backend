const Admin = require("../../models/adminModel");

// Example function: Fetch all admins (just an example of what might be here)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll(); // Assuming findAll method exists in adminModel
    res.status(200).json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
};
