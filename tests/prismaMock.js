// Mock do Prisma Client: os testes rodam sem banco de dados real.
const prismaMock = {
  user: { findUnique: jest.fn(), create: jest.fn() },
  category: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn() },
  supplier: { findUnique: jest.fn(), create: jest.fn(), findMany: jest.fn() },
  product: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    fields: { minimumStock: "minimumStock" },
  },
  stockMovement: { create: jest.fn(), findMany: jest.fn() },
  $transaction: jest.fn((callback) => callback(prismaMock)),
};

module.exports = prismaMock;
