# This file is moved to the root directory before building the image

ARG APP_DIRNAME=mchammer-vite
ARG APP_PKG_NAME=@topplethenun/mchammer-vite

FROM node:21-bookworm-slim AS pruner
ARG APP_PKG_NAME
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=$APP_PKG_NAME --docker
RUN find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

FROM node:21-bookworm-slim AS base
RUN apt-get update && apt-get install -y openssl
RUN corepack enable
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

FROM base AS dev-deps
WORKDIR /app
RUN pnpm install

FROM base AS production-deps
WORKDIR /app
ENV NODE_ENV production
RUN pnpm install --prod

FROM base AS builder
ARG APP_PKG_NAME
WORKDIR /app
RUN corepack enable
ENV NODE_ENV production
COPY --from=pruner /app/out/full/ .
COPY --from=dev-deps /app/ .
COPY turbo.json turbo.json
RUN pnpm run build --filter=$APP_PKG_NAME...

FROM base AS runner
ARG APP_DIRNAME

ENV NODE_ENV production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix
USER remix

COPY --from=pruner --chown=remix:nodejs /app/out/full/ .
COPY --from=production-deps --chown=remix:nodejs /app .
COPY --from=builder --chown=remix:nodejs /app/apps/$APP_DIRNAME/server.mjs ./apps/$APP_DIRNAME/server.mjs
COPY --from=builder --chown=remix:nodejs /app/apps/$APP_DIRNAME/build ./apps/$APP_DIRNAME/build
COPY --from=builder --chown=remix:nodejs /app/apps/$APP_DIRNAME/public ./apps/$APP_DIRNAME/public

CMD node apps/mchammer-vite/server.mjs
