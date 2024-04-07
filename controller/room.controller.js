// controllers/RoomController.js
const Room = require("../models/room.model");

async function getAllRooms(req, res) {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createRoom(req, res) {
  const { name } = req.body;
  try {
    const newRoom = await Room.create({ name });
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getRoomById(req, res) {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateRoom(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteRoom(req, res) {
  const { id } = req.params;
  try {
    const deletedRoom = await Room.findByIdAndDelete(id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
};
