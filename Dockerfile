FROM node:22-bookworm-slim

WORKDIR /app

# pnpm version is pinned in package.json "packageManager".
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Install before copying the rest of the source so dependency layers cache.
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

ENV NODE_ENV=production

# Railway injects PORT. The server binds 0.0.0.0 and that port; do not EXPOSE a fixed port.
CMD ["pnpm", "start"]
