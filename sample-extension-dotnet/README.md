# ASP.NET-based extension with API exposed via Microgateway

## Overview

This sample demonstrates how to build and deploy an ASP.NET-based microservice as an extension and expose the API in SAP BTP, Kyma runtime.

You can find the application code in the [sample-extension-dotnet](./sample-extension-dotnet) directory.

![extension](assets/extension.png)

This sample demonstrates how to:

* Create a development Namespace in the Kyma runtime.
* Create and deploy an ASP.NET application in the Kyma runtime.
* Expose the ASP.NET application using [APIRules](https://kyma-project.io/external-content/api-gateway/docs/user/custom-resources/apirule/04-10-apirule-custom-resource.html).
* Call the APIs.

## Prerequisites

* SAP BTP, Kyma runtime instance
* [Docker](https://www.docker.com/)
* [make](https://www.gnu.org/software/make/)<!-- markdown-link-check-disable-line -->
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime

## Steps

### Prepare for deployment

* Create a new `dev` Namespace:

    ```shell
    kubectl create namespace dev
    kubectl label namespaces dev istio-injection=enabled
    ```

* Build and push the image to the Docker repository:

    ```shell
    DOCKER_ACCOUNT={your-docker-account} make push-image
    ```

* Update the image name in the [Kubernetes Deployment](k8s/deployment.yaml). Refer to the standard Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and [Service](https://kubernetes.io/docs/concepts/services-networking/service/) definitions.

### Kubernetes Deployment

This section details out deploying the extension using standard Kubernetes resources.

To deploy as Helm chart, please refer to [Helm Chart Deployment](#helm-chart-deployment)

* Deploy the application:

    ```shell
    kubectl -n dev apply -f ./k8s/deployment.yaml
    ```

* Verify that the Pods are up and running:

    ```shell
    kubectl -n dev get po -l app=sample-extension-dotnet
    ```

The expected result shows that the Pod for the `sample-extension-dotnet` Deployment is running:

```shell
kubectl -n dev get po -l app=sample-extension-dotnet
NAME                                       READY   STATUS    RESTARTS   AGE
sample-extension-dotnet-774fbc5c7b-x44pd   2/2     Running   0          15s
```

#### Expose the API

1. Create an APIRule. In the APIRule, specify the Kubernetes Service that is exposed:

```yaml 
apiVersion: gateway.kyma-project.io/v2
kind: APIRule
metadata:
  name: sample-extension-dotnet
spec:
  gateway: kyma-system/kyma-gateway
  hosts: 
  - sample-extension-dotnet
  rules:
    - noAuth: true
      methods:
        - GET
        - POST
        - PUT
        - DELETE
      path: /*
      service:
        name: sample-extension-dotnet
        port: 80
```

This sample snippet exposes the `sample-extension-dotnet` Service. The Service is specified in the **spec.service.name** field.
The `sample-extension-dotnet` subdomain is specified in the **spec.service.host** field.

2. Apply the APIRule:

    ```shell
    kubectl -n dev apply -f ./k8s/api-rule.yaml
    ```

### Helm Chart Deployment

A [Helm Chart definition](../helm-charts/sample-extension-dotnet/README.md) is also available for developers to try out.

#### Must Haves

* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* [Helm3](https://helm.sh/docs/intro/install/)

#### Helm install

* To install the helm chart in `dev` namespace, run the following command. Change to use your image.

    ```shell
    helm install kymaapp ../helm-charts/sample-extension-dotnet --set image.repository=gabbi/sample-extension-dotnet:0.0.1 -n dev
    ```

* To verify, the installed chart, run `helm -n dev ls`

    ```shell
    NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
    dev-gateway     dev             1               2020-09-14 17:34:58.607853163 +0000 UTC deployed        gateway-0.0.1
    kymaapp         dev             1               2020-09-15 15:18:34.502591 +0200 CEST   deployed        sample-extension-dotnet-0.1.0   1.16.0
    ```

### Try it out

* Access the APIs through this URL:

    ```shell
    https://sample-extension-dotnet.{cluster domain}
    ```

* Make an HTTP call using curl:

    ```shell
    curl https://sample-extension-dotnet.{cluster domain}
    Hello from dotnet app running on Kyma Runtime
    ```
