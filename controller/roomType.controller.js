// controllers/RoomTypeController.js
const RoomType = require("../models/roomTypes");

async function getAllRoomTypes(req, res) {
  try {
    const roomTypes = await RoomType.find();
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createRoomType(req, res) {
  const { name } = req.body;
  try {
    const newRoomType = await RoomType.create({ name });
    res.status(201).json(newRoomType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getRoomTypeById(req, res) {
  const { id } = req.params;
  try {
    const roomType = await RoomType.findById(id);
    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }
    res.json(roomType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateRoomType(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedRoomType = await RoomType.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedRoomType) {
      return res.status(404).json({ message: "Room type not found" });
    }
    res.json(updatedRoomType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteRoomType(req, res) {
  const { id } = req.params;
  try {
    const deletedRoomType = await RoomType.findByIdAndDelete(id);
    if (!deletedRoomType) {
      return res.status(404).json({ message: "Room type not found" });
    }
    res.json({ message: "Room type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getAllRoomTypes,
  createRoomType,
  getRoomTypeById,
  updateRoomType,
  deleteRoomType,
};
