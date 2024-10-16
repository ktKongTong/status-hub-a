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
  targets = ["backend","frontend", "status-hub"]
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
}

target "backend" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "package/backend/Dockerfile"
  platforms = [
    "linux/amd64",
    "linux/arm64"
  ]
}

target "frontend" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "package/frontend/Dockerfile"
  platforms = [
    "linux/amd64",
    "linux/arm64"
  ]
}
