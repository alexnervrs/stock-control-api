const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    message: "Stock Control API is running",
  });
});

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);

module.exports = app;