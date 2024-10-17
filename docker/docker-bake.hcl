variable "TURBO_TEAM" {}
variable "REGISTRY" {
  default = "ghcr.io"
}
variable "USERNAME" {
  default = "ktkongtong"
}
variable "REPO" {
  default = "status-hub"
}


target "docker-metadata-action" {}

target "ci" {
  secret = [
    "type=env,id=TURBO_TOKEN"
  ]
  args = {
    TURBO_TEAM = "${TURBO_TEAM}"
  }
}

target "release" {
  inherits = ["ci"]
  platforms = [
    "linux/amd64",
    "linux/arm64"
  ]
}

target "statushub-local" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "docker/aio.Dockerfile"
  args = {
    TURBO_TEAM = "${TURBO_TEAM}"
  }
}

target "backend-local" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "packages/backend/Dockerfile"
  args = {
    TURBO_TEAM = "${TURBO_TEAM}"
  }
}

target "frontend-local" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "packages/frontend/Dockerfile"
  args = {
    TURBO_TEAM = "${TURBO_TEAM}"
  }
}


target "statushub" {
  inherits = ["release", "statushub-local"]
}

target "backend" {
  inherits = ["release", "backend-local"]
}

target "frontend" {
  inherits = ["release", "frontend-local"]
}

group "default" {
  targets = ["backend", "frontend", "statushub"]
}

group "local" {
  targets = ["backend-local", "frontend-local", "statushub-local"]
}