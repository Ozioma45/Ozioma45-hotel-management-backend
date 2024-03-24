const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Function to compare a password with its hashed version
async function comparePasswords(password, hashedPassword) {
  console.log(
    "Comparing password:",
    password,
    "with hashed password:",
    hashedPassword
  );
  // Compare the provided password with the hashed password stored in the database
  return bcrypt.compare(password, hashedPassword);
}

module.exports = { generateToken, comparePasswords };
