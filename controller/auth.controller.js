const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { generateToken } = require("../services/auth.service");
const asyncHandler = require("express-async-handler");

// Route handler for user registration
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // create hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  })
);

// Route handler for user login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error("User not found"); // Handle case where user is not found
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  })
);

module.exports = router;
