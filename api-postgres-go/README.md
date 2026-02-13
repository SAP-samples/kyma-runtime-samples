# Golang PostgreSQL database API

## Overview

This sample provides a Golang API endpoint for communication with the PostgreSQL database provisioned in the `postgres-provision` tutorial. The service exposes CRUD endpoints for the `Orders` table created in `DemoDB`. An optional Kyma event subscription can insert orders from an `order.created` event.

Default connection values used throughout the sample:

| Parameter    | Value                               |
| ------------ | ----------------------------------- |
| **database** | `DemoDB`                            |
| **host**     | `postgres.dev.svc.cluster.local`    |
| **password** | `Yukon900`                          |
| **username** | `postgres`                          |
| **port**     | `5432` (or forwarded port `15432`)  |

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Go](https://golang.org/doc/install)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime
- PostgreSQL provisioned via `postgres-provision/postgres-provision.md` (Secret `postgres` and Service `postgres` in namespace `dev`)

## Steps

### Run the API locally

1. Set the environment variables required to connect with the database (adjust host/port to match your setup or forwarded port):

   ```shell script
   export POSTGRES_USER=postgres
   export POSTGRES_PASSWORD=Yukon900
   export POSTGRES_DB=DemoDB
   export POSTGRES_HOST=localhost
   export POSTGRES_PORT=15432
   export POSTGRES_SSLMODE=disable
   ```

2. Run the application:

   ```shell script
   go run ./cmd/api
   ```

### Build the Docker image

1. Build and push the image to your Docker repository:

   ```shell script
   docker build -t {your-docker-account}/api-postgres-go -f docker/Dockerfile .
   docker push {your-docker-account}/api-postgres-go
   ```

2. To run the image locally, run:

   ```shell script
   docker run -p 8000:8000 -d --name api-postgres-go \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=Yukon900 \
     -e POSTGRES_DB=DemoDB \
     -e POSTGRES_HOST=host.docker.internal \
     -e POSTGRES_PORT=15432 \
     -e POSTGRES_SSLMODE=disable \
     {your-docker-account}/api-postgres-go:latest
   ```

### Deploy the API

1. Create a new `dev` Namespace (skip if already created during provisioning):

   ```shell script
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Apply the ConfigMap and Secret (skip the Secret if it already exists from the provisioning tutorial):

   ```shell script
   kubectl -n dev apply -f ./k8s/configmap.yaml
   kubectl -n dev apply -f ./k8s/secret.yaml
   ```

3. Apply the Deployment and APIRule:

   ```shell script
   kubectl -n dev apply -f ./k8s/deployment.yaml
   kubectl -n dev apply -f ./k8s/apirule.yaml
   ```

4. Verify that the Deployment is up and running:

   ```shell script
   kubectl -n dev get deployment api-postgres-go
   ```

5. Optional: apply the Event Subscription to insert orders from events:

   ```shell script
   kubectl -n dev apply -f ./k8s/event.yaml
   ```

6. Use the APIRule:

   - `https://api-postgres-go.{cluster-domain}/orders`
   - `https://api-postgres-go.{cluster-domain}/orders/10000001`
