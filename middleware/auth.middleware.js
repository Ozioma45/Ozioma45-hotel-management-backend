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
    // Pass the error to the error handling middleware
    next(error);
  }
};

// Authorization middleware
const authorizeUser = (roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles array
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: "User does not have permission to access this resource",
        });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeUser };
