group "default" {
  targets = ["statushub-local"]
}

target "docker-metadata-action" {}

target "ci" {
  inherits = ["docker-metadata-action"]
  secret = [
    "type=env,id=TURBO_TOKEN"
  ]
  args = {
    TURBO_TEAM = "${TURBO_TEAM}"
  }
}

target "statushub-local" {
  inherits = ["ci"]
  context = "."
  dockerfile = "docker/aio.Dockerfile"
  tags=[
    "status-hub-local:latest"
  ]
}

target "backend-local" {
  inherits = ["ci"]
  context = "."
  dockerfile = "packages/backend/Dockerfile"
  tags=[
    "status-hub-backend-local:latest"
  ]
}

target "frontend-local" {
  inherits = ["ci"]
  context = "."
  dockerfile = "packages/frontend/Dockerfile"
  tags=[
    "status-hub-frontend-local:latest"
  ]
}