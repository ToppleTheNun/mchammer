FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base

ENV NODE_ENV production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 remix
USER remix

COPY --from=prod-deps --chown=remix:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=remix:nodejs /app/build /app/build
COPY --from=build --chown=remix:nodejs /app/public/build /app/public/build

CMD ["pnpm", "start"]
