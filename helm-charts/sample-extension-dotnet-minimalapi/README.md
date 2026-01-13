# Overview

A Helm chart definition to deploy the sample .NET minimal API extension.

## Parameters

| Parameter        | Description                                | Default Value                              |
| ---------------- | ------------------------------------------ | -------------------------------------      |
| image.repository | The docker image                           | <YOUR DOCKER ID>/dotnet6minimalapi:0.0.1   |
| image.pullPolicy | The image pull policy                      | Always                                |

## To Deploy

### Prerequistes

The following prerequisites are needed:

* [Docker](../../prerequisites/README.md#docker)
* [Kubernetes](../../prerequisites/README.md#kubernetes)

### Helm install

To install the helm chart in `dotnetdev` namespace, run the following command.

You can provide the various parameters in the install command as shown below. Change to use your image.

```shell script
helm install kymaapp ../helm-charts/sample-extension-dotnet-minimalapi --set image.repository=<YOUR DOCKER ACCOUNT>/dotnet6minimalapi:0.0.1 -n dotnetdev
```

or,

provide a [values.yaml](values.yaml) with parameters configured and run the command

```shell
helm install kymaapp . -f values.yaml -n dotnetdev
```

### Cleanup

```shell
helm del kymaapp -n dotnetdev
```
