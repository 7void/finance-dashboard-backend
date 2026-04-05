# Finance Dashboard Backend

A clean Express and MongoDB backend for a finance dashboard application. 

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Joi validation

## Folder Structure

```text
finance-backend/
├── Postman-Collection.json
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeds/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## How It Works

- `routes` define endpoints and attach middleware
- `controllers` handle HTTP request and response logic
- `services` contain business logic and database queries
- `models` define MongoDB schemas
- `middleware` handles auth, RBAC, validation, and error responses
- `validators` keep request validation separate from controllers

## Request Lifecycle

1. Client sends a request to an API route.
2. JWT authentication middleware validates the `Authorization: Bearer <token>` header on protected routes.
3. Role-based authorization middleware checks whether the authenticated user's role is allowed.
4. Joi validation layer validates `body`, `query`, and `params`, and strips unknown fields.
5. Controller handles HTTP concerns and delegates business logic to the service layer.
6. Service layer runs business rules, ownership checks, and database operations through Mongoose models.
7. Response is returned in a consistent JSON format with `success`, `message`, and `data` (or `details` for errors).

## Features

- User registration and login with JWT
- Role-based access control for `viewer`, `analyst`, and `admin`
- Admin-only user management APIs
- CRUD for financial records
- Filtering, search, sorting, and pagination for records
- Dashboard summary endpoints for totals, category totals, trends, and recent transactions
- Consistent error responses
- Seed script with sample users and records

## Design Decisions

- Layered architecture (`routes -> controllers -> services`) keeps code modular and easier to maintain.
- MongoDB aggregation is used for dashboard analytics to compute totals and trends efficiently at the database level.
- RBAC is middleware-based so permission checks remain centralized and reusable across routes.
- Joi schemas are separated into `validators` to keep controllers focused on request/response behavior.
- Ownership enforcement is implemented in services to ensure non-admin users only access their own records.

## Role Permissions

- `admin`: full access to users, records, and dashboard summaries
- `analyst`: can create, update, delete, and view their own records, plus access dashboard summaries
- `viewer`: can only read their own records

Admins can view all records. Non-admin users only see their own records.

### Access Control Rules

- JWT is required for all protected endpoints. Send `Authorization: Bearer <token>`.
- `viewer`: Allowed on `GET /api/records` and `GET /api/records/:id` (own records only). Denied on create/update/delete records, dashboard endpoints, and user management.
- `analyst`: Allowed to read/create/update/delete own records and access dashboard endpoints. Denied on user management endpoints.
- `admin`: Full access to auth admin registration, users, records, and dashboard. Can view records for any user and filter by `userId`.

## Setup

1. Create a `.env` file using `.env.example`
2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally
4. Run the app:

```bash
npm run dev
```

5. Optional: seed sample data

```bash
npm run seed
```

## Quick Test Flow

1. Seed sample data:

```bash
npm run seed
```

2. Start the API:

```bash
npm run dev
```

3. Login using a seeded account (`admin@finance.com`, `analyst@finance.com`, or `viewer@finance.com`) via `POST /api/auth/login`.
4. Copy `data.token` from the login response.
5. Call protected endpoints with `Authorization: Bearer <token>`.
6. Verify role restrictions: `viewer` should receive `403` on `POST /api/records`.
7. Verify role restrictions: `analyst` should access dashboard endpoints but not `/api/users`.
8. Verify role restrictions: `admin` should access `/api/users` and all record operations.

## Postman Collection (Included)

A ready-to-use Postman collection is included at `Postman-Collection.json`.

### Import and Run

1. Open Postman and import `Postman-Collection.json`.
2. Ensure the `baseUrl` collection variable is set (default: `http://localhost:5000/api`).
3. Run `Auth -> Login` with a seeded account. The collection test script stores `data.token` into the `token` variable automatically.
4. For `Users (Admin) -> Get User By ID`, set the `userId` variable to a valid MongoDB user id.
5. Run the remaining requests in `Records`, `Dashboard`, and `Users (Admin)`.

### Requests Included in the Collection

- `POST /api/auth/login`
- `GET /api/records`
- `POST /api/records`
- `GET /api/records?type=expense&page=1&limit=10`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/categories`
- `GET /api/dashboard/monthly-trends`
- `GET /api/dashboard/recent`
- `GET /api/users`
- `GET /api/users/:id`

The collection currently focuses on a practical smoke-test flow and does not include every available endpoint.

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/finance_dashboard
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

## API Base URL

```text
http://localhost:5000/api
```

## API Response Format

Success:

```json
{
  "success": true,
  "message": "Record fetched successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

## Error Handling Strategy

- `400 Bad Request`: Joi validation failures and invalid identifiers.
- `401 Unauthorized`: missing, invalid, or expired JWT tokens.
- `403 Forbidden`: authenticated user lacks required role or account is inactive.
- `404 Not Found`: route or resource does not exist.
- `500 Internal Server Error`: unexpected server-side errors.

Error responses are standardized:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

## Main Endpoints

### System

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin/register`

### Users

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PATCH /api/users/:id`

### Records

- `GET /api/records`
- `GET /api/records/:id`
- `POST /api/records`
- `PATCH /api/records/:id`
- `DELETE /api/records/:id`

### Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/categories`
- `GET /api/dashboard/monthly-trends`
- `GET /api/dashboard/recent`

## Record Query Params

- `type=income|expense`
- `category=Rent`
- `startDate=2026-01-01`
- `endDate=2026-03-31`
- `search=salary`
- `page=1`
- `limit=10`
- `sortBy=date|amount|category|createdAt|updatedAt`
- `sortOrder=asc|desc`
- `userId=<userId>` for admin only

## Example cURL Requests

Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"Secret123\"}"
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@finance.com\",\"password\":\"Admin123\"}"
```

Create record:

```bash
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"amount\":1200,\"type\":\"expense\",\"category\":\"Rent\",\"date\":\"2026-03-01\",\"note\":\"March rent\"}"
```

Filter records:

```bash
curl "http://localhost:5000/api/records?type=expense&startDate=2026-01-01&endDate=2026-03-31&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Dashboard summary:

```bash
curl "http://localhost:5000/api/dashboard/summary?startDate=2026-01-01&endDate=2026-03-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Seeded Users

- `admin@finance.com / Admin123`
- `analyst@finance.com / Analyst123`
- `viewer@finance.com / Viewer123`

## Brief Explanation

- Authentication uses JWT. After login, the token is sent in the `Authorization` header.
- RBAC is handled by `authenticate` and `authorize` middleware.
- Validation happens before controllers, so controllers stay clean.
- Services contain the main business logic, which keeps routes and controllers simple.
- Dashboard endpoints use MongoDB aggregation to calculate totals and trends efficiently.
