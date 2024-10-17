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

RUN turbo prune status-hub-frontend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM pnpm-base AS installer
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

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

RUN pnpm turbo build --filter=status-hub-frontend

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/packages/frontend/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/packages/frontend/.next/static ./packages/frontend/.next/static
#COPY --from=installer --chown=nextjs:nodejs /app/packages/frontend/public ./packages/frontend/public
EXPOSE 3000
CMD node packages/frontend/server.js