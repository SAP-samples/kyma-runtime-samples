# Standalone Application Router on SAP BTP, Kyma Runtime

## Context

SAP BTP, Kyma runtime is used to develop applications and extensions. The development process requires:

- Serving static content
- Authenticating and authorizing users
- Forwarding to the appropriate identity provider for logging in
- Rewriting URLs
- Dispatching requests to other microservices while propagating user information

All these and more capabilities are provided by [SAP Application Router](https://help.sap.com/products/BTP/65de2977205c403bbc107264b8eccf4b/01c5f9ba7d6847aaaf069d153b981b51.html).

You can use the application router capabilities in SAP BTP, Kyma runtime either as:

- Managed Application Router, or
- Standalone Application Router deployed on SAP BTP, Kyma runtime

For more information on both options, see the [Using SAP Application Router with Kyma runtime](https://blogs.sap.com/2021/12/09/using-sap-application-router-with-kyma-runtime/) blog post.

This sample shows how to deploy a standalone Application Router on SAP BTP, Kyma runtime.

## Scenario

In this scenario, you deploy an application router and expose it over the internet using an APIRule custom resource. The APIRule exposes a backend API using configured destinations and routes.

The backend is a simple HttpBin application that returns request headers as a response.

![scenario](./assets/scenario.drawio.svg)

> [!Note]
> A standalone application router is deployed with 2 replicas. To achieve session affinity, you must configure the [DestinationRule](k8s/deployment.yaml). Session affinity allows all subsequent traffic and requests from an initial client session to be passed to the same replica.

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites/README.md#kyma)
- [Kubernetes tooling](../prerequisites/README.md#kubernetes)

## Steps

1. Export environment variables:

   ```shell
   export NS={your-namespace}
   ```

2. Create a namespace and enable istio-injection, if not done yet:

   ```shell
   kubectl create namespace ${NS}
   kubectl label namespaces ${NS} istio-injection=enabled
   ```

3. Deploy the backend service:

   ```shell
   kubectl -n ${NS} apply -f k8s/httpbin.yaml
   ```

4. Create the XSUAA instance. Update the [service instance definition](k8s/xsuaa-service-instance.yaml). Replace {CLUSTER_DOMAIN} with the domain of your cluster.

   ```shell
   kubectl -n ${NS} apply -f k8s/xsuaa-service-instance.yaml
   ```

5. Create the destinations and routes configurations for the application router:

   ```shell
   kubectl -n ${NS} apply -f k8s/config.yaml
   ```

6. Deploy the application router:

   ```shell
   kubectl -n ${NS} apply -f k8s/deployment.yaml
   ```

7. Expose the application router using APIRule:

   ```shell
   kubectl -n ${NS} apply -f k8s/api-rule.yaml
   ```

## Access the Application

The application router is exposed at <https://my-approuter.{CLUSTER_DOMAIN}>. Access the URL <https://my-approuter.{CLUSTER_DOMAIN}/sap/com/httpbin/headers> to get all the request headers.
