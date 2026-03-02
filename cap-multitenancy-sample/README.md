# Build and Deploy a Multitenant CAP Application on Kyma

This is a simple end-to-end sample to demonstrate building and deploying a multitenant CAP application on Kyma.

![mt-bookshop](./assets/bookshop-mt-drawio.png)

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites/README.md#kyma)

   > ### Note:
   > If you're using an SAP BTP trial account, use a subaccount that supports SAP Hana Cloud. At the time of creating the sample (September 2025), SAP Hana Cloud is available in the US, but not in Singapore.

- [Docker](../prerequisites/README.md#docker)
- [Kubernetes tooling](../prerequisites/README.md#kubernetes)
- kubectl configured to the namespace where you want to deploy the application
- [Pack](../prerequisites/README.md#pack)
- [NodeJS 22 or higher](https://nodejs.org/en/download/)
- [SAP CAP](../prerequisites/README.md#sap-cap)
- SAP Hana Cloud instance

   > ### Note:
   > If you're using an SAP BTP trial account, make sure your subaccount location supports SAP Hana Cloud.

- Entitlement for `hdi-shared` plan for SAP Hana Cloud in your SAP BTP subaccount
- [SAP Hana Cloud instance mapped to Kyma](https://blogs.sap.com/2022/12/15/consuming-sap-hana-cloud-from-the-kyma-environment/)
- [curl](https://curl.se/)

## Procedure

### Run the Application Locally

1. Navigate to the `bookshop-external` directory.

   > ### Note
   > All subsequent commands should be run from this directory.

   ```shell
   cd bookshop-external
   ```

2. Start a sidecar.

   ```shell
   cds watch mtx/sidecar
   ```

3. In another terminal, start the CAP application.

   ```shell
   cds watch --profile local-multitenancy
   ```

4. Add tenants. Run the following commands in a new terminal or use [test.rest](./test.rest).

   ```shell
   cds subscribe t1 --to http://localhost:4005 -u yves:
   cds subscribe t2 --to http://localhost:4005 -u yves:
   ```

5. Get data for both users.

   ```shell
   curl -u alice: http://localhost:4004/odata/v4/catalog/Books
   curl -u erin: http://localhost:4004/odata/v4/catalog/Books
   ```

### Deploy on Kyma

1. Update the following parameters in [`bookshop-external/chart/values.yaml`](bookshop-external/chart/values.yaml):

   - **global.domain**: your Kyma domain
   - **global.imagePullSecret.name**: your Docker pull secret name if images are pulled from a private registry
   - **global.image.registry**: your Docker registry server

2. Update the following parameter in [`bookshop-external/containerize.yaml`](bookshop-external/containerize.yaml):
   - **repository**: your Docker registry server

3. Build the Docker images and deploy the Helm chart on Kyma.

   ```bash
   cds build --production
   cds up -2 k8s
   ```

### Verify

1. Simulate the subscribe flow by subscribing from a different subaccount in the same global account in SAP BTP cockpit.

2. Access the subscribed application.

### Clean Up

1. Unsubscribe the tenant from SAP BTP cockpit.
2. Undeploy the Helm chart.

   ```bash
   helm del --wait --timeout=10m bookshop-external
   ```

## Troubleshooting

Use Helm commands to upgrade/install/reinstall the chart. For example:

```bash
helm upgrade --install bookshop-external ./gen/chart  --wait --wait-for-jobs --timeout=10m --set-file xsuaa.jsonParameters=xs-security.json
```

## Related Information

- [CAP Documentation](https://cap.cloud.sap/docs/get-started/)
- [CAP Multitenancy](https://cap.cloud.sap/docs/guides/multitenancy/)
- [Deploy to Kyma](https://cap.cloud.sap/docs/guides/deployment/to-kyma)
