# apps/console/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/console/package.json apps/console/
COPY packages/ui/package.json packages/ui/ || true
COPY packages/config/package.json packages/config/ || true
RUN corepack prepare pnpm@8.15.4 --activate \
 && pnpm install --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate
COPY . .
RUN pnpm --filter @apps/console build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/console/.next ./.next
COPY --from=build /app/apps/console/public ./public
COPY --from=build /app/apps/console/package.json ./package.json
COPY apps/console/server.js ./server.js
RUN addgroup -g 1001 -S nextjs && adduser -S nextjs -u 1001
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
