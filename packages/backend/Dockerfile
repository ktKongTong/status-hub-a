FROM node:22-slim AS base

FROM base AS pnpm-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM pnpm-base AS builder
COPY . /builder
WORKDIR /builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm add -g turbo

RUN turbo prune status-hub-backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM pnpm-base AS installer

WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /builder/out/json/ .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /builder/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build --filter=status-hub-backend
RUN pnpm deploy --filter=status-hub-backend --prod /prod/status-hub-backend

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 honojs
USER honojs

COPY --from=installer --chown=honojs:nodejs /prod/status-hub-backend /prod/status-hub-backend
RUN mkdir -p /prod/status-hub-backend/data
RUN chmod -R 777 /prod/status-hub-backend
WORKDIR /prod/status-hub-backend
VOLUME ["/prod/status-hub-backend/data"]
EXPOSE 8420
EXPOSE 8419
CMD [ "npm", "run", "start" ]