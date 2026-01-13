# SAP BTP, Kyma Runtime: Use KEDA Module Capabilities for Efficient and Cost-Effective Scaling

SAP Business Technology Platform (BTP), Kyma runtime is currently in the process of undergoing a pivotal change as it transitions to a modular architecture. This transformation will provide customers with the advantage of a la carte selection of components or capabilities, thereby reducing unnecessary overhead and complexity. One of the first modules to emerge within this novel framework is KEDA (Kubernetes Event-driven Autoscaling).

## Introduction to KEDA

[KEDA](https://keda.sh/), an open-source initiative that facilitates event-driven autoscaling for Kubernetes workloads, was originally developed by Microsoft and Red Hat. It has since become a sandbox project under the Cloud Native Computing Foundation (CNCF). KEDA focuses on autoscaling applications in response to events sourced from a variety of platforms, including Kafka, RabbitMQ, and cloud-specific services such as Azure Service Bus and Google Pub/Sub.

### The Benefits of KEDA

KEDA ushers in a new era of flexibility and efficiency in autoscaling. It enhances Kubernetes' capacity to support fine-grained autoscaling for event-driven workloads. Leveraging KEDA, you can dynamically scale your deployments from zero to any arbitrary number, contingent on the volume of events they are designed to process.

### Activating the KEDA Module in SAP BTP, Kyma Runtime

You can activate KEDA like any other module by adhering to the official guidelines on how to [enable and disable a module](https://help.sap.com/docs/btp/sap-business-technology-platform/enable-and-disable-kyma-module).

### KEDA's Cron-Based Scaler

KEDA offers a broad range of scaling strategies, one of which is the **cron-based scaler**. This scaler allows you to schedule scaling actions according to the time of day, an invaluable feature for managing predictable fluctuations in workload.

As an illustration, the cron-based scaler enables you to:

- **Manage High Traffic and Request Volume Peaks**: With the cron-based scaler, you can program your applications to upscale during peak hours or high-traffic events, such as Black Friday or New Year sales. The same functionality can be used to schedule your applications to upscale during off-peak hours for batch processing tasks.

![bf](assets/keda-scale-bf.png)

- **Optimize Resource Utilization and Reduce Expenses**: The cron-based scaler offers a solution to optimize resource utilization and reduce costs by allowing you to schedule your applications to downscale during non-working hours. This feature is useful for your **dev/stage/QA** clusters, which are not required during off-working hours.

  > **Note:** This benefits when your workloads require more resources than the base setup. The [current base setup](https://kyma-project.github.io/price-calculator/) consists of 3 VMs, each with 4 CPU and 16 GB of RAM. Therefore, if your workloads need 4 or more VMs to be provisioned, this feature can provide benefits to control costs and keep them to base setup during off-work hours.

  > **Note:** The cron scheduling is applicable to only customer workloads and **not kyma components**.

![off-work](assets/keda-scale-off-work.png)

## Context

Let's put the cron-based scaler into action and assume we have a **development cluster** where we want to run customer workloads only during work hours, namely, **Monday - Friday, 8 AM to 6 PM**.

## Prerequisites

- [SAP BTP, Kyma runtime instance](../prerequisites/README.md#kyma)
- [Kubernetes tooling](../prerequisites/README.md#kubernetes)
- [KEDA and Serverless Modules enabled in Kyma](https://help.sap.com/docs/btp/sap-business-technology-platform/enable-and-disable-kyma-module)

## Procedure

1. Export your namespace's name as an environment variable.

  ```shell
  export NS={your-namespace}
  ```

2. Create the namespace. If you haven't done so already, enable Istio injection.

  ```shell
  kubectl create ns ${NS}
  kubectl label namespaces ${NS} istio-injection=enabled
  ```

3. Create a Function, a Deployment and a StatefulSet as sample workloads.

  ```shell
  kubectl -n ${NS} apply -f k8s/deployment.yaml
  kubectl -n ${NS} apply -f k8s/function.yaml
  kubectl -n ${NS} apply -f k8s/statefulset.yaml
  ```

4. Apply KEDA cron-based scaling to these workloads.

  ```shell
  kubectl -n ${NS} apply -f k8s/keda-cron-scaler.yaml
  ```

## How It Works

The KEDA `scaledobject` resource can be configured with a trigger of type `cron`. Within the cron scaler, you can specify that the workloads should only run during working hours.

```yaml
  triggers:
    - type: cron
      metadata:
        # You must use values from the IANA Time Zone Database.
        timezone: Europe/Berlin  
        # At 08:00 AM, from Monday to Friday
        start: 0 8 * * 1-5
        # At 06:00 PM, from Monday to Friday
        end: 0 18 * * 1-5
        # Your minimum replica count for the workload
        desiredReplicas: "1"
```

For each type of workload, you must specify **scaleTargetRef**.

```yaml
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: test-keda-cron-nginx
```

```yaml
spec:
  scaleTargetRef:
    apiVersion: serverless.kyma-project.io/v1alpha2
    kind: Function
    name: test-keda-cron-function
```

## View the Events

Check the events occurring at the start or end time of the trigger. In the following example, you can see KEDA scaling down the replicas:

```shell
kubectl -n ${NS} get events
```

```shell
LAST SEEN   TYPE      REASON                       OBJECT                                       MESSAGE
7m34s       Normal    Killing                      pod/test-keda-cron-nginx-86b78b79df-r42zd    Stopping container istio-proxy
7m34s       Normal    Killing                      pod/test-keda-cron-nginx-86b78b79df-r42zd    Stopping container nginx
7m31s       Warning   Unhealthy                    pod/test-keda-cron-nginx-86b78b79df-r42zd    Readiness probe failed: HTTP probe failed with statuscode: 503
7m34s       Normal    SuccessfulDelete             replicaset/test-keda-cron-nginx-86b78b79df   Deleted pod: test-keda-cron-nginx-86b78b79df-r42zd
7m34s       Normal    KEDAScaleTargetDeactivated   scaledobject/test-keda-cron-nginx            Deactivated apps/v1.Deployment demos/test-keda-cron-nginx from 1 to 0
7m34s       Normal    ScalingReplicaSet            deployment/test-keda-cron-nginx              Scaled down replica set test-keda-cron-nginx-86b78b79df to 0 from 1
```

  > **Note:** Events are only available for one hour after the trigger.

## First-Hand Experience

I applied the KEDA cron scaler to all custom workloads in my Kyma cluster.

All my microservices and functions replicas were scaled down to zero.

![dep-off](assets/keda-off-hours.png)

Additionally, the number of nodes (VMs) was reduced from 4 to 3.

![nodes-off](assets/nodes-off-hours.png)

## Related Links

- <https://medium.com/@CloudifyOps/optimizing-kubernetes-workloads-with-keda-custom-metric-driven-pod-autoscaling-7332e674fdc6><!-- markdown-link-check-disable-line -->
- <https://doc.kaas.thalesdigital.io/docs/Features/keda>
