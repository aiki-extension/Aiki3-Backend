# syntax=docker/dockerfile:1.7
FROM node:20-bookworm-slim AS base
WORKDIR /app/backend

# 1. Install all deps (needed for build)
FROM base AS deps
COPY backend/package*.json ./
RUN npm ci

# 2. Build TypeScript + generate Prisma client
FROM deps AS build
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./
COPY backend/src ./src
# DATABASE_URL is required by `prisma generate` at build time.
# The value is irrelevant — it never connects to a real DB during build.
RUN DATABASE_URL=postgresql://build:build@localhost/build npx prisma generate
RUN npm run build

# 3. Production-only node_modules
FROM base AS prod-deps
ENV NODE_ENV=production
COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 4. Lean runtime image
FROM node:20-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app/backend

# openssl is required by Prisma client at runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node backend/package.json ./package.json
COPY --chown=node:node --from=prod-deps /app/backend/node_modules ./node_modules
COPY --chown=node:node --from=build /app/backend/dist ./dist
# Migrations folder is needed by `prisma migrate deploy` (the init container)
COPY --chown=node:node --from=build /app/backend/prisma ./prisma
COPY --chown=node:node --from=build /app/backend/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
    CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

USER node
# This is the default command for the API container.
# The migrate init container overrides this with `npx prisma migrate deploy`.
CMD ["node", "dist/src/index.js"]
