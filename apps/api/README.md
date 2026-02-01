# Violette Kids API

Backend for Kids Safe Digital Library. Express + TypeScript + Prisma + PostgreSQL.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`.
2. Install: `pnpm install`
3. **Create the database** (if it doesn’t exist): `pnpm db:create`
4. Generate Prisma client: `pnpm db:generate`
5. **Create tables** (required before seed): `pnpm db:migrate` or `pnpm db:push`
6. Seed (optional): `pnpm db:seed`

If you see *"The table … does not exist"* when running seed, run step 5 first.

## Run

- Dev: `pnpm dev`
- Build: `pnpm build`
- Start: `pnpm start`

## API

- **Public**: `GET /api/content`, `GET /api/content/:id`, `GET /api/categories`, `GET /api/age-groups`, `GET /api/settings`
- **Admin** (JWT): `POST /api/admin/login`, `GET /api/admin/me`, `/api/admin/users`, `/api/admin/content`, `/api/admin/categories`, `/api/admin/age-groups`, `/api/admin/settings`
- **Docs**: Swagger UI at `http://localhost:4000/api-docs`
- **OpenAPI spec**: `GET /openapi.json`, `GET /openapi.yaml` (when server is running)

## Documentation (OpenAPI + Postman)

- **Generate OpenAPI files** (for GPT / tools): `pnpm run docs:generate`  
  → creates `openapi.json` and `openapi.yaml` in project root.
- **Generate Postman collection**: `pnpm run postman:generate`  
  → requires `openapi.json`; creates `postman-collection.json` and `postman-environment.json`.
- **Build all docs**: `pnpm run docs:build`  
  → runs docs:generate then postman:generate.
- **Test with Newman** (CLI): `pnpm run postman:test`  
  → runs the Postman collection (optional; installs `newman`).

Use `openapi.json` or `openapi.yaml` with GPT or other tools; use the Postman files in Postman or Newman for testing.

## Game content (PRD)

- `game` type: only `sourceType = youtube` (video) or `sourceType = uploaded` (PDF).
- `uploaded` → `fileUrl` required, must be PDF.
- `youtube` → `contentUrl` required, must be valid YouTube URL.
