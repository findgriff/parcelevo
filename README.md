# ParcelEvo

Same-day courier SaaS (panel.parcelevo.com).

## Monorepo layout

- `apps/api` - NestJS backend
- `apps/console` - Next.js operator console
- `packages/ui` - shared Tailwind + shadcn setup/components
- `packages/config` - tsconfig/eslint/prettier/env schema/types
- `infra/dokku` - deploy notes and Procfiles

## Commands

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
