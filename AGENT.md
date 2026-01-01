# AGENT.md — Parcelevo Code Agent Instructions

**Audience:** AI coding agent (Cursor/Codex) and any human collaborator.  
**Project:** ParcelEvo — Same‑day courier SaaS (panel.parcelevo.com).  
**Canonical spec:** `SPEC-1-ParcelEvo-SaaS-MVP.md` (must be present in repo root).

---

## 1) Mission & Scope

- **Mission:** Implement the ParcelEvo SaaS described in `SPEC-1-ParcelEvo-SaaS-MVP.md` using the stack below, deployable to **Dokku** on a VPS at `https://panel.parcelevo.com` (Let’s Encrypt TLS).
- **Scope (MVP):** Orders → Offers → Assignment → POD → Payout, with driver availability, notifications, compliance vault, pricing/GeoContext stubs, operator console, and exchange overflow hooks (SDCN/CX IDs only).
- **Out of scope (MVP):** Public exchange parity, scraping/ToS‑violating automations, multi‑drop VRP, London‑specific real‑time routing (can be stubbed).

**Source of truth:** Always conform to `SPEC-1-ParcelEvo-SaaS-MVP.md`. If a conflict exists, prefer the spec. Do not invent endpoints outside the spec. Propose changes only if blocking, and stop until approved.

---

## 2) Technology & Versions

- **Language:** TypeScript (Node 20, ESM where possible)
- **Backend:** NestJS + Fastify, Prisma + Postgres, Redis + BullMQ, zod, Helmet, CORS, Nodemailer, Stripe
- **Web (Operator Console):** Next.js 14 (App Router), React 18, TanStack Query, shadcn/ui (Radix UI), Tailwind CSS
- **Mobile (later):** React Native (Expo) stub; basic availability, offers, POD
- **Routing:** OSRM/Valhalla client (can be mocked initially)
- **Containers/Hosting:** Docker (+ multi‑stage builds), **Dokku** on VPS (nginx proxy 80/443, Let’s Encrypt)
- **Package manager:** pnpm
- **Monorepo:** Turborepo

---

## 3) Repository Topology

```
/ (repo root)
  SPEC-1-ParcelEvo-SaaS-MVP.md
  AGENT.md
  turbo.json
  package.json / pnpm-workspace.yaml
  /apps
    /api        # NestJS backend
    /console    # Next.js operator console (internal)
  /packages
    /ui         # shared Tailwind + shadcn setup/components
    /config     # tsconfig/eslint/prettier/env schema/types
  /infra
    /dokku      # deploy notes, Procfiles, nginx/Dokku hints
```

**Naming:**
- Folders: kebab-case (`job-router`, `offer-engine`)
- React components: PascalCase (`JobList.tsx`)
- Hooks: `useCamelCase` (`useMagicLink.ts`)
- Nest artifacts: `PascalCase` with suffixes (`OffersModule`, `JobsService`)

---

## 4) Work Mode & Definition of Done

- Work in **small, staged tasks** (“Task Cards”). After each task:
  - Run **acceptance checks** (below).
  - Output: file tree changes + commands + test results.
  - Stop and wait (no chaining).
- **Definition of Done** for each task:
  - Builds pass, endpoints respond, migrations run, linters clean, basic tests pass.
  - No TODOs that block acceptance.

**Conventional commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. One commit per passing task.

---

## 5) Tasks & Acceptance Checks (Phase 1–2)

### Task 1 — Monorepo scaffold
- Turborepo with `apps/api`, `apps/console`, `packages/ui`, `packages/config`
- pnpm workspaces, ESLint/Prettier, root README with dev scripts.
**Accept:** `pnpm -r build` passes; README shows run/build commands.

### Task 2 — API scaffold
- NestJS + Fastify, modules: `auth`, `orders`, `offers`, `drivers`, `pod`, `notifications`, `compliance`, `pricing`, `health`
- `GET /v1/healthz` → `{ "status":"ok" }`
- Helmet, CORS allowlist (env), Dockerfile (multi‑stage), Procfile (`web: node dist/main.js`)
**Accept:** `pnpm --filter @apps/api build` + `docker build` succeed; `/v1/healthz` returns 200.

### Task 3 — Database (Prisma + Postgres)
- Models: users, drivers, vehicles, jobs, job_events, job_offers, compliance_documents, payments, payouts, pod, telemetry_pings (optional v1), reputation_scores (optional v1), saved_searches (optional v1), audit_logs
- Seed roles (customer, driver, ops) + one ops user
**Accept:** `pnpm prisma migrate dev` + `pnpm prisma db seed` succeed; tables exist.

### Task 4 — Auth (magic link)
- `POST /v1/auth/magic-link` → email or console‑log link (if SMTP absent)
- `GET /v1/auth/callback?token=...` → JWT(HS256, 24h, role claim)
**Accept:** magic link flow returns a JWT; console can store it for API calls.

### Task 5 — Orders & Offers v1
- Endpoints: `POST /v1/orders`, `GET /v1/orders/:id`, `POST /v1/drivers/:id/availability`, `POST /v1/offers/:id/accept`
- Status machine: `created -> offered -> accepted -> picked_up -> delivered`
- BullMQ worker: offer expiry default **60s**
**Accept:** Create order → simulate offer → accept → status transitions visible; expiry jobs processed.

### Task 6 — Operator Console v0
- Next.js 14 login (magic link), job list/detail, manual “post to SDCN/CX” storing external_id only
- Availability banner toggle (on‑duty/off‑duty)
**Accept:** UI runs; actions persist; JWT attached; list/detail revalidate.

### Task 7 — Dokku deploy
- Dockerfiles api/console; Health: `/v1/healthz` (api), `/healthz` (console)
- Deploy checklist (Dokku commands) and successful curl of `/v1/healthz` on HTTPS
**Accept:** App reachable at `https://panel.parcelevo.com/v1/healthz` (200).

### Task 8 — Pricing & GeoContext v1
- OSRM/Valhalla client stub; city profile rates; static polygons for CC/ULEZ/tolls
- Return **all‑in** price + breakdown
**Accept:** Quote reflects distance/time + surcharges; console shows breakdown.

### Task 9 — Compliance & POD
- Doc upload (GIT, HNR, PL, Licence, RTW, DBS), expiry gate; blocked offers on expiry
- POD PDF: sig/photo + pickup/delivery timestamps + geo
**Accept:** Expired docs block offers; POD PDF downloadable.

### Task 10 — Notifications
- Workers for `offer`, `sms`, `email`, retries with backoff; push/SMS stubs with pluggable providers
**Accept:** Offer latency **p95 < 2s** under local test; queue metrics logged.

---

## 6) API Contracts (v1)

- `GET /v1/healthz` → 200 `{ status: "ok" }`
- `POST /v1/auth/magic-link` → 204 (or `{link:"..."}` in dev)
- `GET /v1/auth/callback` → 200 `{ token, user }`
- `POST /v1/orders` → 201 `{id,...}` (fields: pickup/delivery addresses, timestamps, notes, category)
- `GET /v1/orders/:id` → 200 `{...}`
- `POST /v1/drivers/:id/availability` body `{ state: "OFFLINE"|"AVAILABLE"|"PAUSED" }` → 204
- `POST /v1/offers/:id/accept` → 200; job advances to `accepted`

**Constraints**
- Offer expiry default **60s**
- Availability state drives whether background GPS is active (only when `AVAILABLE` or `ON_JOB`)

---

## 7) Data Model (summary)

**Core tables:** users, drivers, vehicles, jobs, job_events, job_offers, compliance_documents, payments, payouts, pod, exchange_postings, telemetry_pings (opt), reputation_scores (opt), saved_searches (opt), audit_logs.

**Indexes:** `(job_id)`, `(driver_id)`, `(status)`, `(created_at)` on hot paths. Consider composite `(job_id,status)` for events.

---

## 8) Environment Variables (schema & example)

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgres://USER:PASS@HOST:5432/panel
REDIS_URL=redis://HOST:6379
JWT_SECRET=change-me
MAGICLINK_FROM=logins@parcelevo.com
MAGICLINK_SMTP_URL=smtp://user:pass@mail.example.com:587
STRIPE_SECRET_KEY=sk_live_...
PUBLIC_BASE_URL=https://panel.parcelevo.com
UPLOAD_DIR=/app/uploads
CORS_ALLOWLIST=https://panel.parcelevo.com,https://www.parcelevo.com,http://localhost:3000
```

**Rules:**
- Validate env via zod at boot; fail fast with helpful messages.
- Never log secrets; redact tokens in logs.

---

## 9) Security, Privacy, Compliance

- **Auth:** Bearer JWT; roles: `customer`, `driver`, `ops`
- **Rate limit** auth endpoints. Helmet + strict CORS allowlist.
- **GDPR:** Telemetry only when `AVAILABLE` or `ON_JOB`; coarse 100–200m when idle; retention per spec (telemetry 12m, financial 7y, docs expiry+12m).
- **Compliance gate:** Expired GIT/HNR/PL/RTW/DBS → auto‑block.
- **No scraping** or ToS‑violating automations for exchanges.

---

## 10) Observability & Quality

- **Healthchecks:** `/v1/healthz` (api), `/healthz` (console)
- **Logs:** structured JSON (`level`, `message`, `context`, `jobId`, `driverId`)
- **Tests:** unit for services/utils; minimal e2e smoke (health/auth/orders)
- **Lint/format:** ESLint + Prettier; husky + lint‑staged optional

---

## 11) Docker & Dokku

- **Dockerfiles:** multi‑stage (builder → runner). Use `node:20-alpine` when possible.
- **Procfile:** `web: node dist/main.js` (api), `web: node server.js` (console)
- **Dokku commands (reference):**
  - `dokku apps:create panel`
  - `dokku domains:set panel panel.parcelevo.com`
  - `dokku proxy:ports-set panel http:80:5000 https:443:5000`
  - `dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git`
  - `dokku letsencrypt:set panel email you@parcelevo.com && dokku letsencrypt:enable panel && dokku letsencrypt:cron-job --add`
  - `dokku postgres:create panel-db && dokku postgres:link panel-db panel`
  - `dokku storage:mount panel /var/lib/dokku/data/storage/panel/uploads:/app/uploads`
  - `dokku checks:set panel http /v1/healthz --interval 10s --timeout 5s --attempts 3`

---

## 12) Coding Standards

- Types > interfaces; no enums → use `as const` objects
- Avoid side effects; DI via Nest providers
- zod for DTO validation and error messages
- Idempotency keys for offer/accept and payment callbacks
- Graceful shutdown (SIGTERM): close DB/Redis; drain queues

---

## 13) Non‑Functional Requirements (MVP)

- Offer notification **p95 < 2s** locally, production target under realistic load
- Uptime target MVP: 99% (business hours), with off‑duty gating in console
- Security: TLS 1.2+, AES‑256 at rest (managed by provider/volumes where applicable)

---

## 14) Quickstart Commands

```bash
# install
pnpm install

# dev build all
pnpm -r build

# run api (dev)
pnpm --filter @apps/api dev

# run console (dev)
pnpm --filter @apps/console dev

# prisma
pnpm --filter @apps/api prisma migrate dev
pnpm --filter @apps/api prisma db seed

# docker build (api)
docker build -t parcel-evo-api ./apps/api
```

**Deploy (summary):** push to Dokku remote → set domains → map proxy ports → enable Let’s Encrypt → link Postgres → mount uploads → set checks.

---

## 15) Guardrails

- Do not alter table names/fields without updating the spec and migrations.
- Do not add new endpoints beyond the API Contracts without approval.
- Do not store PII beyond what the spec requires; respect retention windows.
- Do not depend on exchange internals; integrations are **manual post** and external IDs at MVP.

---

## 16) Appendix — Sample cURL

```bash
# health
curl -s https://panel.parcelevo.com/v1/healthz

# magic link (dev may log link instead of sending)
curl -X POST https://panel.parcelevo.com/v1/auth/magic-link \
  -H 'Content-Type: application/json' \
  -d '{"email":"ops@parcelevo.com"}'

# create order (requires Bearer token)
curl -X POST https://panel.parcelevo.com/v1/orders \
  -H 'Authorization: Bearer <JWT>' \
  -H 'Content-Type: application/json' \
  -d '{"pickup_addr":"…","pickup_postcode":"…","pickup_ts":"…","delivery_addr":"…","delivery_postcode":"…","delivery_ts":"…","category":"general"}'
```

---

**End of AGENT.md** — If an instruction conflicts with `SPEC-1-ParcelEvo-SaaS-MVP.md`, the spec wins.
