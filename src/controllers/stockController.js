const {
  stockIn,
  stockOut,
  listStockMovements,
  listLowStockProducts,
} = require("../services/stockService");

async function registerStockIn(req, res) {
  try {
    const result = await stockIn(req.body);

    return res.status(201).json({
      message: "Stock entry registered successfully",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function registerStockOut(req, res) {
  try {
    const result = await stockOut(req.body);

    return res.status(201).json({
      message: "Stock output registered successfully",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function listMovements(req, res) {
  try {
    const movements = await listStockMovements();

    return res.status(200).json({
      movements,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function listLowStock(req, res) {
  try {
    const products = await listLowStockProducts();

    return res.status(200).json({
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  registerStockIn,
  registerStockOut,
  listMovements,
  listLowStock,
};