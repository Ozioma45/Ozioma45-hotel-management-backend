require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/v1", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
