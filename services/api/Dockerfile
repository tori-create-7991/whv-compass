# WHV Compass API — Cloud Run image.
FROM node:20-slim AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable

WORKDIR /app

# Install workspace deps (copy manifests first for layer caching).
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY packages/shared/package.json packages/shared/package.json
COPY services/api/package.json services/api/package.json
RUN pnpm install --frozen-lockfile || pnpm install

# Copy sources.
COPY packages/shared packages/shared
COPY services/api services/api
COPY tsconfig.base.json ./

ENV NODE_ENV=production
# Cloud Run sets PORT; map it to API_PORT.
ENV API_PORT=8080
EXPOSE 8080

WORKDIR /app/services/api
CMD ["pnpm", "start"]
