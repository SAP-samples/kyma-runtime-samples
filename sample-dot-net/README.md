# SampleAppDotNet

A minimal ASP.NET Core 10.0 Web API demonstrating the minimal APIs pattern,
packaged as a container image using Cloud Native Buildpacks.

## Prerequisites

- [.NET SDK 10.0](https://dotnet.microsoft.com/download)
- [pack CLI](https://buildpacks.io/docs/tools/pack/) (Cloud Native Buildpacks)
- [Docker](https://docs.docker.com/get-docker/)

## Configuration

Copy `.env.template` to `.env` and update the values:

```sh
cp .env.template .env
```

| Variable         | Description                                      | Default                            |
| ---------------- | ------------------------------------------------ | ---------------------------------- |
| APP_NAME         | Application name (used for image and container)  | sample-dot-net                     |
| TAG              | Image tag                                        | 1.0.0                              |
| DOCKER_ACCOUNT   | Docker registry account (prefix for image name)  | your-dockerhub-user                |
| APP_DIR          | Directory containing the .NET project            | SampleAppDotNet                    |
| HOST_PORT        | Host port mapped to the container                | 5085                               |
| CONTAINER_PORT   | Port the app listens on inside the container     | 8080                               |
| BUILDER          | Cloud Native Buildpacks builder image            | paketobuildpacks/builder-jammy-base |

The image is published as `$(DOCKER_ACCOUNT)/$(APP_NAME):$(TAG)`.

## Quick Start

```sh
make help        # list all available targets
make build-arm   # build image on macOS / ARM (amd64 via Rosetta, no arm64 builder available)
make build-amd   # build image for Linux / AMD64 (linux/amd64)
make push-image  # push image to Docker registry
make run         # start the container on http://localhost:5085
make stop        # stop the container
make clean       # remove the container
make dev         # run locally with dotnet CLI (no Docker)
```

The builder used is `paketobuildpacks/builder-jammy-base` (Paketo, .NET support).

The `build-arm` / `build-amd` targets use `pack build <APP_NAME> --tag <IMAGE_NAME>` so that
pack's layer cache is keyed on the app name and reused across rebuilds with different tags.

## API Endpoints

| Method | Path             | Description                      |
| ------ | ---------------- | -------------------------------- |
| GET    | /weatherforecast | Returns a 5-day weather forecast |
| GET    | /openapi/v1.json | OpenAPI spec (Development only)  |

## Development

To run locally without Docker, use `make dev`.

The API is available at `http://localhost:5085`.
OpenAPI is served at `http://localhost:5085/openapi/v1.json` when
`ASPNETCORE_ENVIRONMENT=Development` (default for `dotnet run`).

## Project Structure

```text
sample-dot-net/
  .env.template             # copy to .env and fill in your values
  Makefile                  # build, push, run, and dev targets
  SampleAppDotNet/
    Program.cs              # Minimal API entry point
    SampleAppDotNet.csproj
    appsettings.json
    Properties/
      launchSettings.json   # Port 5085 binding
  SampleAppDotNet.sln
```
