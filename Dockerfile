FROM node:22-slim AS base

FROM base AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM builder AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm install
RUN pnpm deploy --filter=status-hub-backend --prod /prod/status-hub-backend
RUN pnpm deploy --filter=status-hub-frontend --prod /prod/status-hub-frontend

FROM base AS status-hub-frontend
COPY --from=build /prod/status-hub-frontend /prod/status-hub-frontend
WORKDIR /prod/status-hub-frontend
EXPOSE 3000
CMD [ "npm", "run", "start" ]

FROM base AS status-hub-frontend
COPY --from=build /prod/status-hub-backend /prod/status-hub-backend
WORKDIR /prod/status-hub-backend
VOLUME ["/prod/status-hub-backend/data"]
EXPOSE 8000
CMD [ "npm", "run", "start" ]