# Order Management API

A TypeScript and Express backend for a restaurant ordering workflow. It provides menu browsing, order creation and retrieval, order-status updates, seeded sample data, and live order-status notifications through Server-Sent Events (SSE).

## Tech stack

- Node.js, TypeScript, and Express 5
- MongoDB with Mongoose
- Zod request validation
- Vitest and Supertest for testing
- Pino logging

## Project structure

```text
.
├── backend-ordermanagement/
│   ├── src/
│   │   ├── config/       # Database connection and application constants
│   │   ├── middlewares/  # Validation and authentication middleware
│   │   ├── modules/      # Menu, orders, order items, and users
│   │   ├── seeders/      # Development users and menu data
│   │   ├── services/     # SSE and JWT services
│   │   └── server.ts     # Application entry point
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB 6 or newer

Order placement uses a MongoDB transaction, so use a replica set (including a single-node replica set) rather than a standalone MongoDB instance.

## Getting started

1. Install dependencies and enter the backend directory:

   ```bash
   cd backend-ordermanagement
   npm install
   ```

2. Create `backend-ordermanagement/.env`:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/restaurant_db?replicaSet=rs0
   PROD_FRONTEND_URL=http://localhost:3001
   ```

   `MONGO_URI` is required. `PROD_FRONTEND_URL` is optional and is added to the server's CORS allowlist when set.

3. Seed local data (this clears and recreates the `Users` and `Menu` collections):

   ```bash
   npm run seed:dev
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The API listens at `http://localhost:3000`; a `GET /` request returns a basic health response.

## Scripts

Run these commands from `backend-ordermanagement/`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with hot reload. |
| `npm run build` | Compile TypeScript into `dist/`. |
| `npm start` | Run the compiled server. |
| `npm run seed:dev` | Seed development users and menu items with TSX. |
| `npm run seed` | Seed from the compiled output. |
| `npm test` | Run the Vitest test suite once. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run test:coverage` | Run tests with coverage. |

## API overview

All application endpoints are prefixed with `/api`. Successful handlers return a JSON object shaped like:

```json
{
  "message": "...",
  "data": {}
}
```

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/menu/list?category=All&page=1&limit=10` | List menu items; supports optional `search`, pagination, and category filtering. |
| `GET` | `/api/order/:userId` | List orders for a user. |
| `POST` | `/api/order/place` | Create an order and its line items. |
| `GET` | `/api/order/details/:orderId` | Get one order with its line items. |
| `PUT` | `/api/order/:orderId` | Change an order's status. |
| `GET` | `/api/sse/order/:orderId` | Open an SSE stream for status changes to an order. |

### Menu categories

The menu endpoint accepts `All`, `Pizza`, `Burger`, `Pasta`, `Salad`, `Drink`, and `Dessert` as validated category values. Use `All` to return every category.

### Place an order

Use IDs returned by the menu and seeded-user collections.

```bash
curl -X POST http://localhost:3000/api/order/place \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "<user-id>",
    "delivery": {
      "name": "Alice Cooper",
      "phone": "9000000002",
      "address": "123 Example Street"
    },
    "items": [
      { "menuItemId": "<menu-item-id>", "quantity": 2 }
    ]
  }'
```

### Update an order and receive live events

Allowed statuses are `ORDER_RECEIVED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, and `CANCELLED`.

```bash
curl -N http://localhost:3000/api/sse/order/<order-id>

curl -X PUT http://localhost:3000/api/order/<order-id> \
  -H 'Content-Type: application/json' \
  -d '{ "status": "PREPARING" }'
```

The SSE stream receives a `status_update` event payload when the status changes.

## Seed data

The development seed includes one administrator and several customers, alongside menu items. It does not create passwords or an authentication flow. Example user email: `admin@restaurant.com`.

## Notes

- The server currently runs on port `3000` (configured in `src/server.ts`).
- CORS permits the local frontend origins `http://localhost:3001` and `http://localhost:5173`, plus `PROD_FRONTEND_URL` when configured.
- Environment files, generated output, logs, and dependencies are excluded from version control.

## License

MIT
