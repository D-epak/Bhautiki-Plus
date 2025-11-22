
# Bhautiki Plus

**Live server:** https://bhautiki-plus.onrender.com/

**Test accounts (for development)**

- **Admin**
  - email: `admin@gmail.com`
  - password: `123456`

- **Front-desk**
  - email: `frontdesk@gmail.com`
  - password: `123456`

Important note about OTP / email delivery (development):

- I have implemented email sending using `nodemailer` in the project. If you want to run emails locally using SMTP, please uncomment the mailer and template files (`src/config/mailer.ts` and `src/utils/template.ts`) and set the SMTP env variables in your `.env` file.
- On Render (and some free hosting providers) outbound SMTP is blocked; because of that limitation OTPs are returned in the API response during demos/testing so the verification flow works without a working SMTP provider.
- The mailing code exists in the repo; enabling SMTP locally will send real emails. In production you can switch to a transactional email provider (SMTP credentials or a provider like Resend) if desired.

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
You can open `openapi.yaml` several ways depending on your workflow. Pick an option below.

- **Swagger Editor (quick, browser)**:
  - Go to https://bhautiki-plus.onrender.com/docs/
  - Go to https://editor.swagger.io/
  - Use `File -> Import File` and select `openapi.yaml`, or copy & paste the file contents into the editor.

- **Serve the file locally and import by URL**:
  - Serve the project root (so `openapi.yaml` is accessible) and import the URL in the online Swagger Editor or Swagger UI.
  - Example (PowerShell):

```powershell
npx http-server -p 3001 .
# then in Swagger Editor use: http://localhost:3001/openapi.yaml
```

- **Redoc (CLI preview)**:
  - Quick local preview using `redoc-cli` (no install required with `npx`):

```powershell
npx redoc-cli serve openapi.yaml
# opens a local viewer (default http://localhost:8080)
```

- **VS Code (preview inside editor)**:
  - Install extension like `Swagger Viewer` or `OpenAPI (Swagger) Editor`.
  - Open `openapi.yaml` and use the extension command (e.g. `Preview Swagger`) to see a rendered UI.

- **Postman**:
  - `File -> Import` -> choose `postmanCollection.json` to import the API and try requests.
  

- **Serve with Swagger UI from your app** (optional - I can add this):
  - Install `swagger-ui-express` and `yamljs`:

```powershell
npm install swagger-ui-express yamljs
```

  - Example snippet (add in `src/app.ts` or your server bootstrap):

```ts
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const spec = YAML.load('./openapi.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
```

  - Then run your server and open `http://localhost:3000/docs`.

**Next steps (optional)**:
- Add an endpoint to serve Swagger UI (e.g., `swagger-ui-express`) and mount `openapi.yaml` at `/docs`.
- Add example `.env.example` file with required env vars.

**Test accounts (for development)**:

- **Admin**:
  - email: `admin@gmail.com`
  - password: `123456`

- **Front-desk**:
  - email: `frontdesk@gmail.com`
  - password: `123456`

**Important note about OTP / email delivery**:

- During development the project may run on hosts (or local setups) that block free SMTP relays. Because of this, OTPs may be returned in the API response for development/testing so you can complete verification flows without a working SMTP provider.
- If you prefer SMTP providers, you can replace or extend the mailer; see `src/config/mailer.ts` for the current implementation.

---

Files added:
- `openapi.yaml` — OpenAPI 3.0 spec for auth and enquiries
- `README.md` — setup and API examples
