# Deploy a Spring Boot Movies REST API in SAP BTP, Kyma Runtime

## Overview

> [!NOTE]
> This sample is used in the Fast Prototyping in SAP BTP, Kyma Runtime Using App Push tutorial.

This sample provides a Spring Boot REST API that manages movie records stored as JSON objects in an S3-compatible **SAP Object Store** service.

This sample demonstrates how to:

- How to go from source code to a running, externally accessible application on Kyma runtime in a single command
- How to iterate quickly on a prototype without writing Kubernetes manifests, Dockerfiles, or configuring a container registry
- How to evolve a local prototype into an automated GitHub Actions CD pipeline

## Architecture

```
GitHub Actions (CI/CD)
       │
       ▼
Kyma Runtime (Kubernetes)
  ├── movies-rest Pod (Spring Boot, port 8080)
  │     └── Istio sidecar (mTLS + ingress)
  └── SAP Service Operator
        └── ObjectStore ServiceInstance → S3 bucket
```

Each movie is stored as a JSON file at `movies/<id>.json` inside the bound S3 bucket.

> [!NOTE]
> Object Store is a good fit here because the data is simple and self-contained. For applications with structured, relational, or frequently queried data, use a proper database such as PostgreSQL instead.

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.3 |
| API docs | springdoc-openapi / Swagger UI |
| Storage | AWS SDK v2 → SAP Object Store (S3-compatible) |
| Service binding | `java-sap-service-operator` (SAP Cloud Service Binding) |
| Runtime | SAP BTP Kyma (Kubernetes + Istio) |
| CI/CD | GitHub Actions + `kyma-project/setup-kyma-cli` |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/movies` | List all movies |
| `GET` | `/movies/{id}` | Get a movie by ID |
| `POST` | `/movies` | Create a new movie (ID auto-generated) |
| `PUT` | `/movies/{id}` | Update an existing movie |
| `DELETE` | `/movies/{id}` | Delete a movie |

Interactive documentation is available at `/swagger-ui.html` after deployment.

### Movie Resource

```json
{
  "id": "4e92e9c6-ebe3-4840-ae3c-2ede35ee4b74",
  "title": "Blade Runner",
  "year": 1982,
  "director": "Ridley Scott",
  "rating": 8.1
}
```
