variable "REGISTRY" {
  default = "ghcr.io"
}

variable "REPO" {
  default = "status-hub"
}

group "default" {
  targets = ["backend", "frontend"]
}

target "docker-metadata-action" {}

target "builder" {
  dockerfile = "docker/base.Dockerfile"
  target = "builder"
  tags = ["builder:latest"]
}

target "backend" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "docker/backend.Dockerfile"
  tags = ["${REGISTRY}/${REPO}-backend:latest"]
  contexts = {
    base = "target:builder"
  }
}

target "frontend" {
  inherits = ["docker-metadata-action"]
  context = "."
  dockerfile = "docker/backend.Dockerfile"
  tags = ["${REGISTRY}/${REPO}-frontend:latest"]
  contexts = {
    base = "target:builder"
  }
}

