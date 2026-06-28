const { Router } = require("express");
const { create, list } = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");

const categoryRoutes = Router();

categoryRoutes.post("/", authMiddleware, create);
categoryRoutes.get("/", authMiddleware, list);

module.exports = categoryRoutes;