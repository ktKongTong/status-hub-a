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
  targets = ["backend","frontend"]
}

target "docker-metadata-action" {}

target "builder" {
  dockerfile = "docker/base.Dockerfile"
}

target "backend" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "docker/backend.Dockerfile"
  contexts = {
    builder = "target:builder"
  }
  platforms = [
    "linux/amd64",
    "linux/arm64"
  ]
}

target "frontend" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "docker/frontend.Dockerfile"
  contexts = {
    builder = "target:builder"
  }
  platforms = [
    "linux/amd64",
    "linux/arm64"
  ]
}
