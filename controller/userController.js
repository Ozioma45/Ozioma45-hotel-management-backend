// controllers/UserController.js
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const users = [
  { id: 1, username: "Ozioma", password: "Ozi123", role: "user" },
  { id: 2, username: "Favour", password: "fev345", role: "admin" },
];

async function loginUser(req, res) {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT token with user data
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET
  );

  // Send the token back to the client
  res.json({ token });
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { username, password, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, password, role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};
