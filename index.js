const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const albumRoutes = require("./routes/albums");
const albumImagesRoutes = require("./routes/albumImages");

const { PORT, DB_URI } = process.env;

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/albums", albumRoutes);
app.use("/api/albumImages", albumImagesRoutes);


// database connection
mongoose.connect(DB_URI);
mongoose.connection.on("open", () =>
  console.log("Connected to database successfully")
);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));