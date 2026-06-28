const { Router } = require("express");
const { register, login } = require("../controllers/authController");

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);

module.exports = authRoutes;