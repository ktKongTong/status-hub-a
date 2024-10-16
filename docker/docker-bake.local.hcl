variable "USERNAME" {
  default = "ktkongtong"
}
variable "REPO" {
  default = "status-hub"
}

group "default" {
  targets = ["backend","frontend"]
}

target "builder" {
  dockerfile = "docker/base.Dockerfile"
}

target "backend" {
  context = "."
  dockerfile = "package/backend/Dockerfile"
  contexts = {
    builder = "target:builder"
  }
  tags = [
    "status-hub-backend:latest"
  ]
  platforms = [
    "linux/arm64"
  ]
}

target "frontend" {
  context = "."
  dockerfile = "package/frontend/Dockerfile"
  contexts = {
    builder = "target:builder"
  }
  tags = [
    "status-hub-frontend:latest"
  ]
  platforms = [
    "linux/arm64"
  ]
}
