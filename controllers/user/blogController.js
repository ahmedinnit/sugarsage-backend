const db = require("../../config/db");

const getAllBlogs = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT blog_author, blog_title, blog_description, source_url, image_url FROM Blogs;"
    );

    if (!result) {
      res.status(404).send({
        success: false,
        message: "Unable to Retrieve Blog Data.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Blog Data retrieved successfully.",
      data: result,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Blogs API.",
      error: e.message,
    });
  }
};

module.exports = { getAllBlogs };
