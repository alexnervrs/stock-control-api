jest.mock("../src/config/prisma", () => require("./prismaMock"));

const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");
const { authHeader } = require("./helpers");

beforeEach(() => jest.clearAllMocks());

describe("POST /products", () => {
  it("cria um produto vinculado a uma categoria existente", async () => {
    prisma.category.findUnique.mockResolvedValue({ id: "cat-1" });
    prisma.product.create.mockResolvedValue({ id: "prod-1", name: "Teclado" });

    const res = await request(app)
      .post("/products")
      .set(authHeader())
      .send({ name: "Teclado", price: 150, categoryId: "cat-1" });

    expect(res.status).toBe(201);
    expect(prisma.product.create).toHaveBeenCalled();
  });

  it("retorna 400 quando faltam nome, preço ou categoria", async () => {
    const res = await request(app).post("/products").set(authHeader()).send({ name: "Teclado" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Name, price and categoryId are required");
  });

  it("retorna 400 quando a categoria não existe", async () => {
    prisma.category.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/products")
      .set(authHeader())
      .send({ name: "Teclado", price: 150, categoryId: "inexistente" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Category not found");
    expect(prisma.product.create).not.toHaveBeenCalled();
  });

  it("retorna 400 quando o fornecedor informado não existe", async () => {
    prisma.category.findUnique.mockResolvedValue({ id: "cat-1" });
    prisma.supplier.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/products")
      .set(authHeader())
      .send({ name: "Teclado", price: 150, categoryId: "cat-1", supplierId: "inexistente" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Supplier not found");
  });
});

describe("GET /products/:id", () => {
  it("retorna 404 quando o produto não existe", async () => {
    prisma.product.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/products/inexistente").set(authHeader());

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Product not found");
  });
});
