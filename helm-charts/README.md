# Helm Chart Examples

## Overview

This directory contains various helm chart examples which can be used to deploy and manage Kubernetes resources.  Each chart contains a `values.yaml` which contains the configuration parameters of the chart.

For more information see [helm](https://helm.sh/)

## Prerequisites

- SAP BTP, Kyma Runtime instance
- [Helm](https://helm.sh/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- `kubectl` is configured to `KUBECONFIG` downloaded from Kyma Runtime.

## Samples

- [UI5 Frontend MSSQL](./frontend-ui5-mssql/README.md)
  - will also install dependent charts [Golang MSSQL Database API](./api-mssql-go/README.md) and [MSSQL Database](./database-mssql/README.md)
- [Golang MSSQL Database API](./api-mssql-go/README.md)
  - will also install dependent chart [MSSQL Database](./database-mssql/README.md)
- [MSSQL Database](./database-mssql/README.md)
- [Sample Event Trigger Java](./sample-event-trigger-java/README.md)
- [Sample Extension Java](./sample-extension-java/README.md)
- [Sample Extension .Net](./sample-extension-dotnet/README.md)
- [Sample Extension Micronaut](./sample-extension-micronaut/README.md)
- [GeoServer](./geoserver/README.md)
