# Build and Create a SampleAppDotNet Microservice

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

| Variable         | Description                                       | Default                              |
| ---------------- | ------------------------------------------------- | ------------------------------------ |
| APP_NAME         | Application name (used for image and container)   | sample-dot-net                       |
| TAG              | Image tag                                         | 1.0.0                                |
| DOCKER_ACCOUNT   | Docker registry account (prefix for image name)   | your-dockerhub-user                  |
| APP_DIR          | Directory containing the .NET project             | SampleAppDotNet                      |
| HOST_PORT        | Host port mapped to the container                 | 5085                                 |
| CONTAINER_PORT   | Port the app listens on inside the container      | 8080                                 |
| BUILDER          | Cloud Native Buildpacks builder image             | paketobuildpacks/builder-jammy-base  |
| NAMESPACE        | Kubernetes namespace to deploy into               | sample-dot-net                       |
| HELM_RELEASE     | Helm release name                                 | sample-dot-net                       |
| REGISTRY_SECRET  | Name of the image pull secret                     | regcred                              |
| DOCKER_PASSWORD  | Docker registry password or access token          |                                      |
| DOCKER_EMAIL     | Email associated with the Docker registry account |                                      |

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

Reference: <https://paketo.io/docs/howto/dotnet-core/>

## Deploy to Kyma

### Kyma Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/) configured against your Kyma cluster
- [Helm 3](https://helm.sh/docs/intro/install/)

### Kyma namespace

- Create the namespace if it does not exist:

```bash
make create-namespace
```

### Registry credentials

The image is hosted in a private registry. Create a Kubernetes image pull secret before deploying:

```sh
make create-registry-secret
```

This uses `DOCKER_ACCOUNT`, `DOCKER_PASSWORD`, `DOCKER_EMAIL`, and `REGISTRY_SECRET` from `.env`. The command is idempotent — safe to re-run if credentials change.

### Deploy

```sh
make helm-deploy
```

This target:

1. Creates the namespace if it does not exist
2. Labels the namespace with `istio-injection=enabled` to enable the Istio sidecar
3. Runs `helm upgrade --install` with the image and image pull secret from `.env`

The APIRule exposes the app at `https://sample-dot-net-<NAMESPACE>.<kyma-cluster-domain>/weatherforecast`.

### Useful targets

```sh
make helm-template   # render manifests locally without a cluster
make helm-dry-run    # server-side dry run against the cluster
make helm-undeploy   # remove the Helm release
```

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
  helm/
    sample-dot-net/         # Helm chart for Kyma deployment
      Chart.yaml
      values.yaml
      templates/
        deployment.yaml
        service.yaml
        apirule.yaml
        _helpers.tpl
  SampleAppDotNet/
    Program.cs              # Minimal API entry point
    SampleAppDotNet.csproj
    appsettings.json
    Properties/
      launchSettings.json   # Port 5085 binding
  SampleAppDotNet.sln
```
