jest.mock("../src/config/prisma", () => require("./prismaMock"));

const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");
const { authHeader } = require("./helpers");

beforeEach(() => jest.clearAllMocks());

describe("POST /stock/in", () => {
  it("soma a quantidade ao estoque e registra movimentação do tipo IN", async () => {
    prisma.product.findUnique.mockResolvedValue({ id: "prod-1", quantity: 10 });
    prisma.product.update.mockResolvedValue({ id: "prod-1", quantity: 15 });
    prisma.stockMovement.create.mockResolvedValue({ id: "mov-1", type: "IN", quantity: 5 });

    const res = await request(app).post("/stock/in").set(authHeader()).send({ productId: "prod-1", quantity: 5 });

    expect(res.status).toBe(201);
    expect(prisma.product.update.mock.calls[0][0].data.quantity).toBe(15);
    expect(prisma.stockMovement.create.mock.calls[0][0].data.type).toBe("IN");
  });

  it("retorna 400 para quantidade negativa", async () => {
    prisma.product.findUnique.mockResolvedValue({ id: "prod-1", quantity: 10 });

    const res = await request(app).post("/stock/in").set(authHeader()).send({ productId: "prod-1", quantity: -3 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Quantity must be greater than zero");
  });
});

describe("POST /stock/out", () => {
  it("subtrai a quantidade do estoque e registra movimentação do tipo OUT", async () => {
    prisma.product.findUnique.mockResolvedValue({ id: "prod-1", quantity: 10 });
    prisma.product.update.mockResolvedValue({ id: "prod-1", quantity: 7 });
    prisma.stockMovement.create.mockResolvedValue({ id: "mov-2", type: "OUT", quantity: 3 });

    const res = await request(app).post("/stock/out").set(authHeader()).send({ productId: "prod-1", quantity: 3 });

    expect(res.status).toBe(201);
    expect(prisma.product.update.mock.calls[0][0].data.quantity).toBe(7);
    expect(prisma.stockMovement.create.mock.calls[0][0].data.type).toBe("OUT");
  });

  it("bloqueia saída maior que o saldo disponível", async () => {
    prisma.product.findUnique.mockResolvedValue({ id: "prod-1", quantity: 2 });

    const res = await request(app).post("/stock/out").set(authHeader()).send({ productId: "prod-1", quantity: 5 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Insufficient stock");
    expect(prisma.product.update).not.toHaveBeenCalled();
    expect(prisma.stockMovement.create).not.toHaveBeenCalled();
  });

  it("retorna 400 quando o produto não existe", async () => {
    prisma.product.findUnique.mockResolvedValue(null);

    const res = await request(app).post("/stock/out").set(authHeader()).send({ productId: "inexistente", quantity: 1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Product not found");
  });
});

describe("GET /stock/low", () => {
  it("consulta produtos com quantidade menor ou igual ao estoque mínimo", async () => {
    prisma.product.findMany.mockResolvedValue([{ id: "prod-1", quantity: 1, minimumStock: 5 }]);

    const res = await request(app).get("/stock/low").set(authHeader());

    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(1);
    expect(prisma.product.findMany.mock.calls[0][0].where.quantity.lte).toBe("minimumStock");
  });
});
