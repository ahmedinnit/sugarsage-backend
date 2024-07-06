const express = require("express");
const morgan = require("morgan");
const db = require("./config/db");
const cors = require("cors");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const passport = require("passport");
// require("./config/passportConfig")(passport); // Passport configuration

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const PORT = process.env.PORT || 3001;

//  Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// Conditional Listen
db.query("SELECT 1")
  .then(() => {
    console.log("Database Connection Established");

    // Listening for Requests
    app.listen(PORT, () => {
      console.log(`Listening at PORT ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
