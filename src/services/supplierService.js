const prisma = require("../config/prisma");

async function createSupplier({ name, email, phone }) {
  if (!name) {
    throw new Error("Supplier name is required");
  }

  const supplier = await prisma.supplier.create({
    data: {
      name,
      email,
      phone,
    },
  });

  return supplier;
}

async function listSuppliers() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return suppliers;
}

module.exports = {
  createSupplier,
  listSuppliers,
};