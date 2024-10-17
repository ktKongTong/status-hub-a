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

RUN turbo prune status-hub-backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM pnpm-base AS installer
ARG TURBO_TEAM
ENV PNPM_HOME="/pnpm"
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /builder/out/json/ .


RUN --mount=type=cache,target=${PNPM_HOME} pnpm config set store-dir ${PNPM_HOME}
RUN --mount=type=cache,target=${PNPM_HOME} pnpm install --frozen-lockfile --prefer-offline

RUN --mount=type=cache,target=${PNPM_HOME} echo "PNPM contents after install: $(ls -la ${PNPM_HOME})"
# Build the project
COPY --from=builder /builder/out/full/ .

ENV TURBO_TEAM=$TURBO_TEAM
RUN --mount=type=secret,id=TURBO_TOKEN pnpm turbo build --filter=status-hub-backend
RUN --mount=type=secret,id=TURBO_TOKEN cat /run/secrets/TURBO_TOKEN
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