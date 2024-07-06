const db = require("../../config/db");

const postFeedback = async (req, res) => {
  try {
    const user_id = req.params.id;
    if (!user_id) {
      res.status(400).send({
        success: false,
        message: "No User ID provided.",
      });
    }
    const { feedback_topic, feedback_type, feedback_title, description } =
      req.body;
    console.log(feedback_topic, feedback_type, feedback_title, description);
    if (!feedback_topic || !feedback_type || !feedback_title || !description) {
      res.status(400).send({
        success: false,
        message: "One of the fields is missing.",
      });
    }

    const result = await db.query(
      "INSERT INTO Feedbacks (user_id, feedback_type, feedback_topic, feedback_title, description) VALUES(?, ?, ?, ?, ?)",
      [user_id, feedback_type, feedback_topic, feedback_title, description]
    );

    if (!result) {
      res.status(400).send({
        success: false,
        message: "Unable to Add User Feedback",
      });
    }

    res.status(200).send({
      success: true,
      message: "User Feedback Added Successfully.",
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Error in Add User Feedback API.",
      error: e.message,
    });
  }
};

module.exports = { postFeedback };
