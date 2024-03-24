// auth.middleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authentication token is missing" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database based on the user ID stored in the token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User associated with token not found" });
    }

    // Attach the user object to the request for future use
    req.user = user;

    // Move to the next middleware
    next();
  } catch (error) {
    // Handle JWT verification errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else {
      next(error);
    }
  }
};

// Authorization middleware
const authorizeUser = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  // Check if user is an admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "User does not have permission to perform this action",
    });
  }

  // If the user is authenticated and is an admin, allow access
  next();
};

module.exports = { authenticateUser, authorizeUser };
