// routes/users.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User } = require('../config/db');


// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      phone,
      address,
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "User registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
