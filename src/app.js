const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const productRoutes = require("./routes/productRoutes");
const stockRoutes = require("./routes/stockRoutes");

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
app.use("/suppliers", supplierRoutes);
app.use("/products", productRoutes);
app.use("/stock", stockRoutes);

module.exports = app;