const { Router } = require("express");
const {
  registerStockIn,
  registerStockOut,
  listMovements,
  listLowStock,
} = require("../controllers/stockController");
const authMiddleware = require("../middlewares/authMiddleware");

const stockRoutes = Router();

stockRoutes.post("/in", authMiddleware, registerStockIn);
stockRoutes.post("/out", authMiddleware, registerStockOut);
stockRoutes.get("/movements", authMiddleware, listMovements);
stockRoutes.get("/low", authMiddleware, listLowStock);

module.exports = stockRoutes;