# Overview

![mt-bookshop](./assets/bookshop-mt.png)

## Reference

- [CAP Documentation](https://cap.cloud.sap/docs/get-started/)
- [CAP Multitenancy](https://cap.cloud.sap/docs/guides/multitenancy/)
- [Deploy to Kyma](https://cap.cloud.sap/docs/guides/deployment/to-kyma)

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites/README.md#kyma)

> [!Note]
> If you're using an SAP BTP trial account, use a subaccount that supports SAP Hana Cloud. At the time of creating the sample (June 2025), SAP Hana Cloud is available in the US, but not in Singapore.

- [Docker](../prerequisites/README.md#docker)
- [Kubernetes tooling](../prerequisites/README.md#kubernetes)
- [Pack](../prerequisites/README.md#pack)
- [NodeJS 22 or higher](https://nodejs.org/en/download/)
- [SAP CAP](../prerequisites/README.md#sap-cap)
- SAP Hana Cloud Instance

> [!Note]
> If you're using an SAP BTP trial account, make sure your subaccount location supports SAP Hana Cloud.

- Entitlement for `hdi-shared` plan for Hana cloud service in your SAP BTP subaccount.
- [SAP Hana Cloud Instance mapped to Kyma](https://blogs.sap.com/2022/12/15/consuming-sap-hana-cloud-from-the-kyma-environment/)

## Initial setup

- Delete the existing `bookshop-external` directory if you have cloned the repo.

- Initialize the project

```shell
cds init bookshop-external --add tiny-sample,nodejs,multitenancy
```

- **Navigate to bookshop-external directory**.

> Note: All subsequent commands should be run from this directory.

```shell
cd bookshop-external
```

- Add sqlite

```shell
cds add sqlite --for development
```

- For local testing, create a new profile that contains the multitenancy configuration:

```shell
cds add multitenancy --for local-multitenancy
```

- Enable xsuaa, hana

```shell
cds add xsuaa,hana --for production
```

- For cds build

```shell
npm install
cds build --production
```

### Running the application locally

- Start sidecar

```shell
cds watch mtx/sidecar
```

- Start CAP app

```shell
cds watch --profile local-multitenancy
```

- Add tenants. Run the following commands or use [test.rest](./test.rest)

```shell
cds subscribe t1 --to http://localhost:4005 -u yves:
cds subscribe t2 --to http://localhost:4005 -u yves:
```

- Get data for both users

```shell
http http://localhost:4004/odata/v4/catalog/Books -a alice:
http http://localhost:4004/odata/v4/catalog/Books -a erin:
```

### Approuter

- Add approuter

```shell
cds add approuter --for production
```

- Update the [bookshop-external/app/router/xs-app.json](bookshop-external/app/router/xs-app.json) to add a default route for the app router. This is required to access the CAP application via the URL. The end json should look as below:

```json
{
    "welcomeFile": "/odata/v4/catalog/Books",
    //rest of the configuration
}
```

## Deploy to Kyma

### Build docker images

- Add helm and containerize

```shell
cds add helm,containerize
```

- Build and deploy the helm chart to Kyma

```bash
cds build --production
cds up -2 k8s
```

## Verify

- Simulate the subscribe flow by subscribing from a different subaccount in the same Global account in BTP cockpit.

- Access the subscribed application.

## Cleanup

- Unsubscribe the tenant from the BTP cockpit.
- Undelloy the helm chart

```bash
helm del --wait --timeout=10m bookshop-external
```

## Troubleshooting

- Helm command to upgrade / install the chart

```bash
helm upgrade --install bookshop-external ./gen/chart  --wait --wait-for-jobs --timeout=10m --set-file xsuaa.jsonParameters=xs-security.json
```
