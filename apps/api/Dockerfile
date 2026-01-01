# apps/api/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/
COPY packages/config/package.json packages/config/ || true
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm --filter @apps/api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
EXPOSE 5000
CMD ["node", "dist/main.js"]
