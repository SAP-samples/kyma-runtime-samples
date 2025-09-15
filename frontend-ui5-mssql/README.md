# UI5 frontend MS SQL

## Overview

This sample provides a frontend SAPUI5 application that you can configure with any of the sample `Order` APIs.

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Configure and build an SAPUI5 Docker image.
- Deploy the frontend in the Kyma runtime which includes:
  - A ConfigMap that contains the URL to the backend API.
  - A Deployment of the frontend image with the ConfigMap mounted to a volume.
  - A Service to expose the UI to other Kubernetes resources.
  - An API to expose the frontend externally.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en/)
- [UI5 Tooling](https://ui5.github.io/cli/stable/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.

## Steps

### Run the frontend locally

1. Clone the project.

2. Inside the directory, run:

   ```shell
   npm install
   ```

3. Adjust the value of the **API_URL** parameter in the `webapp/config.js` file to match your `orders` API URL.

4. To start the application, run:

   ```shell
   npm run-script start
   ```

   The application loads at `http://localhost:8080`.

### Build the Docker image

1. Build and push the image to your Docker repository:

   ```shell
   docker build -t {your-docker-account}/fe-ui5-mssql -f docker/Dockerfile .
   docker push {your-docker-account}/fe-ui5-mssql
   ```

2. To run the image locally, adjust the value of the **API_URL** parameter in the `webapp/config.js` file and mount it into the image:

   ```shell
   docker run --mount type=bind,source=$(pwd)/webapp/config.json,target=/usr/share/nginx/html/config.json -p 8080:80 -d {your-docker-account}/fe-ui5-mssql:latest
   ```

### Deploy the frontend

1. Create a new `dev` Namespace:

   ```shell
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Within the project open the file `k8s/configmap.yaml` and adjust the `API_URL` by replacing `<cluster domain>` to the match the Kyma runtime cluster domain.

3. Apply the Resources:

   ```shell
   kubectl -n dev apply -f ./k8s/configmap.yaml
   kubectl -n dev apply -f ./k8s/deployment.yaml
   kubectl -n dev apply -f ./k8s/apirule.yaml
   ```

4. Use the APIRule to open the application:

   ```shell
   https://fe-ui5-mssql.{cluster-domain}
   ```
