
FROM builder AS frontend-builder

# Production stage
FROM node:22-slim AS frontend
COPY --from=frontend-builder /prod/status-hub-frontend /prod/status-hub-frontend
WORKDIR /prod/status-hub-frontend
EXPOSE 3000
CMD [ "npm", "run", "start" ]