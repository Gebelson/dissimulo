# Production Dockerfile for Dissimulo Persistent Multiplayer Server
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/game-engine/package.json ./packages/game-engine/
COPY packages/minigames/package.json ./packages/minigames/
COPY packages/location/package.json ./packages/location/
COPY packages/evidence-engine/package.json ./packages/evidence-engine/
COPY apps/game-server/package.json ./apps/game-server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY packages/ ./packages/
COPY apps/game-server/ ./apps/game-server/
COPY tsconfig.json ./

# Build contracts, game-engine, and game-server
RUN pnpm --filter @alibi/game-server build

# Runner stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app /app

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:4000/health || exit 1

CMD ["pnpm", "--filter", "@alibi/game-server", "start"]
