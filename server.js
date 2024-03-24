require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

// Import routers
const authRoutes = require("./controller/auth.controller");
const roomRoutes = require("./routes/room.route");
const userRoutes = require("./routes/user.route");

const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
