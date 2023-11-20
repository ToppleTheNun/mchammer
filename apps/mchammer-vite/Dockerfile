# This file is moved to the root directory before building the image
FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat curl
RUN apk update
RUN curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;
# Set working directory
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune --scope=@topplethenun/mchammer-vite --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat curl
RUN apk update
RUN curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm exec turbo run build --filter=@topplethenun/mchammer-vite...

FROM base AS runner
WORKDIR /app

RUN apk add ca-certificates fuse3 sqlite curl
RUN apk update
RUN curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;

ENV FLY="true"
ENV PORT="8081"
ENV NODE_ENV="production"

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix
USER remix

COPY --from=installer /app/apps/mchammer-vite/package.json .
COPY --from=installer --chown=nextjs:remix /app/apps/mchammer-vite/server.mjs ./apps/mchammer-vite/server.mjs
COPY --from=installer --chown=nextjs:remix /app/apps/mchammer-vite/drizzle ./apps/mchammer-vite/drizzle
COPY --from=installer --chown=nextjs:remix /app/apps/mchammer-vite/build ./apps/mchammer-vite/build
COPY --from=installer --chown=nextjs:remix /app/apps/mchammer-vite/public ./apps/mchammer-vite/public

CMD node apps/mchammer-vite/server.mjs
