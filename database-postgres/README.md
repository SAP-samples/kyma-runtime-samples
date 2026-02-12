
# PostgreSQL database

## Overview

This sample provides a PostgreSQL database configured with a sample `DemoDB` database containing one `Orders` table populated with two rows of sample data. The `app/setup.sql` file handles the creation of the database, table, and data. In the `app/init-db.sh` file, you can also configure the database user and password. They must match the configuration of the Secret defined in the `k8s/secret.yaml` file.

This sample demonstrates how to:

- Create a development namespace in Kyma runtime.
- Configure and build the PostgreSQL database Docker image.
- Deploy the PostgreSQL database in Kyma runtime, which includes:
   - A Secret containing the database user and password.
   - A PersistentVolumeClaim for the storage of the database data.
   - A Deployment of the PostgreSQL image with the Secret and PersistentVolumeClaim configuration.
   - A Service to expose the database to other Kubernetes resources.


## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/) with a valid public account
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime


## Deploy the database

1. Create a new `dev` Namespace and enable Istio:

   ```shell
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Build and push the Docker image to your repository (replace `<your-docker-id>` with your Docker Hub ID):

   ```shell
   docker build -t <your-docker-id>/postgres -f docker/Dockerfile .
   docker push <your-docker-id>/postgres
   ```

3. Apply the PersistentVolumeClaim:

   ```shell
   kubectl -n dev apply -f ./k8s/pvc.yaml
   ```

4. Apply the Secret:

   ```shell
   kubectl -n dev apply -f ./k8s/secret.yaml
   ```

5. In `k8s/deployment.yaml`, set the correct image (e.g. `<your-docker-id>/postgres`), then apply the Deployment:

   ```shell
   kubectl -n dev apply -f ./k8s/deployment.yaml
   ```

6. Verify that the Pod is up and running:

   ```shell
   kubectl -n dev get po
   ```

The expected result shows a Pod for the `postgres` Deployment running:

```shell
NAME                                     READY   STATUS    RESTARTS   AGE
postgres-6df65c689d-xxxxx                2/2     Running   0          93s
```


## Run the Docker image locally

To run the Docker image locally (replace `<your-docker-id>` with your Docker Hub ID):

```shell
docker run -e POSTGRES_DB=DemoDB -e POSTGRES_PASSWORD=Yukon900 -p 5432:5432 --name postgres1 -d <your-docker-id>/postgres
```

To open a bash shell in the container:

```shell
docker exec -it postgres1 bash
```

Then start the psql client:

```shell
psql -U postgres -d DemoDB
```

Example query:

```shell
SELECT * FROM orders;
```

To exit psql, type `\q`, and to exit bash, type `exit`.