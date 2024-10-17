FROM node:22-slim AS base

FROM base AS pnpm-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM pnpm-base AS builder
COPY . /builder
WORKDIR /builder
RUN  --mount=type=cache,target=${PNPM_HOME} \
  pnpm config set store-dir ${PNPM_HOME}
#
#RUN --mount=type=cache,target=${PNPM_HOME} echo "PNPM contents after install: $(ls -la ${PNPM_HOME})"
RUN pnpm add -g turbo

RUN turbo prune status-hub-frontend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM pnpm-base AS installer
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /builder/out/json/ .

RUN --mount=type=cache,target=${PNPM_HOME} echo "PNPM before after install: $(ls -la ${PNPM_HOME})"

RUN --mount=type=cache,target=${PNPM_HOME} pnpm config set store-dir ${PNPM_HOME}
RUN --mount=type=cache,target=${PNPM_HOME} pnpm add -g turbo
RUN --mount=type=cache,target=${PNPM_HOME} pnpm install --frozen-lockfile --prefer-offline

RUN --mount=type=cache,target=${PNPM_HOME} echo "PNPM contents after install: $(ls -la ${PNPM_HOME})"
# Build the project
COPY --from=builder /builder/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN
ENV TURBO_TEAM=$TURBO_TEAM
RUN --mount=type=secret,id=TURBO_TOKEN \
    if [ -f /run/secrets/TURBO_TOKEN ]; then \
        echo "Building with TURBO_TOKEN" && \
        TURBO_TOKEN=$(cat /run/secrets/TURBO_TOKEN) pnpm turbo build; \
    else \
        echo "Building without TURBO_TOKEN" && \
        pnpm turbo build --filter=status-hub-frontend; \
    fi

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

CMD ["node","packages/frontend/server.js"]