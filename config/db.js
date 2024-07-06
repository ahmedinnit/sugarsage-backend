const mysql = require("mysql2/promise");
// const dotenv = require("dotenv");

// dotenv.config({ path: "../.env" });

// const pool = mysql.createPool({
//   database: process.env.DATABASE,
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
// });

const pool = mysql.createPool({
  database: "sugarsage_db",
  host: "localhost",
  user: "root",
  password: "",
});

module.exports = pool;
