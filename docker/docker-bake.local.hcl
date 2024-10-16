

group "default" {
  targets = ["backend","frontend", "statushub"]
}

target "statushub" {
  context = "."
  dockerfile = "docker/aio.Dockerfile"
  tags=[
    "status-hub:latest"
  ]
}

target "backend" {
  context = "."
  dockerfile = "packages/backend/Dockerfile"
  tags = [
    "status-hub-backend:latest"
  ]
}

target "frontend" {
  context = "."
  dockerfile = "packages/frontend/Dockerfile"
  tags = [
    "status-hub-frontend:latest"
  ]
}
