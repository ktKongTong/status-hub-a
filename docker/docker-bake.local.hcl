group "default" {
  targets = ["statushub-local"]
}

target "statushub-local" {
  context = "."
  dockerfile = "docker/aio.Dockerfile"
  tags=[
    "status-hub-local:latest"
  ]
}

target "backend-local" {
  context = "."
  dockerfile = "packages/backend/Dockerfile"
  tags=[
    "status-hub-backend-local:latest"
  ]
}

target "frontend-local" {
  context = "."
  dockerfile = "packages/frontend/Dockerfile"
  tags=[
    "status-hub-frontend-local:latest"
  ]
}