const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const RoomTypeModel = require("../models/room-types.model");
const Room = require("../models/room.model");
const appResponse = require("../utils/appResponse");
const {
  validateRoom,
  createRoomSchema,
  updateRoomSchema,
} = require("../validators/roomValidator");

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

router.post("/rooms", async (req, res) => {
  try {
    const { name, roomType, price } = req.body;

    // Validate input
    if (!name || !roomType || !price) {
      return res.status(400).json({ success: false, message: "Invalid input" });
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
});

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

// POST endpoint for creating a room
router.post("/rooms", validateRoom(createRoomSchema), async (req, res) => {
  // Process request if validation passes
  try {
    const newRoom = await Room.create(req.body);
    res
      .status(201)
      .json({ message: "Room created successfully", data: newRoom });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// PATCH endpoint for updating a room
router.patch("/rooms/:id", validateRoom(updateRoomSchema), async (req, res) => {
  // Process request if validation passes
  try {
    const { id } = req.params;
    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res
      .status(200)
      .json({ message: "Room updated successfully", data: updatedRoom });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
