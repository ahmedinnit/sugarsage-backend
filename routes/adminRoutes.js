const express = require("express");

const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/admin/userController");

const {
  getAllFoods,
  addFood,
  editFood,
  deleteFood,
} = require("../controllers/admin/foodController");

const {
  getAllDishes,
  addDish,
  updateDish,
  deleteDish,
} = require("../controllers/admin/dishController");

const {
  getAllFeedbacks,
  deleteFeedback,
} = require("../controllers/admin/feedbackController");

const { verifyToken } = require("../verifyToken");

const {
  getAllBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/admin/blogController");

const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/admin/profileController");

// Router Setup
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Profile Routes
router.get("/user/getall/", verifyToken, getAllUsers);
router.put("/user/update/:id", verifyToken, updateUser);
router.delete("/user/delete/:id", verifyToken, deleteUser);

// Food Routes
router.get("/getallfoods", verifyToken, getAllFoods);
router.post("/addfood", verifyToken, addFood);
router.put("/editfood/:id", verifyToken, editFood);
router.delete("/deletefood/:id", verifyToken, deleteFood);

// Dish Routes
router.get("/dish/getall", verifyToken, getAllDishes);
router.post("/dish/add", verifyToken, addDish);
router.put("/dish/update/:id", verifyToken, updateDish);
router.delete("/dish/delete/:id", verifyToken, deleteDish);

// Feedback Routes
router.get("/feedback/getall", verifyToken, getAllFeedbacks);
router.delete("/feedback/delete/:id", verifyToken, deleteFeedback);

// Blog Routes
router.get("/blog/getall", verifyToken, getAllBlogs);
router.post("/blog/add", upload.none(), verifyToken, addBlog);
router.put("/blog/update/:id", upload.none(), verifyToken, updateBlog);
router.delete("/blog/delete/:id", verifyToken, deleteBlog);

// Profile Routes
router.post("/profile/get/:id", upload.none(), verifyToken, getProfile);
router.put("/profile/update/:id", upload.none(), verifyToken, updateProfile);
router.delete("/profile/delete/:id", verifyToken, deleteAccount);

module.exports = router;
