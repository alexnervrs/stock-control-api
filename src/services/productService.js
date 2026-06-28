const prisma = require("../config/prisma");

async function createProduct({
  name,
  description,
  price,
  quantity,
  minimumStock,
  categoryId,
  supplierId,
}) {
  if (!name || price === undefined || !categoryId) {
    throw new Error("Name, price and categoryId are required");
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!categoryExists) {
    throw new Error("Category not found");
  }

  if (supplierId) {
    const supplierExists = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });

    if (!supplierExists) {
      throw new Error("Supplier not found");
    }
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      quantity: quantity ? Number(quantity) : 0,
      minimumStock: minimumStock ? Number(minimumStock) : 0,
      categoryId,
      supplierId,
    },
    include: {
      category: true,
      supplier: true,
    },
  });

  return product;
}

async function listProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      supplier: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return products;
}

async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      supplier: true,
      movements: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

async function updateProduct(id, data) {
  const productExists = await prisma.product.findUnique({
    where: { id },
  });

  if (!productExists) {
    throw new Error("Product not found");
  }

  if (data.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!categoryExists) {
      throw new Error("Category not found");
    }
  }

  if (data.supplierId) {
    const supplierExists = await prisma.supplier.findUnique({
      where: { id: data.supplierId },
    });

    if (!supplierExists) {
      throw new Error("Supplier not found");
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      price: data.price !== undefined ? Number(data.price) : undefined,
      quantity: data.quantity !== undefined ? Number(data.quantity) : undefined,
      minimumStock:
        data.minimumStock !== undefined ? Number(data.minimumStock) : undefined,
    },
    include: {
      category: true,
      supplier: true,
    },
  });

  return product;
}

async function deleteProduct(id) {
  const productExists = await prisma.product.findUnique({
    where: { id },
  });

  if (!productExists) {
    throw new Error("Product not found");
  }

  await prisma.product.delete({
    where: { id },
  });

  return {
    message: "Product deleted successfully",
  };
}

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};