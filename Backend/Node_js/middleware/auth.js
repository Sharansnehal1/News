const jwt = require("jsonwebtoken");
const JWT_SECRET = "yourSecretKey";
const tokenBlacklist = require("../utils/blacklist");

module.exports = function (req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "No token provided" });
   const tokens = token.split(" ")[1]; // "Bearer <token>"

  if (!tokens) {
    return res.status(401).json({ message: "Token missing" });
  }

   if (tokenBlacklist.includes(tokens)) {
    return res.status(401).json({ message: "Token expired, please login again" });
  }

  
  jwt.verify(tokens, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.userId = decoded.id;
    next();
  });
};
