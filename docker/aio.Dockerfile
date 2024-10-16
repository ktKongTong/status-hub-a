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

# RUN turbo prune --docker

# Add lockfile and package.json's of isolated subworkspace
FROM pnpm-base AS installer

WORKDIR /app

COPY . .

# First install the dependencies (as they change less often)
#COPY --from=builder /builder/out/json/ .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the project
#COPY --from=builder /builder/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo build
RUN pnpm deploy --filter=status-hub-backend --prod /prod/status-hub-backend

FROM base AS runner

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 status-hub
USER status-hub

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=status-hub:nodejs /app/packages/frontend/.next/standalone ./prod/status-hub-frontend/
COPY --from=installer --chown=status-hub:nodejs /app/packages/frontend/.next/static ./prod/status-hub-frontend/packages/frontend/.next/static
#COPY --from=installer --chown=nextjs:nodejs /app/packages/frontend/public ./packages/frontend/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=status-hub:nodejs /prod/status-hub-backend /prod/status-hub-backend
RUN mkdir -p /prod/status-hub-backend/data
RUN chmod -R 777 /prod/status-hub-backend
RUN chmod -R 777 /prod/status-hub-frontend
VOLUME ["/prod/status-hub-backend/data"]

WORKDIR /prod/status-hub-backend
EXPOSE 8420
EXPOSE 8419
EXPOSE 3000
CMD node /prod/status-hub-frontend/packages/frontend/server.js & \
    node --experimental-specifier-resolution=node /prod/status-hub-backend/dist/scripts/migration.js  && \
    node --experimental-specifier-resolution=node /prod/status-hub-backend/dist/src/index.js