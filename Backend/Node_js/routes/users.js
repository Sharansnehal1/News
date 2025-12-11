const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const tokenBlacklist = require("../utils/blacklist");

const router = express.Router();
const JWT_SECRET = "yourSecretKey"; // store in .env later

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.json({ success: true, message: "User registered", user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/logout", (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(400).json({ message: "Token missing" });

  tokenBlacklist.push(token);
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
