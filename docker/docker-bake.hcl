variable "TURBO_TOKEN" {}
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

group "default" {
  targets = ["backend","frontend", "statushub"]
}

target "docker-metadata-action" {}

target "statushub" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "docker/aio.Dockerfile"
  platforms = [
    "linux/amd64",
    "linux/arm64"
  ]
  args = {
    TURBO_TOKEN = "${TURBO_TOKEN}"
    TURBO_TEAM = "${TURBO_TEAM}"
  }
}

target "backend" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "packages/backend/Dockerfile"
  secret = [
    "type=env,id=TURBO_TOKEN"
  ]
  args = {
    TURBO_TEAM = "${TURBO_TEAM}"
  }
  platforms = [
    "linux/amd64",
    "linux/arm64"
  ]
}

target "frontend" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "packages/frontend/Dockerfile"
  secret = [
    "type=env,id=TURBO_TOKEN"
  ]
  args = {
    TURBO_TEAM = "${TURBO_TEAM}"
  }
  platforms = [
    "linux/amd64",
    "linux/arm64"
  ]
}
