const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const RoomTypeModel = require("../models/room-types.model");
const Room = require("../models/room.model");
const appResponse = require("../utils/appResponse");
const { validate } = require("../middleware/validate.middleware");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

// Define Joi schema for user registration validation
const registrationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required().min(6), // Example: minimum password length of 6 characters
});

router.post("/room-types", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return appResponse(res, 400, "Invalid name");

    // Check if the name already exists
    const existingRoomType = await RoomTypeModel.findOne({ name });
    if (existingRoomType) return appResponse(res, 400, "Name already exists");

    // Create new room type
    const newRoomType = await RoomTypeModel.create({ name });

    // Check if the room type was created successfully
    if (!newRoomType) {
      return appResponse(
        res,
        400,
        "Unable to create room type, please try again later"
      );
    }

    // Send success response
    return appResponse(res, 201, "Resource created successfully", newRoomType);
  } catch (error) {
    console.error("Error creating room type:", error);
    return appResponse(res, 500, "Internal server error");
  }
});

// POST endpoint for creating a room
router.post(
  "/rooms",
  authenticateUser,
  authorizeUser(["admin"]),
  validate(createRoomSchema),
  async (req, res) => {
    // Process request if validation passes
    try {
      const { name, roomType, price } = req.body;

      // Validate input
      if (!name || !roomType || !price) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid input" });
      }

      // Create new room
      const newRoom = await Room.create({ name, roomType, price });

      // Send success response
      return res.status(201).json({
        success: true,
        message: "Room created successfully",
        data: newRoom,
      });
    } catch (error) {
      console.error("Error creating room:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);

//Get endpoint for fetching all rooms
router.get("/room-types", async (req, res) => {
  try {
    // Fetch all room types from the database
    const roomTypes = await RoomTypeModel.find();

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Room types retrieved successfully",
      data: roomTypes,
    });
  } catch (error) {
    console.error("Error fetching room types:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

//filter search
router.get("/rooms", async (req, res) => {
  try {
    // Parse query parameters
    const { search, roomType, minPrice, maxPrice } = req.query;

    // Construct the filter object
    const filters = {};
    if (search) filters.name = { $regex: search, $options: "i" };
    if (roomType) filters.roomType = roomType;
    if (minPrice) filters.price = { $gte: minPrice };
    if (maxPrice) {
      if (!minPrice) filters.price = { $gte: 0 };
      filters.price.$lte = maxPrice;
    }

    // Fetch rooms based on filters
    const rooms = await Room.find(filters).populate("roomType");

    // Return the rooms as a response
    return res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      data: rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

//to delete room
router.delete("/rooms/:roomId", async (req, res) => {
  try {
    // Extract the room ID from request parameters
    const { roomId } = req.params;

    // Log the roomId parameter
    console.log("roomId:", roomId);

    // Validate if roomId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID",
      });
    }

    // Check if the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Delete the room from the database
    await room.deleteOne({ _id: roomId });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET endpoint for fetching a room by its id
router.get("/rooms/:id", async (req, res) => {
  try {
    const roomId = req.params.id;

    // Query the database for the room with the specified id
    const room = await Room.findById(roomId);

    // Check if the room exists
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // If the room exists, return it as a response
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching room:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Define Joi schema for request body validation
const createRoomSchema = Joi.object({
  name: Joi.string().required(),
  roomType: Joi.string().required(),
  price: Joi.number().required(),
});

// User registration endpoint
router.post("/register", async (req, res) => {
  try {
    // Validate request body
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Extract username and password from request body
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: "guest", // Default role for new users
    });

    // Return success response
    return res
      .status(201)
      .json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Endpoint to change user role
router.put("/users/:userId", async (req, res) => {
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
