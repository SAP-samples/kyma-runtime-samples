# Golang MS SQL database API

## Overview

This sample provides a Golang API endpoint for communication with the MS SQL databases provided in the `database-mssql` and `database-azure-mssql` directories. You can also enable an Event Trigger for both examples.

## MS SQL database example

For the `database-mssql` example, use the `deployment.yaml` file. It provides the Deployment definition as well as an APIRule to expose the Function without authentication. The Deployment also contains a ConfigMap and a Secret with the following parameters for the `database-mssql` example that you can configure to modify the default options:

| Parameter    | Value                         |
| ------------ | ----------------------------- |
| **database** | `DemoDB`                      |
| **host**     | `mssql.dev.svc.cluster.local` |
| **password** | `Yukon900`                    |
| **username** | `sa`                          |
| **port**     | `1433`                        |

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Deploy the following Kubernetes resources:
  - API deployment written in GO
  - API Rule
  - Service
  - Secret

## Azure MS SQL database example

For the `database-azure-mssql` example, use the `deployment-servicebinding.yaml` file. It defines the Deployment definition as well as an APIRule to expose the Function without authentication. It also defines a ServiceBinding and ServiceBindingUsage that configure the Function to use the `database-azure-mssql` ServiceInstance.

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Deploy the following Kubernetes resources:
  - API deployment written in GO
  - API Rule
  - Service
  - Event Subscription
  - ServiceBinding
  - ServiceBindingUsage

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Go](https://golang.org/doc/install)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime

## Steps

### Run the API locally

1. Set the environment variables required to connect with the database:

   ```shell script
   export MYAPP_username=sa
   export MYAPP_password=Yukon900
   export MYAPP_database=DemoDB
   export MYAPP_host=localhost
   export MYAPP_port=1433
   ```

2. Run the application:

   ```shell script
   go run ./cmd/api
   ```

### Build the Docker image

1. Build and push the image to your Docker repository:

   ```shell script
   docker build -t {your-docker-account}/api-mssql-go -f docker/Dockerfile .
   docker push {your-docker-account}/api-mssql-go
   ```

2. To run the image locally, run:

   ```shell script
     docker run -p 8000:8000 -d {your-docker-account}/api-mssql-go:latest
   ```

### Deploy the API - MS SQL database example

1. Create a new `dev` Namespace:

   ```shell script
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Apply the ConfigMap:

   ```shell script
   kubectl -n dev apply -f ./k8s/configmap.yaml
   ```

3. Apply the Secret:

   ```shell script
   kubectl -n dev apply -f ./k8s/secret.yaml
   ```

4. Apply the Deployment:

   ```shell script
   kubectl -n dev apply -f ./k8s/deployment.yaml
   ```

5. Apply the APIRule:

   ```shell script
   kubectl -n dev apply -f ./k8s/apirule.yaml
   ```

6. Verify that the Deployment is up and running:

   ```shell script
   kubectl -n dev get deployment api-mssql-go
   ```

7. Use the APIRule:

   - `https://api-mssql-go.{cluster-domain}/orders`
   - `https://api-mssql-go.{cluster-domain}/orders/10000001`

### Deploy the API - Azure MS SQL database example

1. Create a new `dev` Namespace:

   ```shell script
   kubectl create namespace dev
   ```

2. Get the name of the ServiceInstance:

   ```shell script
   kubectl -n dev get serviceinstances
   ```

   For example:

   | NAME                                  | CLASS                       | PLAN  | STATUS | AGE |
   | ------------------------------------- | --------------------------- | ----- | ------ | --- |
   | **_azure-sql-12-0-unkempt-entrance_** | ServiceClass/azure-sql-12-0 | basic | Ready  | 63m |

3. Within the `deployment-servicebinding.yaml`, adjust the name of the **instanceRef** property of the corresponding ServiceBinding:

   ```yaml
   apiVersion: servicecatalog.k8s.io/v1beta1
   kind: ServiceBinding
   metadata:
     name: azure-sql
   spec:
     instanceRef: name:<b>azure-sql-12-0-unkempt-entrance</b>
   ```

4. Apply the Deployment:

   ```shell script
   kubectl -n dev apply -f ./k8s/deployment-servicebinding.yaml
   ```

### Deploy the Event Subscription

The Event Subscription works for both samples. It expects that either SAP Commerce Cloud or the Commerce Mock application is connected and configured within the Namespace. You can find a blog post with details on the Commerce Mock setup [here](https://blogs.sap.com/2020/06/17/sap-cloud-platform-extension-factory-kyma-runtime-commerce-mock-events-and-apis/).

The subscription and code within the Golang application are set up for the `order.created` event. Before you deploy the subscription, verify that the value of `spec.filter.filters.eventType.value` is correct for the name of your application.

1. Apply the Deployment:

   ```shell script
   kubectl -n dev apply -f ./k8s/event.yaml
   ```

2. Within the mock application, submit the `order.created` event. This populates the database with the submitted order code and the `order received from event` notification.
