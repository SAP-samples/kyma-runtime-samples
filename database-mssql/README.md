# MS SQL database

## Overview

This sample provides the MS SQL database configured with a sample `DemoDB` database which contains one `Orders` table populated with two rows of sample data. The `app/setup.sql` file handles the generation of the database, table, and data. Within the `app/init-db.sh` file, you can also configure the database user and password. They must match the configuration of the Secret defined within the `k8s/deployment.yaml` file.

This sample demonstrates how to:

- Create a development Namespace in Kyma runtime.
- Configure and build the MS SQL database Docker image.
- Deploy the MS SQL database in Kyma runtime which includes:
  - A Secret containing the database user and password.
  - A PersistentVolumeClaim for the storage of the database data.
  - A Deployment of the MS SQL image with the Secret and PersistentVolumeClaim configuration.
  - A Service to expose the database to other Kubernetes resources.

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.

## Deploy the database

1. Create a new `dev` Namespace:

   ```shell
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Build and push the image to your Docker repository:

   ```shell
   docker build -t {your-docker-account}/mssql -f docker/Dockerfile .
   docker push {your-docker-account}/mssql
   ```

3. Apply the PersistentVolumeClaim:

   ```shell
   kubectl -n dev apply -f ./k8s/pvc.yaml
   ```

4. Apply the Secret:

   ```shell
   kubectl -n dev apply -f ./k8s/secret.yaml
   ```

5. Apply the Deployment:

   ```shell
   kubectl -n dev apply -f ./k8s/deployment.yaml
   ```

6. Verify that the Pod is up and running:

   ```shell
   kubectl -n dev get po
   ```

The expected result shows that the Pod for the `mssql` Deployment is running:

```shell
NAME                                     READY   STATUS    RESTARTS   AGE
mssql-6df65c689d-nf9dk                   2/2     Running   0          93s
```

## Run the Docker image locally

To run the Docker image locally, run this command:

```shell
docker run -e ACCEPT_EULA=Y -e SA_PASSWORD=Yukon900 -p 1433:1433 -d {docker id}/mssql
```
