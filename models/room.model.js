const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoomType", // Assuming you have a RoomType model
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
