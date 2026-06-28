const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  const userAlreadyExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userAlreadyExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};