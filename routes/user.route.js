const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const mongoose = require("mongoose");

// Endpoint to change user role
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's role
    user.role = role;
    await user.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
