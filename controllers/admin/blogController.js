const db = require("../../config/db");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dqem8pi4b",
  api_key: "395699258342138",
  api_secret: "9kxTkWQjBYXr0j-hnn93Kqm5yuo",
});

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM Blogs");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Unable to retrieve blogs from the database.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Blogs retrieved successfully.",
      data: data,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error in Get All Blogs API.",
      error: e,
    });
  }
};

// Add a blog
const addBlog = async (req, res) => {
  try {
    const { blog_author, blog_title, blog_description, source_url } = req.body;
    const blog_image = req.body.image;
    console.log(
      blog_author,
      blog_title,
      blog_description,
      source_url,
      blog_image
    );

    if (
      !blog_author ||
      !blog_title ||
      !blog_description ||
      !source_url ||
      !blog_image
    ) {
      return res.status(400).send({
        success: false,
        message: "Missing values in one of the fields.",
      });
    }

    const result = await db.query(
      "INSERT INTO Blogs (blog_author, blog_title, blog_description, source_url, image_url) VALUES (?, ?, ?, ?, ?);",
      [blog_author, blog_title, blog_description, source_url, blog_image]
    );

    if (!result) {
      return res.status(500).send({
        success: false,
        message: "Unable to add new blog post.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "New blog post added successfully.",
      data: {
        id: result.insertId,
        blog_author,
        blog_title,
        blog_description,
        source_url,
        blog_image,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Error in Add Blog API.",
      error: e,
    });
  }
};

// Update a blog
const updateBlog = async (req, res) => {
  try {
    const blog_id = req.params.id;
    const { blog_author, blog_title, blog_description, source_url, image } =
      req.body;
    console.log(req.body);
    // console.log(
    //   blog_id,
    //   blog_author,
    //   blog_title,
    //   blog_description,
    //   source_url,
    //   image,
    //   blogFormData
    // );
    if (
      !blog_id ||
      !blog_author ||
      !blog_title ||
      !blog_description ||
      !source_url ||
      !image
    ) {
      return res.status(400).send({
        success: false,
        message: "Missing values in one of the fields.",
      });
    }

    const result = await db.query(
      "UPDATE Blogs SET blog_author=?, blog_title=?, blog_description=?, source_url=?, image_url=? WHERE blog_id=?",
      [blog_author, blog_title, blog_description, source_url, image, blog_id]
    );

    if (!result) {
      return res.status(500).send({
        success: false,
        message: "Unable to update blog post.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Blog post updated successfully.",
      data: {
        id: blog_id,
        blog_author,
        blog_title,
        blog_description,
        source_url,
        image,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Error in Update Blog API.",
      error: e,
    });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const blog_id = req.params.id;
    if (!blog_id) {
      return res.status(400).send({
        success: false,
        message: "No Blog ID provided.",
      });
    }

    const result = await db.query("DELETE FROM Blogs WHERE blog_id=?", [
      blog_id,
    ]);

    if (!result) {
      return res.status(500).send({
        success: false,
        message: "Unable to delete blog post.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Blog post deleted successfully.",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Error in Delete Blog API.",
      error: e,
    });
  }
};

module.exports = { getAllBlogs, addBlog, updateBlog, deleteBlog };
