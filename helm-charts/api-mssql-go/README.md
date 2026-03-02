This chart installs the example [api-mssql-go](../api-mssql-go/README.md) as well as it's dependency [database-postgres](../../database-postgres/README.md)


## Installing the Chart
To install the chart with the release name `myapp` in the namespace `default`:
```
helm install  myapp . -n default
```

## Uninstalling the Chart
To uninstall/delete the  `myapp` deployment in the namespace `default`:
```
helm delete  myapp -n default
```

## Update the Dependency
```
helm dependency update .
```

## Parameters
The following tables lists the available parameters of the chart and their default values as found in the `values.yaml`
| Parameter                   | Description                      | Default value               |
| --------------------------- | -------------------------------- | --------------------------- |
| image.repository            | The docker image                 |                             |
| image.pullPolicy            | The pullPolicy of the image      | Always                      |
| image.tag                   | The image version tag            | latest                      |
| configmap.database          | The name of the database         | DemoDB                      |
| configmap.host              | The database service host        | mssql.dev.svc.cluster.local |
| configmap.port              | The database port                | 1433                        |
| service.port                | The service port                 | 80                          |
| database-mssql.nameOverride | The name overide of the subchart | database-mssql              |

<br/>

You can specify your own `values.yaml`

```
helm install myapp . -n default -f values.yaml
```

You can override values in the cli by specifying the value for example
```
helm install myapp . -n default --set image.repository=mydockeruser/myimage
```