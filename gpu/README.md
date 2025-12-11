# Running GPU workload in Kyma cluster

_Based on Gardener guide: https://github.com/gardener/gardener-ai-conformance/blob/main/v1.33/NVIDIA-GPU-Operator.md_


## Prerequisites

- helm 3.x installed
- kubectl installed and configured to access your Kyma cluster
- worker pool with GPU nodes available in your Kyma cluster

### Setting Up GPU Worker Pool

Go to BTP cockpit and update SAP Kyma Runtime instance and add new worker pool named `gpu`. Add some nodes with gpu support (e.g. g6.xlarge). Set auto-scaling min nodes to 0 and max nodes to desired number (e.g. 2). This way, when no GPU workloads are running, the cluster will scale down to zero GPU nodes, saving costs.



## Installation Steps

### Step 1: Add NVIDIA Helm Repository

```bash
# Add the NVIDIA Helm repository
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia

# Update repository information
helm repo update

# Verify repository is added
helm search repo nvidia/gpu-operator
```

### Step 2: Install GPU Operator with Garden Linux Configuration

The key to successful installation on Garden Linux is using the specialized values file that handles the Garden Linux specific requirements:

```bash
# Install GPU Operator with Garden Linux optimized values
helm upgrade --install --create-namespace -n gpu-operator gpu-operator nvidia/gpu-operator --values \
https://raw.githubusercontent.com/SAP-samples/kyma-runtime-samples/refs/heads/main/gpu/gpu-operator-values.yaml

# Wait for installation to complete
helm status gpu-operator -n gpu-operator
```

Note: the [gpu-operator-values.yaml](gpu-operator-values.yaml) file is configured for driver version 570, which is comptible with current Garden Linux kernel versions in Kyma clusters. If you need a different driver version, adjust the `driver.version` field in the values file accordingly (download the file and modify it locally before installation).


### Step 3: Monitor Installation Progress

The GPU operator will deploy several components as DaemonSets and Deployments. Monitor the installation:

```bash
# Watch all pods in gpu-operator namespace
kubectl get pods -n gpu-operator -w

# Check deployment status
kubectl get all -n gpu-operator
```


## Installation Verification

### Test GPU Workload Deployment

Deploy a simple GPU test workload to verify everything is working:

```bash
# Create test GPU workload
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: gpu-test
spec:
  containers:
  - name: gpu-test
    image: nvcr.io/nvidia/cuda:13.0.1-runtime-ubuntu24.04
    command: ["nvidia-smi"]
    resources:
      limits:
        nvidia.com/gpu: 1
  restartPolicy: Never
EOF
```

If your cluster does not have GPU resources available, the pod will remain in a pending state for a while until a GPU node is provisioned.

Once the node is up, the NVIDIA GPU Operator will deploy the device plugin DaemonSet, which will then advertise `nvidia.com/gpu` resources on that node.

Check autoscaler config to see if GPU nodes are being considered:

```bash
kubectl get configmap -n kube-system cluster-autoscaler-status -o yaml
```

Sample section from the configmap showing GPU worker pool with one node started:

```yaml
    - name: shoot--kyma--c-1f226cf-gpu-z1
      health:
        status: Healthy
        nodeCounts:
          registered:
            total: 1
            ready: 1
            notStarted: 0
          longUnregistered: 0
          unregistered: 0
        cloudProviderTarget: 1
        minSize: 0
        maxSize: 3
        lastProbeTime: "2025-12-11T14:40:54.65491129Z"
        lastTransitionTime: "2025-12-11T02:13:08.790764467Z"
      scaleUp:
        status: NoActivity
        lastProbeTime: "2025-12-11T14:40:54.65491129Z"
        lastTransitionTime: "2025-12-11T12:12:13.016415154Z"
      scaleDown:
        status: NoCandidates
        lastProbeTime: "2025-12-11T14:40:54.65491129Z"
        lastTransitionTime: "2025-12-11T13:10:13.472558018Z"
```

Observe this config map to see if the GPU worker pool is recognized and nodes are being provisioned as needed. When the GPU node is ready, the `nvidia.com/gpu` resource should be available for scheduling and the test pod should complete successfully.

You can run these commands to monitor the test pod, check logs, and clean up afterward:

```bash
# Wait for pod to complete and check output
kubectl wait --for=jsonpath='{.status.phase}'=Succeeded pod/gpu-test --timeout=300s
kubectl logs gpu-test

# Clean up test pod
kubectl delete pod gpu-test
```

### More spectacular GPU Demo - AI Image Generation

For a more impressive demonstration that showcases real GPU acceleration, deploy an AI image generation workload using fooocus and Stable Diffusion XL model

```bash
kubectl apply -f https://raw.githubusercontent.com/SAP-samples/kyma-runtime-samples/main/gpu/fooocus.yaml

```
The web UI will be exposed through APIRule and you can access it via browser using your cluster domain and fooocus subdomain, e.g. `https://fooocus.xxxxxxxx.kyma.ondemand.com/`. 

![Fooocus UI](./piglet.png)

To delete the demo app, run:

```bash
kubectl delete -f https://raw.githubusercontent.com/SAP-samples/kyma-runtime-samples/main/gpu/fooocus.yaml
```

## Cleanup

If you delete all the pods that require GPU your worker pool should be scaled down to zero nodes again, saving costs. You can chack if cluster autoscaler recognizes that there are no GPU nodes needed by checking the cluster-autoscaler-status configmap again:

```bash
kubectl get configmap -n kube-system cluster-autoscaler-status -o yaml
```

You should see candidates for scale down in the GPU worker pool section. Bear in mind that scaling down  takes 60 minutes (this is Kyma cluster default setting). 