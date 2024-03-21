const Joi = require("joi");

// Validation schema for creating a room
const createRoomSchema = Joi.object({
  name: Joi.string().required(),
  roomType: Joi.string().required(),
  price: Joi.number().required(),
});

// Validation schema for updating a room
const updateRoomSchema = Joi.object({
  name: Joi.string(),
  roomType: Joi.string(),
  price: Joi.number(),
});

// Middleware function to validate request body against the schema
const validateRoom = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

module.exports = {
  createRoomSchema,
  updateRoomSchema,
  validateRoom,
};
