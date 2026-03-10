# Golang PostgreSQL database API

## Overview

> [!NOTE]
> This sample is used in the Deploy a Go PostgreSQL API Endpoint in SAP BTP, Kyma Runtime tutorial.

This sample provides a Golang API endpoint for communication with PostgreSQL databases. The API connects to a BTP-managed PostgreSQL instance using Service Binding credentials available in the Kyma cluster.

## PostgreSQL database example

For the PostgreSQL example, use the `deployment.yaml` file. It provides the Deployment definition as well as an APIRule to expose the API without authentication. The Deployment references the PostgreSQL Service Binding Secret for connection credentials.

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Deploy the following Kubernetes resources:
  - API deployment written in GO
  - API Rule
  - Service
  - ConfigMap

## Prerequisites

- SAP BTP, Kyma runtime instance
- PostgreSQL Service Instance and Service Binding in Kyma cluster
- [Docker](https://www.docker.com/)
- [Go](https://golang.org/doc/install)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime

## Steps

### Build the Docker image

1. Build and push the image to your Docker repository:

   ```shell script
   docker build -t {your-docker-account}/api-postgresql-go -f docker/Dockerfile .
   docker push {your-docker-account}/api-postgresql-go
   ```

### Deploy the API

1. Create a new `dev` Namespace:

   ```shell script
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Apply the ConfigMap:

   ```shell script
   kubectl -n dev apply -f ./k8s/configmap.yaml
   ```

3. Apply the Deployment:

   ```shell script
   kubectl -n dev apply -f ./k8s/deployment.yaml
   ```

4. Apply the APIRule:

   ```shell script
   kubectl -n dev apply -f ./k8s/apirule.yaml
   ```

5. Verify that the Deployment is up and running:

   ```shell script
   kubectl -n dev get deployment api-postgresql-go
   ```

6. Use the APIRule:

   - `https://api-postgresql-go.{cluster-domain}/orders`
   - `https://api-postgresql-go.{cluster-domain}/orders/10000001`
