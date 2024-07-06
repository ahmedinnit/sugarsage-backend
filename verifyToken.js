const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const secretKey = "lambda";
  const token = req.headers["authorization"];
  // console.log("Backend token: ", token);
  if (!token) return res.status(403).send({ message: "No token provided" });
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err)
      return res.status(401).send({ message: "Failed to authenticate token" });
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
