const prisma = require("../config/prisma");

async function createCategory({ name }) {
  if (!name) {
    throw new Error("Category name is required");
  }

  const categoryAlreadyExists = await prisma.category.findUnique({
    where: { name },
  });

  if (categoryAlreadyExists) {
    throw new Error("Category already exists");
  }

  const category = await prisma.category.create({
    data: {
      name,
    },
  });

  return category;
}

async function listCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories;
}

module.exports = {
  createCategory,
  listCategories,
};
