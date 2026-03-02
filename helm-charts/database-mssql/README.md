This chart installs the example [MSSQL Database](../database-postgres/README.md)


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

## Parameters
The following tables lists the available parameters of the chart and their default values as found in the `values.yaml`
| Parameter               | Description                         | Default value |
| ----------------------- | ----------------------------------- | ------------- |
| image.repository        | The docker image                    |               |
| image.pullPolicy        | The pullPolicy of the image         | Always        |
| image.tag               | The image version tag               | latest        |
| image.env.MSSQL_PID     | SQL Server edition selection        | Developer     |
| image.env.ACCEPT_EULA   | To confirm to the Licence terms     | Y             |
| persistence.claimName   | Name of the pvc  l                  | mssql-data    |
| persistence.accessModes | Accessmode of the pvc               | ReadWriteOnce |
| persistence.storage     | Storage amount requested by the pvc | 100Mi         |
| secret.db.user          | The database use                    | sa            |
| secret.db.password      | The database password               | Yukon900      |
| service.port            | The service port                    | 1433          |

<br/>

You can specify your own `values.yaml`

```
helm install myapp . -n default -f values.yaml
```

You can override values in the cli by specifying the value for example
```
helm install myapp . -n default --set image.repository=mydockeruser/myimage