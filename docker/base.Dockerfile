FROM node:22-slim AS base

FROM base AS pnpm-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM pnpm-base AS builder
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm install
RUN pnpm deploy --filter=status-hub-backend --prod /prod/status-hub-backend
RUN pnpm deploy --filter=status-hub-frontend --prod /prod/status-hub-frontend
