const prisma = require("../config/prisma");

async function stockIn({ productId, quantity, description }) {
  if (!productId || !quantity) {
    throw new Error("ProductId and quantity are required");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const quantityNumber = Number(quantity);

  if (quantityNumber <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: {
        quantity: product.quantity + quantityNumber,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        type: "IN",
        quantity: quantityNumber,
        description,
        productId,
      },
    });

    return {
      product: updatedProduct,
      movement,
    };
  });

  return result;
}

async function stockOut({ productId, quantity, description }) {
  if (!productId || !quantity) {
    throw new Error("ProductId and quantity are required");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const quantityNumber = Number(quantity);

  if (quantityNumber <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  if (quantityNumber > product.quantity) {
    throw new Error("Insufficient stock");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: {
        quantity: product.quantity - quantityNumber,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        type: "OUT",
        quantity: quantityNumber,
        description,
        productId,
      },
    });

    return {
      product: updatedProduct,
      movement,
    };
  });

  return result;
}

async function listStockMovements() {
  const movements = await prisma.stockMovement.findMany({
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return movements;
}

async function listLowStockProducts() {
  const products = await prisma.product.findMany({
    where: {
      quantity: {
        lte: prisma.product.fields.minimumStock,
      },
    },
    include: {
      category: true,
      supplier: true,
    },
    orderBy: {
      quantity: "asc",
    },
  });

  return products;
}

module.exports = {
  stockIn,
  stockOut,
  listStockMovements,
  listLowStockProducts,
};