# PostgreSQL sample for Kyma

## Overview

This sample seeds a managed PostgreSQL instance on SAP BTP with a small `orders` table. It assumes you already created a PostgreSQL Service Instance and Service Binding for your Kyma cluster. The Service Binding must produce a Kubernetes Secret containing the connection details (`hostname`, `port`, `dbname`, `username`, `password`, and optionally `sslmode`).

The sample demonstrates how to:

- Prepare a Kyma namespace for consuming a BTP-managed PostgreSQL instance.
- Seed the database using a Kubernetes Job that runs `psql` against the bound instance.

The SQL used to create and seed the table is stored in `app/setup.sql`. The Job definition lives in `k8s/seed-job.yaml`.

## Prerequisites

- SAP BTP, Kyma runtime instance
- Existing PostgreSQL Service Instance and Service Binding that exposes a Secret in your Kyma cluster
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime

## Deploy the sample

1. Create and label a `dev` namespace if it does not exist:

   ```shell
   kubectl create namespace dev
   kubectl label namespace dev istio-injection=enabled
   ```

2. Make sure the PostgreSQL Service Binding Secret is available in the `dev` namespace. If it was created elsewhere, copy it into `dev` or recreate the binding in `dev`. Adjust the Secret name and key names in `k8s/seed-job.yaml` if they differ from your binding.

3. Apply the ConfigMap and Job that seeds the database:

   ```shell
   kubectl -n dev apply -f ./k8s/seed-job.yaml
   ```

4. Wait for the Job to finish:

   ```shell
   kubectl -n dev get jobs seed-postgresql
   ```

5. (Optional) Verify the data using a temporary `psql` client Pod. Replace `postgresql-credentials` with your binding Secret name if it differs:

    ```shell
    kubectl -n dev apply -f - <<'EOF'
    apiVersion: v1
    kind: Pod
    metadata:
      name: pg-client
    spec:
      restartPolicy: Never
      containers:
      - name: psql
        image: postgres:15
        envFrom:
        - secretRef:
            name: postgresql-credentials
        command: ["psql"]
        args: ["-v", "ON_ERROR_STOP=1", "-c", "SELECT order_id, description, created FROM orders;"]
    EOF
    kubectl -n dev logs pod/pg-client
    kubectl -n dev delete pod/pg-client
    ```

## Cleanup

Delete the seeding assets if you no longer need them:

```shell
kubectl -n dev delete job seed-postgresql
kubectl -n dev delete configmap postgresql-sample-sql
```
