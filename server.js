require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./src/config/db.config");
const songRoute = require("./src/routes/song.route");

const cors = require("cors");
const PORT = process.env.PORT || 5000;

//connect to MongoDB
connectDB();

// built-in middleware for json
app.use(express.json());

app.use(cors());

app.use("/api", songRoute);
app.use("*", (req, res) => res.status(404).json({ message: "No Api Found " }));

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
