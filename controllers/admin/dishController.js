const db = require("../../config/db");

const getAllDishes = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM Dishes");
    if (!data) {
      res.status(404).send({
        success: false,
        message: "Unable to retrieve dish items from Database.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Dish Items retrieved successfully.",
      data: data,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error in Get All Dishes API.",
      error: e,
    });
  }
};

const addDish = async (req, res) => {
  try {
    const {
      dish_name,
      category,
      season,
      total_calories,
      fats,
      proteins,
      carbs,
      GL,
      //   ingredients,
      //   recipe,
    } = req.body;
    if (
      !dish_name ||
      !category ||
      !season ||
      !total_calories ||
      !fats ||
      !proteins ||
      !carbs ||
      !GL
      //   || !ingredients ||
      //   !recipe
    ) {
      return res.status(400).send({
        success: false,
        message: "Missing values in one of the fields.",
      });
    }

    const result = await db.query(
      "INSERT INTO Dishes(dish_name, category, season, total_calories, fats, proteins, carbs, gl) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
      [
        dish_name,
        category,
        season,
        total_calories,
        fats,
        proteins,
        carbs,
        GL,
        // ingredients,
        // recipe,
      ]
    );

    if (!result) {
      return res.status(500).send({
        success: false,
        message: "Unable to add new Dish Item.",
      });
    }

    return res.status(200).send({
      success: true,
      message: "New Dish Item Added Successfully.",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Error in Add Dish API.",
      error: e,
    });
  }
};

const updateDish = async (req, res) => {
  try {
    const dish_id = req.params.id;
    if (!dish_id) {
      res.status(404).send({
        success: false,
        message: "No Dish ID provided..",
      });
    }

    const {
      dish_name,
      category,
      season,
      total_calories,
      fats,
      proteins,
      carbs,
      GL,
      //   ingredients,
      //   recipe,
    } = req.body;
    if (
      (!dish_name || !category || !season || !total_calories,
      !fats || !proteins || !carbs || !GL)
      //   || !ingredients || !recipe)
    ) {
      res.status(404).send({
        success: false,
        message: "Missing fields in the input data.",
      });
    }

    console.log("Dish ID: ", dish_id);
    const result = await db.query(
      "UPDATE Dishes SET dish_name=?, category=?, season=?, total_calories=?, fats=?, proteins=?, carbs=?, GL=? WHERE dish_id=?",
      [
        dish_name,
        category,
        season,
        total_calories,
        fats,
        proteins,
        carbs,
        GL,
        // ingredients,
        // recipe,
        dish_id,
      ]
    );

    if (!result) {
      res.status(404).send({
        success: false,
        message: "Unable to update Dish item in the database.",
      });
    }

    // Success Case
    res.status(200).send({
      success: true,
      message: "Dish Item updated successfully.",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error in Update Dish API.",
      error: e,
    });
  }
};

const deleteDish = async (req, res) => {
  try {
    const dish_id = req.params.id;
    if (!dish_id) {
      res.status(404).status({
        success: false,
        message: "Dish ID not provided.",
      });
    }
    const result = await db.query("DELETE FROM Dishes WHERE dish_id=?", [
      dish_id,
    ]);
    if (!result) {
      res.status(404).send({
        success: false,
        message: "Unable to delete selected Dish Item.",
      });
    }
    res.status(200).send({
      success: true,
      message: "Dish Item Deleted Successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error in Delete Dish API.",
      error: e,
    });
  }
};

module.exports = { getAllDishes, addDish, updateDish, deleteDish };
