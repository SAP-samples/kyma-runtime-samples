# Data Backup and restore in SAP BTP, Kyma runtime

## Overview

This sample demonstrates how to take volume snapshots (backups) for a stateful application deployed on SAP BTP, Kyma runtime.

As a next step, it demonstrates restoring the data from a volume snapshot.

## Prerequisites

* [SAP BTP, Kyma runtime instance](../prerequisites/README.md#kyma)
* [Kubernetes tooling](../prerequisites/README.md#kubernetes)

## Set up the app

* Create a dev namespace

    ```shell script
    kubectl create namespace dev
    
    kubectl label namespaces dev istio-injection=enabled
    ```

* Create a stateful application. For this demo, we will deploy a busybox based [StatefulSet](k8s/statefulset.yaml) that has a PersistentVolumeClaim attached.

    ```shell script
    kubectl -n dev apply -f k8s/statefulset.yaml
    ```

* Wait for the stateful application to get up and running

    ```shell script
    kubectl -n dev get po -l app=example-stateful-app
    ```

* Let's store some data in the stateful app

    ```shell script
    kubectl -n dev exec example-stateful-app-0 -c example-stateful-app -- /bin/sh -c "echo 'my crucial data' >> /data/1.txt"
    ```

* Verify that data is there

    ```shell script
    kubectl -n dev exec example-stateful-app-0 -c example-stateful-app -- /bin/sh -c "cat /data/1.txt"
    ```

## Take Snapshot

* Create a snapshot class. The driver specified `driver: disk.csi.azure.com` depends upon the hyperscaler used. Please refer to this [Kyma open source documentation, Gardener Section](https://kyma-project.io/04-operation-guides/operations/10-backup-kyma.html#create-on-demand-volume-snapshots) to provide the appropriate value.

    ```shell script
    kubectl apply -f k8s/snapshot-class.yaml
    ```

* Take a snapshot of the persistent volume

    ```shell script
    kubectl -n dev apply -f k8s/snapshot.yaml
    ```

* Wait until the volume snapshot status is Ready to use.

    ```shell script
    kubectl -n dev get volumesnapshot
    ```

## Simulate a disaster

Let's simulate a disaster scenario.

* Remove the app as well as the persistent volume claim.

    ```shell script
    kubectl -n dev delete -f k8s/statefulset.yaml

    kubectl -n dev delete pvc storage-example-stateful-app-0
    ```

## Recovery

Lets deploy the app and also recover the data using the snapshot.

We will restore the [statefuleset](k8s/restored-statefulset.yaml) and provide a datasource as the snapshot previously created.

    ```yaml
    volumeClaimTemplates:
    - metadata:
        name: pvc-restored
        spec:
        accessModes:
        - ReadWriteOnce
        dataSource:
            kind: VolumeSnapshot
            name: snapshot
            apiGroup: snapshot.storage.k8s.io
        resources:
            requests:
            storage: 1Gi
    ```

* Restore the data and application
  
    ```shell script
    kubectl -n dev apply -f k8s/restored-statefulset.yaml
    ```

* Wait for the pod to be up and running

    ```shell script
    kubectl -n dev get po -l app=example-stateful-app
    ```

* Verify that the data is restored

    ```shell script
    kubectl -n dev exec example-stateful-app-0 -c example-stateful-app -- /bin/sh -c "cat /data/1.txt"
    ```
