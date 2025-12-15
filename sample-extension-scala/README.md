# Scala AKKA HTTP based extesnsion with API exposed via Microgateway

## Overview

This sample demonstrates how to build and deploy a Scala Based Akka-HTTP microservice as an extension and expose the API in SAP BTP, Kyma runtime.

![extension](./assets/extension.png)

This sample demonstrates how to:

* Create a development Namespace in the Kyma runtime.
* Create and deploy a Scala AKKA-HTTP microservice in the Kyma runtime.
* Expose the microservice using [APIRules](https://kyma-project.io/external-content/api-gateway/docs/user/custom-resources/apirule/04-10-apirule-custom-resource.html).
* Explore the APIs.

## Prerequisites

* SAP BTP, Kyma runtime instance
* [Docker](https://www.docker.com/)
* [make](https://www.gnu.org/software/make/)<!-- markdown-link-check-disable-line -->
* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime
* [Java 11+](https://openjdk.java.net/projects/jdk/11/)
* [sbt](https://www.scala-sbt.org/)

## Application

The Scala Based Akka-HTTP microservice implements a simple `Orders` API with CRUD operations.

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

### Kubernetes Deployment

This section details out deploying the extension using standard Kubernetes resources.

To deploy as Helm chart, please refer to [Helm Chart Deployment](#helm-chart-deployment)

* Update the image name in the [Kubernetes Deployment](k8s/deployment.yaml). Refer to the standard Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and [Service](https://kubernetes.io/docs/concepts/services-networking/service/) definitions.

* Deploy the application:

    ```shell
    kubectl -n dev apply -f ./k8s/deployment.yaml
    ```

* Verify that the Pods are up and running:

    ```shell
    kubectl -n dev get po
    ```

The expected result shows that the Pod for the `sample-extension-scala` Deployment is running:

```shell
NAME                                     READY   STATUS    RESTARTS   AGE
sample-extension-scala-76b545f95b-xh6fx   2/2     Running   0          4m10s
```

#### Expose the API

* Create an APIRule. In the APIRule, specify the Kubernetes Service that is exposed:

    ```yaml
    apiVersion: gateway.kyma-project.io/v1alpha1
    kind: APIRule
    metadata:
      name: sample-extension-scala
    spec:
      gateway: kyma-gateway.kyma-system.svc.cluster.local
      rules:
        - accessStrategies:
            - config: {}
              handler: noop
          methods:
            - GET
            - POST
            - PUT
            - DELETE
          path: /.*
      service:
        host: sample-extension-scala
        name: sample-extension-scala
        port: 8080
    ```  

This sample snippet exposes the `sample-extension-scala` Service. The Service is specified in the **spec.service.name** field.
The `sample-extension-scala` subdomain is specified in the **spec.service.host** field.

* Apply the APIRule:

    ```shell
    kubectl -n dev apply -f ./k8s/api-rule.yaml
    ```

### Helm Chart Deployment

A [Helm Chart definition](../helm-charts/sample-extension-scala/README.md) is also available for developers to try out.

#### Must Haves

* [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
* [Helm3](https://helm.sh/docs/intro/install/)

#### Helm install

To install the helm chart in `dev` namespace, run the following command. Change to use your image.

```shell
helm install kymaapp ../helm-charts/sample-extension-scala --set image.repository=gabbi/sample-extension-scala:0.0.1 -n dev
```

To verify, the installed chart, run 

```shell
helm -n dev ls
```

```shell
NAME            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
kymaapp         dev             1               2020-09-25 17:23:36.838647 +0200 CEST   deployed        sample-extension-scala-0.1.0    1.16.0
```

### Try it out

Access the APIs through this URL: <https://sample-extension-scala.{cluster domain}/orders>
