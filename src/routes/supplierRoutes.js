const { Router } = require("express");
const { create, list } = require("../controllers/supplierController");
const authMiddleware = require("../middlewares/authMiddleware");

const supplierRoutes = Router();

supplierRoutes.post("/", authMiddleware, create);
supplierRoutes.get("/", authMiddleware, list);

module.exports = supplierRoutes;