const jwt = require("jsonwebtoken");

function authHeader() {
  const token = jwt.sign({ id: "user-1", email: "alex@email.com" }, process.env.JWT_SECRET);
  return { Authorization: `Bearer ${token}` };
}

module.exports = { authHeader };
