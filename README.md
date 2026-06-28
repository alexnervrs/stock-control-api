# Stock Control API

A REST API for inventory management, built with Node.js, Express, Prisma, SQLite and JWT authentication.

This project simulates a stock control system for internal business operations, allowing users to manage products, categories, suppliers, stock entries, stock outputs, movement history and low stock alerts.

## Technologies

* Node.js
* Express
* Prisma ORM
* SQLite
* JWT Authentication
* Bcrypt
* CORS
* Dotenv
* Nodemon

## Features

* User registration
* User login with JWT authentication
* Protected routes
* Category management
* Supplier management
* Product management
* Stock entry registration
* Stock output registration
* Stock movement history
* Low stock alert
* Business rule to prevent stock output greater than available quantity

## Business Rules

* Users must be authenticated to access protected routes.
* Products must belong to a category.
* Products may have a supplier.
* Stock entries increase product quantity.
* Stock outputs decrease product quantity.
* The system does not allow stock output greater than the available quantity.
* Every stock movement is registered with type, quantity, description, product and date.
* Products with quantity less than or equal to the minimum stock are listed as low stock.

## Project Structure

```bash
src
├── config
│   └── prisma.js
├── controllers
│   ├── authController.js
│   ├── categoryController.js
│   ├── productController.js
│   ├── stockController.js
│   └── supplierController.js
├── middlewares
│   └── authMiddleware.js
├── routes
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── productRoutes.js
│   ├── stockRoutes.js
│   └── supplierRoutes.js
├── services
│   ├── authService.js
│   ├── categoryService.js
│   ├── productService.js
│   ├── stockService.js
│   └── supplierService.js
├── app.js
└── server.js
```

## API Routes

### Authentication

| Method | Route            | Description                |
| ------ | ---------------- | -------------------------- |
| POST   | `/auth/register` | Register a new user        |
| POST   | `/auth/login`    | Login and return JWT token |

### Categories

| Method | Route         | Description       |
| ------ | ------------- | ----------------- |
| POST   | `/categories` | Create a category |
| GET    | `/categories` | List categories   |

### Suppliers

| Method | Route        | Description       |
| ------ | ------------ | ----------------- |
| POST   | `/suppliers` | Create a supplier |
| GET    | `/suppliers` | List suppliers    |

### Products

| Method | Route           | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/products`     | Create a product  |
| GET    | `/products`     | List products     |
| GET    | `/products/:id` | Get product by ID |
| PUT    | `/products/:id` | Update product    |
| DELETE | `/products/:id` | Delete product    |

### Stock

| Method | Route              | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/stock/in`        | Register stock entry    |
| POST   | `/stock/out`       | Register stock output   |
| GET    | `/stock/movements` | List stock movements    |
| GET    | `/stock/low`       | List low stock products |

## How to Run

Clone the repository:

```bash
git clone https://github.com/alexnervrs/stock-control-api.git
```

Access the project folder:

```bash
cd stock-control-api
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret"
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

The API will run at:

```bash
http://localhost:3333
```

## Example Request

Register a stock entry:

```json
{
  "productId": "product_id_here",
  "quantity": 5,
  "description": "Initial stock entry"
}
```

Register a stock output:

```json
{
  "productId": "product_id_here",
  "quantity": 3,
  "description": "Stock output for administrative department"
}
```

## Status

Project completed as a portfolio REST API focused on backend fundamentals, authentication, database relationships and business rules for inventory management.
