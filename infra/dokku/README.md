# Dokku Deploy — ParcelEvo

## Prereqs (once on the VPS)
```bash
# install letsencrypt plugin if missing
dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
```

## Create apps
```bash
# API
dokku apps:create parcelevo-api
dokku domains:set parcelevo-api api.parcelevo.com

# Console
dokku apps:create parcelevo-console
dokku domains:set parcelevo-console panel.parcelevo.com
```

## Proxy ports
```bash
# API listens on 5000 inside container
dokku proxy:ports-set parcelevo-api http:80:5000 https:443:5000

# Console listens on 3000 inside container
dokku proxy:ports-set parcelevo-console http:80:3000 https:443:3000
```

## Datastores
```bash
# Postgres (API)
dokku postgres:create parcelevo-db
dokku postgres:link parcelevo-db parcelevo-api

# Redis (API)
dokku redis:create parcelevo-redis
dokku redis:link parcelevo-redis parcelevo-api
```

## Storage
```bash
# uploads for API
dokku storage:mount parcelevo-api /var/lib/dokku/data/storage/parcelevo/uploads:/app/uploads
```

## Config
```bash
# API config
dokku config:set --no-restart parcelevo-api \
  NODE_ENV=production \
  PORT=5000 \
  JWT_SECRET=change-me \
  MAGICLINK_FROM=logins@parcelevo.com \
  PUBLIC_BASE_URL=https://panel.parcelevo.com \
  CORS_ALLOWLIST=https://panel.parcelevo.com,https://www.parcelevo.com \
  UPLOAD_DIR=/app/uploads

# Console config
dokku config:set --no-restart parcelevo-console \
  NODE_ENV=production \
  PORT=3000 \
  NEXT_PUBLIC_API_BASE=https://api.parcelevo.com \
  NEXT_PUBLIC_MOCK_API=0
```

## TLS
```bash
dokku letsencrypt:set parcelevo-api email you@parcelevo.com
dokku letsencrypt:set parcelevo-console email you@parcelevo.com

dokku letsencrypt:enable parcelevo-api
dokku letsencrypt:enable parcelevo-console
```

## Deploy
```bash
# add dokku remotes (from repo root)
git remote add dokku-api dokku@your-vps:parcelevo-api
git remote add dokku-console dokku@your-vps:parcelevo-console

# deploy API
git push dokku-api main

# deploy Console
git push dokku-console main
```

## Health checks
```bash
dokku checks:set parcelevo-api http /v1/healthz --interval 10s --timeout 5s --attempts 3
dokku checks:set parcelevo-console http /healthz --interval 10s --timeout 5s --attempts 3
```

## Verify
```bash
curl -s https://api.parcelevo.com/v1/healthz
curl -s https://panel.parcelevo.com/healthz
```
