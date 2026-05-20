# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a multi-language, multi-sample repository of extension and application samples for [SAP BTP, Kyma Runtime](https://kyma-project.io/). Each top-level directory is an independent sample — there is no monorepo build system tying them together. Samples target deployment on Kubernetes (Kyma) via Docker containers.

## Repository Structure

Each sample is self-contained with its own:
- `README.md` — setup and deployment instructions
- `Makefile` — build, image, and deploy targets
- `Dockerfile` (or buildpack config) — container build
- Kubernetes manifests (in a `k8s/` subdirectory) or Helm charts

Shared resources:
- `prerequisites/README.md` — all required tooling by category
- `helm-charts/` — reusable Helm charts
- `workspaces/` — VS Code workspace files per sample
- `assets/` — shared images/diagrams
- `.github/workflows/` — CI workflows per sample

## Build Commands

### Root-level (Java samples only)
```bash
make build-java-projects   # builds sample-extension-java, sample-event-trigger-java, cloudsdk-client-cert-auth
```

### Per-sample (run from sample directory)
Most samples follow this Makefile pattern:
```bash
make build          # compile/build the application
make build-image    # build Docker image
make push-image     # push to registry (requires DOCKER_PUSH_REPOSITORY etc.)
make all            # clean + build + build-image + push-image
```

**Java (Gradle):**
```bash
./gradlew clean build
./gradlew -Pversion=<version> -Pname=<app> clean build
```

**Go:**
```bash
go build ./...
go test ./... -count=1
```

**.NET:**
```bash
dotnet build
dotnet test
```

**Node.js/CAP:**
```bash
npm install
npm run build   # or npm start
cds build       # for CAP projects
```

## CI/CD

Workflows in `.github/workflows/` follow a naming convention: `build-docker-<sample-name>.yml`, `build-and-publish-<sample-name>.yml`, `deploy-<sample-name>.yml`. Each workflow is independent and scoped to one sample. GitHub Actions uses JDK 17 (adopt distribution) for Java samples.

## Key Technologies by Sample Category

| Category | Samples | Stack |
|----------|---------|-------|
| Java microservices | `sample-extension-java`, `sample-event-trigger-java` | Spring Boot 3, Gradle, JDK 17 |
| Go microservices | `orders-service`, `api-postgresql-go`, `app-auth-proxy` | Go 1.21, PostgreSQL/MSSQL |
| .NET | `sample-extension-dotnet`, `sample-extension-dotnet-minimalapi` | ASP.NET Core, .NET 6+ |
| Node.js functions | `s4hana-materialstock-function`, serverless functions | Node.js, SAP Cloud SDK |
| Frontend | `frontend-react-mssql`, `frontend-ui5-postgresql` | React, SAPUI5 |
| CAP | `from-zero-to-cap-on-kyma`, `cap-multitenancy-sample` | `@sap/cds-dk`, Node.js |
| Mocks | `commerce-mock`, `c4c-mock`, `marketing-mock` | Node.js/TypeScript |
| Auth | `user-propagation`, `app-auth-proxy` | XSUAA, OIDC, Go |
| Advanced | `grpc-python`, `custom-component-dapr`, `sample-ldap` | Python, Dapr, LDAP |

## Contributing

- Propose changes via a GitHub issue first.
- Squash multiple commits into one before submitting a PR.
- Commit messages should reference issues: `Fixes https://github.com/SAP-samples/kyma-runtime-extension-samples/issues/<N>` (no colon after "Fixes").
- DCO acceptance is required via CLA assistant on first PR.
- Follow the coding standards of the language used in each sample.

## Deployment Pattern

All samples deploy to Kyma/Kubernetes. The typical workflow:
1. Build the app (`make build`)
2. Build and push a Docker image (`make build-image push-image`)
3. Apply Kubernetes manifests (`kubectl apply -f k8s/`) or install Helm chart
4. Configure SAP BTP service bindings as Kubernetes secrets

Each sample's `README.md` documents the specific deployment steps and required environment variables/secrets.
