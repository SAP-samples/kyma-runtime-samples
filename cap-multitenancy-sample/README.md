# Overview

![mt-bookshop](./assets/bookshop-mt.png)

## Reference

- [CAP Documentation](https://cap.cloud.sap/docs/get-started/)
- [CAP Multitenancy](https://cap.cloud.sap/docs/guides/multitenancy/)
- [Deploy to Kyma](https://cap.cloud.sap/docs/guides/deployment/to-kyma)

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites/README.md#kyma)

> [!Note]
> If you're using an SAP BTP trial account, use a subaccount that supports SAP Hana Cloud. At the time of creating the sample (September 2025), SAP Hana Cloud is available in the US, but not in Singapore.

- [Docker](../prerequisites/README.md#docker)
- [Kubernetes tooling](../prerequisites/README.md#kubernetes)
- Kubectl configured to the namespace where you want to deploy the application
- [Pack](../prerequisites/README.md#pack)
- [NodeJS 22 or higher](https://nodejs.org/en/download/)
- [SAP CAP](../prerequisites/README.md#sap-cap)
- SAP Hana Cloud Instance

> [!Note]
> If you're using an SAP BTP trial account, make sure your subaccount location supports SAP Hana Cloud.

- Entitlement for `hdi-shared` plan for Hana cloud service in your SAP BTP subaccount.
- [SAP Hana Cloud Instance mapped to Kyma](https://blogs.sap.com/2022/12/15/consuming-sap-hana-cloud-from-the-kyma-environment/)

## Initial setup

- **Navigate to bookshop-external directory**.

> Note: All subsequent commands should be run from this directory.

```shell
cd bookshop-external
```

### Running the application locally

- Start sidecar

```shell
cds watch mtx/sidecar
```

- In another terminal, start CAP app

```shell
cds watch --profile local-multitenancy
```

- Run the commands from a new terminal to add tenants. Run the following commands or use [test.rest](./test.rest)

```shell
cds subscribe t1 --to http://localhost:4005 -u yves:
cds subscribe t2 --to http://localhost:4005 -u yves:
```

- Get data for both users

```shell
http http://localhost:4004/odata/v4/catalog/Books -a alice:
http http://localhost:4004/odata/v4/catalog/Books -a erin:
```

## Deploy to Kyma

- Update the following in [bookshop-external/chart/values.yaml](bookshop-external/chart/values.yaml)

  - `global.domain`: your kyma domain
  - `global.imagePullSecret.name`: your docker pull secret name if images are pulled from private registry
  - `global.image.registry`: your docker registry server

- Update the following in [bookshop-external/containerize.yaml](bookshop-external/containerize.yaml)
  - `repository`: your docker registry server

- Build the docker images and deploy the helm chart to Kyma

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

- Helm command to upgrade / install / reinstall the chart

```bash
helm upgrade --install bookshop-external ./gen/chart  --wait --wait-for-jobs --timeout=10m --set-file xsuaa.jsonParameters=xs-security.json
```
