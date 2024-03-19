const { Schema, model } = require("mongoose");

const RoomType = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RoomTypeModel = model("room-types", RoomType);

module.exports = RoomTypeModel;
