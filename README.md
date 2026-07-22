# Research Portal — IITK

A full-stack research portal for IIT Kanpur — Next.js frontend deployed on **Vercel**, Go + PostgreSQL backend deployed on **Railway**.

---

## Stack

| Layer    | Technology        | Hosting  |
|----------|-------------------|----------|
| Frontend | Next.js 16 (TypeScript) | Vercel |
| Backend  | Go 1.21 + gorilla/mux | Railway |
| Database | PostgreSQL 16     | Railway (Postgres plugin) |

---

## Local Development

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Go 1.21+

### Quick start

```bash
# 1. Clone the repo
git clone <repo-url>
cd research-portal-iitk

# 2. Set up backend environment
cp .env.example .env
# Edit .env — at minimum, set a strong JWT_SECRET

# 3. Start backend + database
docker compose up --build -d

# 4. Set up frontend environment
cd frontend
cp .env.local.example .env.local
# Edit .env.local — NEXT_PUBLIC_API_URL should be http://localhost:5000

# 5. Start the frontend dev server
npm install
npm run dev
# → http://localhost:3000
```

---

## Production Deployment

### Backend + Database → Railway

1. **Create a Railway project** at [railway.app](https://railway.app).

2. **Add a PostgreSQL service** (Railway dashboard → New → Database → PostgreSQL).  
   Railway will automatically inject `DATABASE_URL` into your backend service.

3. **Add a backend service** by connecting this GitHub repo and setting the **root directory** to `backend/`.  
   Railway detects the `railway.toml` and builds using the `Dockerfile`.

4. **Set the following environment variables** in the Railway backend service (Variables tab):

   | Variable               | Value |
   |------------------------|-------|
   | `JWT_SECRET`           | `openssl rand -hex 32` output |
   | `CORS_ALLOWED_ORIGINS` | Your Vercel frontend URL (e.g. `https://your-app.vercel.app`) |
   | `DB_SSLMODE`           | `require` |

   > `DATABASE_URL` and `PORT` are injected by Railway automatically — do **not** set them manually.

5. **Deploy** — Railway builds the Docker image and runs the Go binary.  
   The `/health` endpoint is used for health checks.

6. **Copy the public URL** of the Railway backend service (e.g. `https://your-service.up.railway.app`).

---

### Frontend → Vercel

1. **Import the repo** at [vercel.com/new](https://vercel.com/new).

2. Set the **root directory** to `frontend/` when prompted.

3. **Add the environment variable** in Vercel (Project Settings → Environment Variables):

   | Variable              | Value |
   |-----------------------|-------|
   | `NEXT_PUBLIC_API_URL` | Your Railway backend URL (e.g. `https://your-service.up.railway.app`) |

4. **Deploy** — Vercel builds the Next.js app using the `vercel.json` configuration.

---

## Repository Structure

```
.
├── backend/                # Go API server
│   ├── Dockerfile          # Multi-stage Docker build
│   ├── railway.toml        # Railway deployment config
│   ├── main.go
│   ├── db/                 # DB connection & migrations
│   ├── handlers/           # Route handlers
│   ├── middleware/         # JWT auth middleware
│   └── models/             # Data models
├── frontend/               # Next.js app
│   ├── vercel.json         # Vercel deployment config
│   ├── .env.local.example  # Frontend env template
│   ├── app/                # Next.js App Router pages
│   ├── components/         # UI components
│   └── lib/                # Utilities
├── docker-compose.yml      # Local dev: backend + postgres
├── .env.example            # Backend env template
└── README.md
```

---

## Environment Variables Reference

### Backend (Railway / `.env`)

| Variable               | Required | Description |
|------------------------|----------|-------------|
| `DATABASE_URL`         | Yes*     | Full Postgres connection string — auto-injected by Railway |
| `DB_HOST`              | Yes**    | Postgres host (fallback when `DATABASE_URL` unset) |
| `DB_PORT`              | Yes**    | Postgres port, default `5432` |
| `DB_USER`              | Yes**    | Postgres user |
| `DB_PASSWORD`          | Yes**    | Postgres password |
| `DB_NAME`              | Yes**    | Database name |
| `DB_SSLMODE`           | No       | `disable` (local) / `require` (Railway) |
| `JWT_SECRET`           | Yes      | Secret key for signing JWTs |
| `PORT`                 | No       | HTTP listen port, default `5000` (auto-set by Railway) |
| `CORS_ALLOWED_ORIGINS` | No       | Allowed CORS origin(s); default `*` |

\* Auto-injected by Railway when Postgres plugin is linked  
\** Only needed when `DATABASE_URL` is not set (local Docker)

### Frontend (Vercel / `.env.local`)

| Variable              | Required | Description |
|-----------------------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes      | Backend base URL for all API calls |
