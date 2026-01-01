# Task 3 Pack — Prisma + Env loader

Files included
- apps/api/prisma/schema.prisma
- apps/api/src/prisma/prisma.module.ts
- apps/api/src/prisma/prisma.service.ts
- apps/api/prisma/seed.ts
- packages/config/src/env.ts
- apps/api/.env.example
- infra/docker-compose.yml (optional for local Postgres/Redis)

How to apply
1) Copy these files into your repo preserving paths.
2) In apps/api/package.json add scripts:
   "prisma:generate": "prisma generate",
   "prisma:migrate": "prisma migrate dev",
   "prisma:seed": "ts-node prisma/seed.ts"
3) Install deps when online:
   pnpm -w add -D prisma
   pnpm --filter @apps/api add @prisma/client
   pnpm --filter @apps/api add -D ts-node
4) Run DB locally (optional):
   docker compose -f infra/docker-compose.yml up -d
5) Run Prisma:
   pnpm --filter @apps/api prisma:generate
   pnpm --filter @apps/api prisma:migrate
   pnpm --filter @apps/api prisma:seed
