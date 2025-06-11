# Overview

Using this sample, you start from scratch to deploy a [CAP](https://cap.cloud.sap/docs/) NodeJS application on SAP BTP, Kyma runtime.

![cap-bookshop](assets/cap-booksop.png)

- You create a sample NodeJS-based CAP application, namely the Bookshop.
- You use Core Data Services (CDS) to create the necessary artifacts and configurations required to deploy the application on Kyma.
- You deploy and verify your running CAP application on SAP BTP, Kyma runtime.

> [!Note]
> For simplification most of the commands are defined using the [Makefile](Makefile). If you want to understand what the actual command is, run `make <command> --just-print`.

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites/README.md#kyma)
- [Docker](../prerequisites/README.md#docker)
- [make](https://www.gnu.org/software/make/)
- [Kubernetes tooling](../prerequisites/README.md#kubernetes)
- [Pack](../prerequisites/README.md#pack)
- [NodeJS 20 or higher](https://nodejs.org/en/download/)
- [SAP CAP](../prerequisites/README.md#sap-cap)
- SAP Hana Cloud Instance
- [SAP Hana Cloud Instance mapped to Kyma](https://blogs.sap.com/2022/12/15/consuming-sap-hana-cloud-from-the-kyma-environment/)

## CAP Application

1. Initialize the Cap Bookshop sample

  ```shell
  make init
  ```

   The initialized application is a simple Bookshop sample where you can access Book entries using API calls.
      - Data model defined in [./bookshop/db/schema.cds](./bookshop/db/schema.cds). <!-- markdown-link-check-disable-line -->
      - CDS defined in [./bookshop/srv/cat-service.cds](./bookshop/srv/cat-service.cds). <!-- markdown-link-check-disable-line -->

   > [!NOTE]
   > CAP promotes getting started with minimal upfront setup, based on convention over configuration, and a grow-as-you-go approach, adding settings and tools later on, only when you need them. For more information, see [Introduction to CAP](https://cap.cloud.sap/docs/about/).

2. Run the application locally

  ```shell
  make run-local
  ```

3. Access the CAP Srv at <http://localhost:4004>
4. Terminate the local running app with `^C`

## Deploying to Kyma

### Add default route for App router

1. Update the [bookshop/app/router/xs-app.json](bookshop/app/router/xs-app.json) to add a default route for the app router. This is required to access the CAP application via the URL. The end json should look as below: <!-- markdown-link-check-disable-line -->

   ```json
   {
     "welcomeFile": "/odata/v4/catalog/Books",
     "routes": [
       {
         "source": "^/(.*)$",
         "target": "$1",
         "destination": "srv-api",
         "csrfProtection": true
       }
     ]
   }
   ```

   > [!Note]
   > The standalone Application Router is used to simplify the setup and **is not a must**. It should be also possible to use the managed approuter because your CAP APIs are exposed via Fiori or UI5 applications and accessed using workzone.

### Configure environment variables

1. Set up the required environment variables:

  - In shell

      ```shell
      export DOCKER_ACCOUNT=<your-docker-account>
      export KUBECONFIG=<your-kubeconfig-file-path>
      export NAMESPACE=<your-kyma-namespace>
      export CLUSTER_DOMAIN=$(kubectl get cm -n kube-system shoot-info -ojsonpath='{.data.domain}')
      ```

  - In Windows powershell

      ```powershell
      $ENV:DOCKER_ACCOUNT="<your-docker-account>"
      $ENV:KUBECONFIG="<your-kubeconfig-file-path>"
      $ENV:NAMESPACE="<your-kyma-namespace>"
      $ENV:CLUSTER_DOMAIN=$(kubectl get cm -n kube-system shoot-info -ojsonpath='{.data.domain}')
      ```

2. **[Mac users]** Export the DOCKER_HOST.

   ```shell
   export DOCKER_HOST=unix://${HOME}/.docker/run/docker.sock
   ```

### Prepare for deployment

1. Do a basic check to see if the cluster is reachable. Running any of the basic commands such as `kubectl cluster-info` or `kubectl get pods` or `kubectl get namespaces` successfully should confirm that. If an error occurs, check your kubeconfig file and ensure that it is correctly set up to point to your Kyma cluster. Also, check if the cluster was provisioned successfully in the SAP BTP cockpit under your subaccount.

2. Create a namespace. You can skip this step if you already have a namespace. You can use any non-system namespace of your choice to deploy the sample application.

   > [!Note]
   > The following are system namespaces:
   > - `kube-system`
   > - `istio-system`
   > - `kyma-system`
   > It is not recommended to deploy your applications in the system namespaces.

   ```shell
   make create-namespace
   ```

3. Enable Istio injection for the namespace. Set the kubeconfig context to point to the namespace and create the Docker image pull Secret.

   ```shell
   make prepare-kyma-for-deployment
   ```

## Deploy to Kyma runtime

## Build Docker images

On Kyma runtime, application run as docker containers. They require a docker image to be created out of the application code / binaries.

The docker image can be stored on the docker registry. It can be a private docker registry where access is restricted with credentials.

We will use pack to build the docker images.

- Checkout what is happening when building the docker image

```shell
make build-hana-deployer --just-print
```

You will notice that `pack` intelligently identifies how to pack the source code and create the necessary artifacts. The same is also true for Java applications.

- Build and push the Hana deployer image

```shell
make build-hana-deployer
make push-hana-deployer
```

- Build and push the CAP Srv image

```shell
make build-cap-srv
make push-cap-srv
```

- Build and push the Approuter image

```shell
make build-approuter
make push-approuter
```

### Creating Helm Charts

Having the artifacts in place, focus to deploying the application.

First we need the configurations to tell Kyma what and how we want to deploy.

The sample uses [Helm charts](https://helm.sh/) to define the required configurations and then deploy them on the Kyma runtime.

`cds` can intelligently inspect what is defined in your CAP application and generate the necessary configurations (Helm charts) to deploy the application on Kyma runtime.

1. Create a Helm chart.

   ```shell
   make create-helm-chart
   ```

   Take a moment to understand the generated Helm chart in the [chart](./bookshop/chart) directory. <!-- markdown-link-check-disable-line -->

   The Helm chart structure should look as below. The full Helm chart is automatically generated by `cds` under the `gen` folder.

   ![helm-chart](assets/helm-chart-structure.png)

   - [bookshop/chart/Chart.yaml](bookshop/chart/Chart.yaml) contains the details about the chart and all its dependencies.<!-- markdown-link-check-disable-line -->
   - [bookshop/chart/values.yaml](bookshop/chart/values.yaml) <!-- markdown-link-check-disable-line --> contains all the details to configure the chart deployment. You will notice that it has sections for `hana deployer`, `cap application` as well as required `service instances` and `service bindings.`

2. Add Istio Destination Rule for the Application Router. Please check the [Approuter documentation](https://www.npmjs.com/package/@sap/approuter) for details about the `PLATFORM_COOKIE_NAME` configuration.

   ```shell
   make add-istio-destination-rule
   ```

### Deploy helm chart

1. Check the make command by running

```shell
make deploy-dry-run --just-print
```

You will notice that we are overriding a various properties defined in `chart/values.yaml`. This is standard helm feature where you can override your values by specifying them in the command line. This obviates the need to modify the `values.yaml` file. Of course, you can also update the `values.yaml` directly.

2. Run the command to do a dry run

```shell
make deploy-dry-run
```

Take some time to understand what all will be deployed and how does the configuration looks like.
It is interesting to notice that all these deployment configurations are auto-generated via cds.

**This ensures that you as a developer does not need work with the complexities of helm charts and configurations. At the same time, these pre-shipped charts follow the best practices when it comes to deploying on Kyma.**

3. Build and deploy to Kyma runtime.
  
```shell
make deploy
```

### Verify your deployment

- Check the state of the application pods. **Wait until pods are in running state.**

```shell
make check-status
```

- Check the hana deployer logs

```shell
make check-hana-deployer-logs
```

- Check the logs for the CAP application

```shell
make check-cap-srv-logs
```

- Check the logs for the Approuter

```shell
make check-approuter-logs
```

- Access the application via the app router URL. It will be of the form <https://bookshop-approuter-${NAMESPACE}.${KYMA_CLUSTER_DOMAIN}>

### Cleanup

- Delete the helm chart

```shell
make undeploy
```

This will delete the helm chart. Thereby all deployed applications, service instances and their bindings will be cleaned.

- Remove the namespace and bookshop cap application folder

```shell
make cleanup
```

## CAP Version

Latest verified on following CAP version.

| bookshop               | "Add your repository here" |
|------------------------|----------------------------|
| @cap-js/asyncapi       | 1.0.3                      |
| @cap-js/openapi        | 1.2.2                      |
| @sap/cds               | 8.9.4                      |
| @sap/cds-compiler      | 5.9.2                      |
| @sap/cds-dk (global)   | 8.9.4                      |
| @sap/cds-fiori         | 1.4.1                      |
| @sap/cds-foss          | 5.0.1                      |
| @sap/cds-mtxs          | 2.7.2                      |
| @sap/eslint-plugin-cds | 3.2.0                      |
| Node.js                | v22.11.0                   |

## Related Information

[SAP Cloud Application Programming Model](https://cap.cloud.sap/docs/)
