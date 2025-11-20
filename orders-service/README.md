# Orders Service

## Overview

This example demonstrates how you can use Kyma to expose microservices and Functions on HTTP endpoints and bind them to an external database.

This example contains:

- A sample application (microservice) written in [Go](http://golang.org). It can expose HTTP endpoints used to create, read, and delete basic order JSON entities, as described in the [service's OpenAPI specification](docs/openapi.yaml). This service can run with either a default in-memory database or the external Redis database.

- A [serverless](https://kyma-project.io/#/serverless/user/README) Function with the ability to expose HTTP endpoints used to read all order records or post single orders. Just like the microservice, the Function can run with either the default in-memory database or the external Redis instance. See the source code of this Function in the [`function.yaml`](./deployment/orders-function.yaml)) file under the **spec.source** field.

To see this microservice and Function in action, see the [getting started guides](https://github.com/kyma-project/kyma/blob/release-1.24/docs/getting-started/01-overview.md) and learn more about exposing services and Functions through API Rule CRs. You will also learn how to bind them to an external application like Redis and subscribe them to events from a sample mock application.

## Prerequisites

- Kyma 1.14 or higher. To deploy the Function, [Serverless](https://github.com/kyma-project/kyma/tree/release-1.24/docs/serverless) must be installed on the cluster
- [Kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/) 1.16 or higher
- [Helm](https://helm.sh/) 3.0 or higher (optional)

## Installation

You can install Orders Service (microservice or Function) either through kubectl or Helm.

### Use kubectl

To install the microservice on a Kyma cluster, run:

```bash
kubectl create ns orders-service
kubectl apply -f ./deployment/orders-service-deployment.yaml
kubectl apply -f ./deployment/orders-service-service.yaml
```

To install the Function on a Kyma cluster, run:

```bash
kubectl create ns orders-service
kubectl apply -f ./deployment/orders-function.yaml
```

### Use Helm

To install the microservice on a Kyma cluster, run:

```bash
helm install orders-service --namespace orders-service --create-namespace --timeout 60s --wait ./chart
```

See the [`values.yaml`](./chart/values.yaml) file for the configuration of the Helm release.

## Cleanup

See how to remove the example from the cluster through kubectl and Helm.

### Use kubectl

Run this command to completely remove the microservice and all its resources from the cluster:

```bash
kubectl delete all -l app=orders-service -n orders-service
kubectl delete ns orders-service
```

Run this command to completely remove the Function and all its resources from the cluster:

```bash
kubectl delete all -l app=orders-function -n orders-service
kubectl delete ns orders-service
```

### Use Helm

Run this command to completely remove the Helm release with the example and all its resources from the cluster:

```bash
helm delete orders-service -n orders-service
kubectl delete ns orders-service
```

## Configuration

To configure the microservice or the Function, override the default values of these environment variables:

| Environment variable | Description                                                                   | Required   | Default value |
| ---------------------- | ----------------------------------------------------------------------------- | ------ | ------------- |
| **APP_PORT**       | Specifies the port of the running service. The function doesn't use this variable. | No | `8080`           |
| **APP_REDIS_PREFIX**       | Specifies the prefix for all Redis environment variables. See the variables in other rows. | No | `REDIS_`           |
| **{APP_REDIS_PREFIX}HOST**       | Specifies the host of the Redis instance.                       | No | `nil`            |
| **{APP_REDIS_PREFIX}PORT**       | Specifies the port of the Redis instance.                       | No | `nil`            |
| **{APP_REDIS_PREFIX}REDIS_PASSWORD**       | Specifies the password to authorize access to the Redis instance.                       | No | `nil`            |

See the example:

```bash
export APP_REDIS_PREFIX="R_"
export R_HOST="abc.com"
export R_PORT="8080"
export R_REDIS_PASSWORD="xyz"
```

> **NOTE:** To allow the microservice and the Function to communicate with the Redis instance, you must provide the **{APP_REDIS_PREFIX}HOST**, **{APP_REDIS_PREFIX}PORT**, **{APP_REDIS_PREFIX}REDIS_PASSWORD** environments. Otherwise, the microservice and the Function will always use in-memory storage.

## Testing

Learn how to test both the microservice and the Function.

### Microservice

To send a sample order to the microservice, run:

```bash
curl -X POST ${APP_URL}/orders -k \
  -H "Content-Type: application/json" -d \
  '{
    "consignmentCode": "76272727",
    "orderCode": "76272725",
    "consignmentStatus": "PICKUP_COMPLETE"
  }'
```

To retrieve all orders saved in storage, run:

```bash
curl -X GET ${APP_URL}/orders -k
```

**APP_URL** is the URL of the running microservice. See the [tutorial on exposing an application with an API Rule](https://github.com/kyma-project/kyma/blob/release-1.24/docs/api-gateway/08-02-exposesecure.md) for reference.


> **TIP:** See the [service's OpenAPI specification](docs/openapi.yaml) for details of all endpoints.

### Function

To send a sample order to the Function, run:

```bash
curl -X POST ${FUNCTION_URL} -k \
  -H "Content-Type: application/json" -d \
  '{
    "consignmentCode": "76272727",
    "orderCode": "76272725",
    "consignmentStatus": "PICKUP_COMPLETE"
  }'
```

To retrieve all orders saved in storage, run:

```bash
curl -X GET ${FUNCTION_URL} -k
```

**FUNCTION_URL** is the URL of the running Function. See the [tutorial on exposing a Function with an API Rule](https://github.com/kyma-project/kyma/blob/release-1.24/docs/serverless/08-02-expose-function.md) for reference.
