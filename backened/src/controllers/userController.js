// src/controllers/userController.js
const { User } = require('../config/db');

const bcrypt = require('bcrypt'); // for password hashing

// ✅ Create new user (Register)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 👉 Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // salt rounds = 10

    // 👉 Create user with hashed password
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // 👉 Remove password from response
    const { password: removed, ...userData } = newUser.toJSON();

    return res.status(201).json(userData);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
};

// ✅ Get all users (without password)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // exclude password from response
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};
