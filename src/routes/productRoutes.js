const { Router } = require("express");
const {
  create,
  list,
  show,
  update,
  remove,
} = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");

const productRoutes = Router();

productRoutes.post("/", authMiddleware, create);
productRoutes.get("/", authMiddleware, list);
productRoutes.get("/:id", authMiddleware, show);
productRoutes.put("/:id", authMiddleware, update);
productRoutes.delete("/:id", authMiddleware, remove);

module.exports = productRoutes;