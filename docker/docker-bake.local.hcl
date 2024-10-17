variable "TURBO_TOKEN" {}
variable "TURBO_TEAM" {}

group "default" {
  targets = ["statushub"]
}

target "statushub" {
  context = "."
  dockerfile = "docker/aio.Dockerfile"
  tags=[
    "status-hub:latest"
  ]
}
