const express = require("express");
const router = express.Router();
const Room = require("../models/room.model");
const Joi = require("joi");
const mongoose = require("mongoose");
const {
  authenticateUser,
  authorizeUser,
} = require("../middleware/auth.middleware");

// Define Joi schema for room creation validation
const createRoomSchema = Joi.object({
  name: Joi.string().required(),
  roomType: Joi.string().required(),
  price: Joi.number().required(),
});

// Create room endpoint
router.post("/", authenticateUser, authorizeUser, async (req, res) => {
  try {
    // Validate request body
    const { error } = createRoomSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Extract room details from request body
    const { name, roomType, price } = req.body;

    // Create new room
    const newRoom = await Room.create({ name, roomType, price });

    // Return success response
    return res
      .status(201)
      .json({ message: "Room created successfully", data: newRoom });
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete room endpoint
router.delete("/:roomId", authenticateUser, authorizeUser, async (req, res) => {
  try {
    // Extract the room ID from request parameters
    const { roomId } = req.params;

    // Validate if roomId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid room ID" });
    }

    // Check if the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // Delete the room from the database
    await Room.deleteOne({ _id: roomId });

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// Update room endpoint
router.put("/:roomId", authenticateUser, authorizeUser, async (req, res) => {
  try {
    // Extract the room ID from request parameters
    const { roomId } = req.params;

    // Validate if roomId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid room ID" });
    }

    // Check if the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // Extract updated room details from request body
    const { name, roomType, price } = req.body;

    // Update the room
    room.name = name;
    room.roomType = roomType;
    room.price = price;
    await room.save();

    // Return success response with updated room data
    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// Retrieve all rooms endpoint
router.get("/", async (req, res) => {
  try {
    // Fetch all rooms from the database
    const rooms = await Room.find();

    // Return rooms in the response
    return res
      .status(200)
      .json({ message: "Rooms retrieved successfully", data: rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET endpoint for fetching a room by its id
router.get("/:id", async (req, res) => {
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

// Filter search
router.get("/search", async (req, res) => {
  try {
    // Parse query parameters
    const { search, roomType, minPrice, maxPrice } = req.query;

    // Construct the filter object
    const filters = {};
    if (search) filters.name = { $regex: search, $options: "i" };
    if (roomType) filters.roomType = roomType;
    if (minPrice) filters.price = { $gte: minPrice };
    if (maxPrice) {
      filters.price = filters.price || {}; // Ensure filters.price exists
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

module.exports = router;
