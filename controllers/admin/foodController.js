const db = require("../../config/db");

const getAllFoods = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM Foods;");
    if (!data) {
      return res.status(404).send({
        success: false,
        message: "Unable to retrieve foods data from database.",
      });
    }

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(200).send({
      success: true,
      message: "Food data retrieved successfully.",
      data: data,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Error in Get All Foods API.",
      error: e,
    });
  }
};

const addFood = async (req, res) => {
  try {
    const {
      food_name,
      category,
      "energy (kCal)": energy,
      "fats (g)": fats,
      "proteins (g)": proteins,
      "carbs (g)": carbs,
      GI,
      GL,
    } = req.body;
    if (
      !food_name ||
      !category ||
      !energy ||
      !fats ||
      !proteins ||
      !carbs ||
      !GI ||
      !GL
    ) {
      return res.status(400).send({
        success: false,
        message: "Missing values in one of the fields.",
      });
    }

    const result = await db.query(
      "INSERT INTO Foods(food_name, category, `energy (kCal)`, `fats (g)`, `proteins (g)`, `carbs (g)`, GI, GL) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
      [food_name, category, energy, fats, proteins, carbs, GI, GL]
    );
    if (!result) {
      return res.status(500).send({
        success: false,
        message: "Unable to add food information",
      });
    }
    return res.status(200).send({
      success: true,
      message: "New Food Added Successfully.",
      data: {
        food_id: result[0].insertId,
        food_name,
        category,
        "energy (kCal)": energy,
        "fats (g)": fats,
        "proteins (g)": proteins,
        "carbs (g)": carbs,
        GI,
        GL,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Error in Add Food API.",
      error: e,
    });
  }
};

const editFood = async (req, res) => {
  try {
    const food_id = req.params.id;
    if (!food_id) {
      return res.status(404).send({
        success: false,
        message: "No Food ID provided..",
      });
    }

    const {
      food_name,
      category,
      "energy (kCal)": energy,
      "fats (g)": fats,
      "proteins (g)": proteins,
      "carbs (g)": carbs,
      GI,
      GL,
    } = req.body;
    if (
      !food_name ||
      !category ||
      !energy ||
      !fats ||
      !proteins ||
      !carbs ||
      !GI ||
      !GL
    ) {
      return res.status(404).send({
        success: false,
        message: "Missing fields in the input data.",
      });
    }

    console.log("Food ID: ", food_id);
    const result = await db.query(
      "UPDATE Foods SET food_name=?, category=?, `energy (kCal)`=?, `fats (g)`=?, `proteins (g)`=?, `carbs (g)`=?, GI=?, GL=? WHERE food_id=?",
      [food_name, category, energy, fats, proteins, carbs, GI, GL, food_id]
    );

    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Unable to update food info in the database.",
      });
    }

    // Success Case
    return res.status(200).send({
      success: true,
      message: "Food Information updated successfully.",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Error in Edit Food API.",
      error: e,
    });
  }
};

const deleteFood = async (req, res) => {
  try {
    const food_id = req.params.id;
    if (!food_id) {
      return res.status(404).status({
        success: false,
        message: "Food ID not provided.",
      });
    }
    const result = await db.query("DELETE FROM Foods WHERE food_id=?", [
      food_id,
    ]);
    if (!result) {
      return res.status(404).send({
        success: false,
        message: "Unable to delete selected food item.",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Selected Food Item Deleted Successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      success: false,
      message: "Error in Delete Food API.",
      error: e,
    });
  }
};

module.exports = { getAllFoods, addFood, editFood, deleteFood };
