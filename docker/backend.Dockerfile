FROM node:22-slim AS base

FROM builder as backend-builder

# Production stage
FROM base as backend
COPY --from=backend-builder /prod/status-hub-backend /prod/status-hub-backend
WORKDIR /prod/status-hub-backend
VOLUME ["/prod/status-hub-backend/data"]
EXPOSE 8000
CMD [ "npm", "run", "start" ]
