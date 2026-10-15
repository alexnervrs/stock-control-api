jest.mock("../src/config/prisma", () => require("./prismaMock"));

const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

beforeEach(() => jest.clearAllMocks());

describe("POST /auth/register", () => {
  it("cria um usuário e não retorna a senha", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: "user-1", name: "Alex", email: "alex@email.com" });

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Alex", email: "alex@email.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("salva a senha criptografada com bcrypt", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: "user-1" });

    await request(app)
      .post("/auth/register")
      .send({ name: "Alex", email: "alex@email.com", password: "123456" });

    const savedPassword = prisma.user.create.mock.calls[0][0].data.password;
    expect(savedPassword).not.toBe("123456");
    expect(await bcrypt.compare("123456", savedPassword)).toBe(true);
  });

  it("retorna 400 quando faltam campos obrigatórios", async () => {
    const res = await request(app).post("/auth/register").send({ email: "alex@email.com" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Name, email and password are required");
  });

  it("retorna 400 quando o e-mail já está cadastrado", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: "user-1" });

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "Alex", email: "alex@email.com", password: "123456" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
});

describe("POST /auth/login", () => {
  it("retorna um token JWT com credenciais válidas", async () => {
    const hash = await bcrypt.hash("123456", 10);
    prisma.user.findUnique.mockResolvedValue({ id: "user-1", name: "Alex", email: "alex@email.com", password: hash });

    const res = await request(app).post("/auth/login").send({ email: "alex@email.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it("retorna 401 com senha incorreta", async () => {
    const hash = await bcrypt.hash("123456", 10);
    prisma.user.findUnique.mockResolvedValue({ id: "user-1", email: "alex@email.com", password: hash });

    const res = await request(app).post("/auth/login").send({ email: "alex@email.com", password: "errada" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });
});

describe("Rotas protegidas", () => {
  it("retorna 401 sem token", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token not provided");
  });

  it("retorna 401 com token inválido", async () => {
    const res = await request(app).get("/products").set("Authorization", "Bearer token-falso");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token");
  });
});
