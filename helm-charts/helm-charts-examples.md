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

- [Deploy the SAPUI5 Frontend in SAP BTP, Kyma Runtime](../frontend-ui5-postgresql/README.md)
  - will also install dependent charts [Deploy a Go PostgreSQL API Endpoint in SAP BTP, Kyma Runtime](./api-postgresql-go/README.md) and [PostgreSQL Database](./database-postgres/README.md)
- [Use and Seed SAP BTP PostgreSQL in SAP BTP, Kyma Runtime](../database-postgres/README.md)
- [Sample Event Trigger Java](./sample-event-trigger-java/README.md)
- [Sample Extension Java](./sample-extension-java/README.md)
- [Sample Extension .Net](./sample-extension-dotnet/README.md)
- [Sample Extension Micronaut](./sample-extension-micronaut/README.md)
- [GeoServer](./geoserver/README.md)
