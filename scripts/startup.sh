#!/bin/bash

# Set log directory
LOG_DIR="/prod/status-hub-backend/data/log"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to get current timestamp
timestamp() {
    date +"%Y-%m-%d %H:%M:%S"
}

# Function to log messages to file and stdout
log() {
    echo "$(timestamp) $1" | tee -a "$2"
}

# Run migration
log "Starting migration..." "$LOG_DIR/migration.log"
node --experimental-specifier-resolution=node /prod/status-hub-backend/dist/scripts/migration.js 2>&1 | tee -a "$LOG_DIR/migration.log"

if [ $? -ne 0 ]; then
    log "Migration failed. Exiting." "$LOG_DIR/migration.log"
    exit 1
fi

log "Migration completed successfully." "$LOG_DIR/migration.log"

# Start backend
log "Starting backend..." "$LOG_DIR/backend.log"
node --experimental-specifier-resolution=node /prod/status-hub-backend/dist/src/index.js 2>&1 | tee -a "$LOG_DIR/backend.log" &
BACKEND_PID=$!

# Wait for backend to start (adjust sleep time as needed)
sleep 10

# Check if backend is still running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    log "Backend failed to start. Exiting." "$LOG_DIR/backend.log"
    exit 1
fi

log "Backend started successfully with PID $BACKEND_PID." "$LOG_DIR/backend.log"

# Start frontend
log "Starting frontend..." "$LOG_DIR/frontend.log"
node /prod/status-hub-frontend/packages/frontend/server.js 2>&1 | tee -a "$LOG_DIR/frontend.log" &
FRONTEND_PID=$!

# Wait for frontend to start (adjust sleep time as needed)
sleep 5

# Check if frontend is still running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    log "Frontend failed to start. Exiting." "$LOG_DIR/frontend.log"
    exit 1
fi

log "Frontend started successfully with PID $FRONTEND_PID." "$LOG_DIR/frontend.log"

log "All processes started successfully. Monitoring..." "$LOG_DIR/startup.log"

# Function to check if a process is running
is_running() {
    kill -0 $1 2>/dev/null
}

# Monitor processes and keep container running
while true; do
    if ! is_running $BACKEND_PID; then
        log "Backend process died. Exiting." "$LOG_DIR/startup.log"
        exit 1
    fi
    if ! is_running $FRONTEND_PID; then
        log "Frontend process died. Exiting." "$LOG_DIR/startup.log"
        exit 1
    fi
    sleep 60
done