FROM node:22-slim AS base

FROM builder as frontend-builder

# Production stage
FROM base as frontend
COPY --from=frontend-builder /prod/status-hub-frontend /prod/status-hub-frontend
WORKDIR /prod/status-hub-frontend
EXPOSE 3000
CMD [ "npm", "run", "start" ]