# From Zero to CAP on Kyma - Detailed Path

Using this sample, you start from scratch to deploy a [CAP](https://cap.cloud.sap/docs/) NodeJS application on SAP BTP, Kyma runtime.

![cap-bookshop](assets/from-zero-to-cap.drawio.svg)

- You create a sample NodeJS-based CAP application, namely the Bookshop.
- You use Core Data Services (CDS) to create the necessary artifacts and configurations required to deploy the application on Kyma.
- You deploy and verify your running CAP application on SAP BTP, Kyma runtime.

> [!Note]
> For simplification most of the commands are defined using the [Makefile](Makefile). If you want to understand what the actual command is, run `make <command> --just-print`.

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites/README.md#kyma)

> [!Note]
> If you're using an SAP BTP trial account, use a subaccount that supports SAP Hana Cloud. At the time of creating the sample (June 2025), SAP Hana Cloud is available in the US, but not in Singapore.
- [Docker](../prerequisites/README.md#docker)
- [make](https://www.gnu.org/software/make/)
- [Kubernetes tooling](../prerequisites/README.md#kubernetes)
- [Pack](../prerequisites/README.md#pack)
- [NodeJS 20 or higher](https://nodejs.org/en/download/)
- [SAP CAP](../prerequisites/README.md#sap-cap)
- SAP Hana Cloud Instance

> [!Note]
> If you're using an SAP BTP trial account, make sure your subaccount location supports SAP Hana Cloud.
- Entitlement for `hdi-shared` plan for Hana cloud service in your SAP BTP subaccount.
- [SAP Hana Cloud Instance mapped to Kyma](https://blogs.sap.com/2022/12/15/consuming-sap-hana-cloud-from-the-kyma-environment/)

## Initializing CAP Application

1. Initialize the CAP Bookshop sample

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

### Adding the Default Route for Application Router

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
> The standalone Application Router is used to simplify the setup and **is not a must**. It should also be possible to use the managed approuter because your CAP APIs are exposed via Fiori or UI5 applications and accessed using workzone.

### Configuring Environment Variables

1. Set up the required environment variables.
> [!Note] 
> You can download the kubeconfig file from your Kyma runtime instance in the SAP BTP cockpit. If you have already configured the default Kubeconfig, you should also be able to access the kubeconfig from your local machine under `~/.kube/config`.
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

### Preparing for the Deployment

1. Do a basic check to see if the cluster is reachable. Running any of the basic commands such as `kubectl cluster-info` or `kubectl get pods` or `kubectl get namespaces` successfully should confirm that. If an error occurs, check your kubeconfig file and ensure that it is correctly set up to point to your Kyma cluster. Also, check if the cluster was provisioned successfully in the SAP BTP cockpit under your subaccount.

2. Create a namespace. You can skip this step if you already have a namespace. You can use any non-system namespace of your choice to deploy the sample application.

> [!Note]
> The following are some of system namespaces:
> - `kube-system`
> - `istio-system`
> - `kyma-system`
> It is not recommended to deploy your applications in the system namespaces.

   ```shell
   make create-namespace
   ```

3. Enable Istio injection for the namespace. Set the kubeconfig context to point to the namespace and create the Docker image pull Secret.
  
   > [!Note]
   > - You will need a Docker API Key so that Kubernetes can pull the Docker images from your Docker account.
   > - `docker server` could be e.g. `https://index.docker.io/v1/` or your private docker registry server. **For this example, you may use the public Docker registry. However the recommended approach is to use a private Docker registry**.
   > - `docker user` is the username of your docker registry account.
   > - `docker password` is the API Key of your docker registry account.

   ```shell
   make prepare-kyma-for-deployment
   ```

### Building Docker Images

On Kyma runtime, application run as Docker containers. They require a Docker image to be created out of the application code/binaries.

The Docker image can be stored in the Docker registry. It can be a private Docker registry where access is restricted with credentials.

This sample uses a pack to build the Docker images.

1. Buid a Docker image and follow the logs.

   ```shell
   make build-hana-deployer --just-print
   ```

   The `pack` intelligently identifies how to pack the source code and create the necessary artifacts. The same is also true for Java applications.

2. Build and push the Hana deployer image.

   ```shell
   make build-hana-deployer push-hana-deployer
   ```

3. Build and push the CAP Srv image.

   ```shell
   make build-cap-srv push-cap-srv
   ```

4. Build and push the Approuter image.

   ```shell
   make build-approuter push-approuter
   ```

### Creating Helm Charts

Having the artifacts in place, focus to deploying the application.

The sample uses [Helm charts](https://helm.sh/) to define the required configurations and then deploy them on the Kyma runtime.

`cds` can intelligently inspect what is defined in your CAP application and generate the necessary configurations (Helm charts) to deploy the application on Kyma runtime.

1. Create a Helm chart. When asked for the registry server:
   * If you're using Docker Hub, enter your username. 
   * If you're using a private registry, enter the registry server URL.

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

### Deploying Helm Chart

1. Check the `make` command by running:

   ```shell
   make deploy-dry-run --just-print
   ```

The command overrides various properties defined in `chart/values.yaml`. This is a standard Helm feature that you can override your values by specifying them in the command line. This obviates the need to modify the `values.yaml` file. Of course, you can also update the `values.yaml` directly.

2. Run the command to do a dry run

   ```shell
   make deploy-dry-run
   ```

   Take some time to understand the deployment and what the configuration looks like. It is interesting to notice that all these deployment configurations are auto-generated using CDS.

   **This ensures that you as a developer don't have to work with the complexities of Helm charts and configurations. At the same time, these pre-shipped charts follow the best practices when it comes to deploying on Kyma.**

3. Build and deploy to the Kyma runtime.

   ```shell
   make deploy
   ```

### Verifying the Deployment

1. Check the state of the application pods. **Wait until the pods are in running state.**

   ```shell
   make check-status
   ```

2. Check the hana deployer logs.

   ```shell
   make check-hana-deployer-logs
   ```

3. Check the CAP application logs.

   ```shell
   make check-cap-srv-logs
   ```

4. Check the Application Router logs.

   ```shell
   make check-approuter-logs
   ```

5. Access the application using the Application Router URL. It should be similar to this one: <https://bookshop-approuter-${NAMESPACE}.${KYMA_CLUSTER_DOMAIN}>.

### Cleaning Up

1. Delete the Helm chart. This command removes all the deployed applications, service instances, and their bindings.

   ```shell
   make undeploy
   ```

2. Remove the namespace and the Bookshop CAP application folder.

   ```shell
   make cleanup
   ```

## CAP Version

The sample uses the following CAP versions.

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
