FROM builder AS backend-builder

# Production stage
FROM node:22-slim AS backend
COPY --from=backend-builder /prod/status-hub-backend /prod/status-hub-backend
WORKDIR /prod/status-hub-backend
VOLUME ["/prod/status-hub-backend/data"]
EXPOSE 8000
CMD [ "npm", "run", "start" ]
