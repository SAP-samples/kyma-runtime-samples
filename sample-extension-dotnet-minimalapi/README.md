# Overview

[![Build docker sample-extension-dotnet-minimalapi](https://github.com/SAP-samples/kyma-runtime-extension-samples/actions/workflows/build-docker-sample-extension-dotnet-minimalapi.yml/badge.svg?branch=main)](https://github.com/SAP-samples/kyma-runtime-extension-samples/actions/workflows/build-docker-sample-extension-dotnet-minimalapi.yml)

This sample demonstrates how to build and deploy an ASP.NET Core-based microservice as an extension leveraging the minimal web API functionality and exposing the API in SAP BTP, Kyma runtime.

You can find the application code in the [TodoApi](./TodoApi) directory.

This sample demonstrates how to:

* Create a development Namespace in the Kyma runtime.
* Create and deploy an ASP.NET Core-based application in the Kyma runtime.
* Expose the ASP.NET Core application using [APIRules](https://kyma-project.io/external-content/api-gateway/docs/user/custom-resources/apirule/04-10-apirule-custom-resource.html).
* Call the API.

## ToDo App

The application used in this sample is described [here](https://docs.microsoft.com/aspnet/core/tutorials/min-web-api?view=aspnetcore-6.0&tabs=visual-studio)

## Prerequisites

This tutorial requires the following prerequisites:

* [Docker](../prerequisites/README.md#docker)
* [Kubernetes](../prerequisites/README.md#kubernetes)
* [.NET](../prerequisites/README.md#net)
* [REST Client Extension](../prerequisites/README.md#rest-clients)
* [Build Tooling](../prerequisites/README.md#build-tooling)

## Steps

### Prepare for deployment

* Create a new `dotnetdev` Namespace:

```shell
kubectl create namespace dotnetdev
kubectl label namespaces dotnetdev istio-injection=enabled
```

* Adjust the placeholder `DOCKER_ACCOUNT` in the [Makefile](Makefile) and then build and push the image to the Docker repository:

```shell
DOCKER_ACCOUNT={your-docker-account} make build-and-push-image
```

* Update the image name in the [Kubernetes Deployment](k8s/deployment.yaml). Refer to the standard Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and [Service](https://kubernetes.io/docs/concepts/services-networking/service/) definitions.

### Kubernetes Deployment

This section details out deploying the extension using standard Kubernetes resources.

To deploy as Helm chart, please refer to [Helm Chart Deployment](#helm-chart-deployment)

* Deploy the application:

```shell
kubectl -n dotnetdev apply -f ./k8s/deployment.yaml
```

* Verify that the Pods are up and running:

```shell
kubectl -n dotnetdev get po -l app=sample-extension-dotnet-minimalapi
```

The expected result shows that the Pod for the `sample-extension-dotnet` Deployment is running:

```shell
kubectl -n dotnetdev get po -l app=sample-extension-dotnet-minimalapi
NAME                                                  READY   STATUS    RESTARTS   AGE
sample-extension-dotnet-minimalapi-774fbc5c7b-x44pd   2/2     Running   0          15s
```

#### Expose the API

1. Create an APIRule. In the APIRule, specify the Kubernetes Service that is exposed:

```yaml
apiVersion: gateway.kyma-project.io/v2
kind: APIRule
metadata:
  name: sample-extension-dotnet-minimalapi
spec:
  gateway: kyma-system/kyma-gateway
  hosts:
  - sample-extension-dotnet-minimalapi
  rules:
    - noAuth: true
      methods:
        - GET
        - POST
        - PUT
        - DELETE
      path: /*
  service:
    name: sample-extension-dotnet-minimalapi
    port: 5046
```  

This sample snippet exposes the `sample-extension-dotnet-minimalapi` Service. The Service is specified in the **spec.service.name** field.
The `sample-extension-dotnet-minimalapi` subdomain is specified in the **spec.service.host** field.

* Apply the APIRule:

```shell
kubectl -n dotnetdev apply -f ./k8s/api-rule.yaml
```

### Helm Chart Deployment

A [Helm Chart definition](../helm-charts/sample-extension-dotnet/README.md) is also available for developers to try out.

#### Prerequisites

The following prerequisites are needed:

* [Docker](../prerequisites/README.md#docker)
* [Kubernetes](../prerequisites/README.md#kubernetes)

#### Helm install

To install the helm chart in `dotnetdev` namespace, run the following command. Change the placeholder `<YOUR DOCKER ACCOUNT>` to use your account.

```shell
helm install kymaapp ../helm-charts/sample-extension-dotnet-minimalapi --set image.repository=<YOUR DOCKER ACCOUNT>/dotnet6minimalapi:0.0.1 -n dotnetdev
```

To verify, the installed chart, run

```shell
helm -n dotnetdev ls
```

This should give you an output like

```shell
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
dev-gateway     dev             1               2020-09-14 17:34:58.607853163 +0000 UTC deployed        gateway-0.0.1
kymaapp         dev             1               2020-09-15 15:18:34.502591 +0200 CEST   deployed        sample-extension-dotnet-0.1.0   1.16.0
```

### Try it out

Access the APIs through this URL:

```shell
https://sample-extension-dotnet-minimalapi.{cluster domain}
```

See several sample calls in the file [samplerequests.http](samplerequests.http). Put the right name for the hostname into the file and execute the different commands to interact with your todo list.
