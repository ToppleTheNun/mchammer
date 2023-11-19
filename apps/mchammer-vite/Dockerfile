# This file is moved to the root directory before building the image

ARG APP_DIRNAME=mchammer-vite
ARG APP_PKG_NAME=@topplethenun/mchammer-vite

FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=$APP_PKG_NAME --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm exec turbo run build --filter=$APP_PKG_NAME...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix
USER remix

COPY --from=installer /app/apps/$APP_DIRNAME/package.json .
COPY --from=installer --chown=nextjs:remix /app/apps/$APP_DIRNAME/server.mjs ./apps/$APP_DIRNAME/server.mjs
COPY --from=installer --chown=nextjs:remix /app/apps/$APP_DIRNAME/build ./apps/$APP_DIRNAME/build
COPY --from=installer --chown=nextjs:remix /app/apps/$APP_DIRNAME/public ./apps/$APP_DIRNAME/public

CMD node apps/$APP_DIRNAME/server.mjs
