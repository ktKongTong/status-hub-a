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
