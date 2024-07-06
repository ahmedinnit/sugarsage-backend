const db = require("../../config/db");

const getAllFeedbacks = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM Feedbacks");
    if (!data) {
      res.status(404).send({
        success: false,
        message: "Unable to retrieve feedbacks from Database.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Feedbacks retrieved successfully.",
      data: data,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error in Get All Feedbacks API.",
      error: e,
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedback_id = req.params.id;
    if (!feedback_id) {
      res.status(404).status({
        success: false,
        message: "Feedback ID not provided.",
      });
    }
    const result = await db.query("DELETE FROM Feedbacks WHERE feedback_id=?", [
      feedback_id,
    ]);
    if (!result) {
      res.status(404).send({
        success: false,
        message: "Unable to delete selected feedback.",
      });
    }
    res.status(200).send({
      success: true,
      message: "Feedback Deleted Successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error in Delete Feedback API.",
      error: e,
    });
  }
};

module.exports = { getAllFeedbacks, deleteFeedback };
