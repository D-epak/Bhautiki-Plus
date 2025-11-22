# Bhautiki Plus

This repository contains the Bhautiki Plus backend (Express + TypeScript + Drizzle ORM).

**Setup**:
- **Prerequisites**: Node.js (>=16), PostgreSQL, `npm` or `yarn`.
- **Install deps**:

```powershell
npm install
```

- **Environment**: create a `.env` file from your env template (example variables expected by `src/config/envconfig.ts`):
  - `DATABASE_URL` - Postgres connection string
  - `PORT` - server port
  - `JWT_SECRET` - secret for JWT tokens
  - mailer config (SMTP) if using email flows

- **Dev**:

```powershell
npm run dev
```

- **Build (production)**:

```powershell
npm run build
npm run start
```

- **Migrations**:
  - Generate: `npm run migration:generate`
  - Push: `npm run migration:push`
  - Drop: `npm run migration:drop`

**API Documentation**:
- An OpenAPI spec is included at `openapi.yaml` in the project root. You can import it into Swagger UI, Postman, or any OpenAPI-compatible tool.

**Key Endpoints (examples)**

- Auth
  - **POST** `/auth/signup` — create user and send OTP

Request example:

```json
{
  "name": "Alice Example",
  "email": "alice@example.com",
  "password": "Secret123",
}
```

Response example (201):

```json
{
  "success": true,
  "message": "OTP sent to email",
  "data": { "userId": "user_123" }
}
```

- Verify
  - **POST** `/auth/verify`

Request example:

```json
{
  "token": "tken.....tuewbds",
  "otp": "123456"
}
```

Response example (200):

```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "id": "user_123", "email": "alice@example.com" }
}
```

- Login
  - **POST** `/auth/login`

Request example:

```json
{
  "email": "alice@example.com",
  "password": "Secret123"
}
```

Response example (200):

```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "id": "user_123", "email": "alice@example.com" }
}
```

- Enquiries (mounted at `/api/enquiries`) — Protected endpoints (Bearer JWT required)
  - **POST** `/api/enquiries` — create an enquiry (roles: `ADMIN`, `FRONT_DESK`)

Request example:

```json
{
  "name": "Bob",
  "email": "bob@example.com",
  "phone": "+19998887766",
  "message": "Interested in services"
}
```

Response example (201):

```json
{
  "success": true,
  "data": { "id": "enq_123", "status": "OPEN" }
}
```

  - **GET** `/api/enquiries` — list enquiries (roles: `ADMIN`, `FRONT_DESK`)

Response example (200):

```json
{
  "success": true,
  "data": [
    { "id": "enq_1", "name": "Alice", "message": "I need help", "status": "OPEN" }
  ],
  "total": 1
}
```

  - **GET** `/api/enquiries/{id}` — get enquiry by id

  - **PUT** `/api/enquiries/{id}/status` — update status (role: `ADMIN`)

Request example:

```json
{
  "status": "CLOSED"
}
```

Response example (200):

```json
{
  "success": true,
  "data": { "id": "enq_1", "status": "CLOSED" }
}
```

**How to view API docs**:
- Import `openapi.yaml` into Swagger Editor (https://editor.swagger.io/) or Swagger UI.

**Next steps (optional)**:
- Add an endpoint to serve Swagger UI (e.g., `swagger-ui-express`) and mount `openapi.yaml` at `/docs`.
- Add example `.env.example` file with required env vars.

---

Files added:
- `openapi.yaml` — OpenAPI 3.0 spec for auth and enquiries
- `README.md` — setup and API examples
