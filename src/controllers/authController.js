const { registerUser, loginUser } = require("../services/authService");

async function register(req, res) {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}

module.exports = {
  register,
  login,
};