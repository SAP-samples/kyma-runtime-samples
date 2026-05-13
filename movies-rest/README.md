# Movies REST API — Java / SAP BTP Kyma

A Spring Boot REST API that keeps movie records as JSON objects in an S3-compatible **SAP Object Store** service. The app is deployed to **SAP BTP, Kyma runtime** using the `kyma-project/setup-kyma-cli/app-push` GitHub Action.

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

Each movie is stored as a JSON file at `movies/<id>.json` inside the bound S3 bucket. No relational database is required.

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

### Movie resource

```json
{
  "id": "1714900000000",
  "title": "Blade Runner",
  "year": 1982,
  "director": "Ridley Scott",
  "rating": 8.1
}
```

## Prerequisites

- SAP BTP Kyma cluster
- GitHub repository secrets:
  - `SERVER` — Kyma API server URL
  - `CA_CRT` — Kyma cluster CA certificate
- OIDC client configured with audience `my-client-id-for-gh-action`

## SAP Object Store Setup

Apply the Kubernetes manifests to provision the Object Store service and bind it to the app namespace:

```bash
kubectl apply -f movies-rest/service-instance.yaml
kubectl apply -f movies-rest/service-binding.yaml
```

These create:
- `ServiceInstance` `object-store-instance` — provisions an S3-compatible bucket via the SAP Service Operator
- `ServiceBinding` `object-store-binding` — injects credentials as a Kubernetes secret that the app reads at startup

## Deployment

Push to the `main` branch. The GitHub Actions workflow will:

1. Install Kyma CLI
2. Obtain a kubeconfig using OIDC
3. Build and push the container image
4. Deploy the app to the `movie-rest` namespace with:
   - Istio sidecar injection enabled
   - Public ingress (`expose: true`)
   - The `object-store-binding` secret mounted as a service binding
   - JVM tuning from `.env`

The workflow appends `/swagger-ui.html` to the output URL so you go directly on the API docs.

## Local Development

The app requires an Object Store service binding to start. For local testing, provide the binding via environment variables or a local `VCAP_SERVICES` / secrets file supported by the SAP Service Binding library.

```bash
cd movies-rest
mvn spring-boot:run
```

The server starts on port `8080`.

## Project Structure

```
movies-rest/
├── src/main/java/com/example/movies/
│   ├── Application.java          # Spring Boot entry point
│   ├── Movie.java                # Record: id, title, year, director, rating
│   ├── MovieController.java      # REST controller — CRUD over S3
│   └── ObjectStoreConfig.java    # Reads SAP service binding, creates S3Client
├── src/main/resources/
│   └── application.properties    # server.port=8080
├── .github/workflows/deploy.yaml # CI/CD pipeline
├── service-instance.yaml         # SAP BTP ServiceInstance manifest
├── service-binding.yaml          # SAP BTP ServiceBinding manifest
├── .env                          # JVM tuning flags for Buildpacks
└── pom.xml
```
