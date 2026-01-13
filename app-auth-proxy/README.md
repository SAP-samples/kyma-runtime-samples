# App Reverse Proxy with OIDC Authentication Middleware

## Overview

This sample provides a reverse proxy feature which dispatches requests to other microservices running in Kyma. It includes a middleware to handle authentication which is based on Open ID Connect and can be configured using XSUAA or SAP IAS. The authentication middleware creates a server side session which is referenced by a cookie provided to the client. It also includes a middleware to validate user scopes based on HTTP methods. By default the app will use a memory store for storing user sessions which is meant for development only. It also contains a Redis implementation for storing session which is the preferred usage. See [store-implementations](https://github.com/gorilla/sessions#store-implementations) for other options.

This sample demonstrates how to:

- Create a development Namespace in the Kyma runtime.
- Consume the SCP service XSUAA
- Deploy the following Kubernetes resources:
  - API deployment written in GO
  - API Rule
  - Service
  - Configmap
  - ServiceBinding
  - ServiceBindingUsage

## Prerequisites

- SAP BTP, Kyma runtime instance
- [Docker](https://www.docker.com/)
- [Go](https://golang.org/doc/install)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime

## Steps

### Create XSUAA Service Instance

1. Create a new `dev` Namespace:

   ```shell script
   kubectl create namespace dev
   kubectl label namespaces dev istio-injection=enabled
   ```

2. Open the file `k8s/xsuaa-instance.yaml` and adjust the value `<cluster domain>` and then apply the file

   ```shell script
   kubectl -n dev apply -f ./k8s/xsuaa-instance.yaml
   ```

   > > For a complete list of parameters visit [Application Security Descriptor Configuration Syntax](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.04/en-US/6d3ed64092f748cbac691abc5fe52985.html)

3. Once the instance is provisioned choose the menu option `Service Management -> BTP Service Bindings` within the `dev` namespace.
4. Choose the `Secret` which should display the instance secret in a dialog. Choose `Decode` to view the values. These will be needed if running the sample locally.

### Run the API locally

1. Optionally set the environment variables required to connect with the XSUAA instance which can be found in the `Secret` generated with the service instance:

   ```shell script
   export IDP_clientid='<instance clientid>'
   export IDP_clientsecret=<instance clientsecret>
   export IDP_url=<instance url>
   export IDP_xsappname=<xsappname>
   ```

2. Adjust the config.json which contains the following properties. The provided `config.json` is configured to use the examples

   - [React frontend MS SQL](../frontend-react-mssql/README.md)
     - Requires the configmap API_URL to point to `https://app-auth-proxy.<cluster domain>`

   | Property                              | Description                                                                                                                         | Remarks                                                                                                |
   | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
   | routes                                | An array of routes to be proxied                                                                                                    |                                                                                                        |
   | routes.path                           | The incoming path                                                                                                                   |                                                                                                        |
   | routes.priority                       | The priority of the path with 1 be the highest                                                                                      |                                                                                                        |
   | routes.protected                      | If the auth middleware is required on the path                                                                                      |                                                                                                        |
   | routes.remove_from_path               | If assigned, this value will be removed from routes.path before the call is proxied                                                 |                                                                                                        |
   | routes.target                         | The target of the proxied route which can be a service url                                                                          |                                                                                                        |
   | routes.http_method_scopes             | An array containing HTTP methods and thier associated user scopes                                                                   | For no restrictions this can be obmitted or assigned: http\-method: "\*", "scope": "\*"                |
   | routes.http_method_scopes.http_method | An HTTP methods for example GET                                                                                                     |                                                                                                        |
   | routes.http_method_scopes.scope       | A scope which is allowed the call the given http_method on the route path                                                           | Use $XSAPPNAME for the application name, for example using a Kyma scopes - $XSAPPNAME.runtimeDeveloper |
   | idp_config                            | Optionally set IDP config if not using a service binding                                                                            |                                                                                                        |
   | idp_config.url                        | The IDP url                                                                                                                         | If this value is not set, the environment variables will be used                                       |
   | idp_config.clientsecret               | The IDP client secret                                                                                                               |                                                                                                        |
   | idp_config.clientid                   | The IDP client ID                                                                                                                   |                                                                                                        |
   | idp_config.token_endpoint_auth_method | The htttp method used to during authentication                                                                                      | For XSUAA use client_secret_post, for SAPIAS us client_secret_basic                                    |
   | redirect_uri                          | The registered redirect_uri to be called                                                                                            |                                                                                                        |
   | debug                                 | Toggle debug on or off                                                                                                              |                                                                                                        |
   | redis_store                           | When configure app will you redis to store the sessions, otherwise a memory store is used which should only be used for evaluation. |                                                                                                        |
   | redis_store.addr                      | The service address of the Redis database                                                                                           | If this value is not set, memory storage will be used to store the session                             |
   | redis_store.password                  | The password of the Redis database                                                                                                  |                                                                                                        |
   | redis_store.db                        | The database index                                                                                                                  |                                                                                                        |
   | cookie.session_name                   | The name of the session cookie                                                                                                      |                                                                                                        |
   | cookie.max_age_seconds                | The max age of the session cookie                                                                                                   |                                                                                                        |
   | cookie.key                            | The key used to encrypt the session cookie                                                                                          |                                                                                                        |
   | cookie.httponly                       | If the cookie can be accessed with Javascript or only http                                                                          |                                                                                                        |

3. Run the application:

   ```shell script
   go run ./cmd/proxy
   ```

4. Accessible endpoints include
   - http://localhost:8000/
   - http://localhost:8000/auth/user
   - http://localhost:8000/auth/groups

### Build the Docker image

1. Build and push the image to your Docker repository:

   ```shell script
   docker build -t {your-docker-account}/app-auth-proxy -f docker/Dockerfile .
   docker push {your-docker-account}/app-auth-proxy
   ```

2. To run the image locally adjust the config.json and either set the env variables individually, or copy them from your environment:

   ```shell script
     docker run -p 8000:8000 --env-file ./env.list --mount type=bind,source=$(pwd)/config/config.json,target=/app/config/config.json -d jcawley5/app-auth-proxy:latest
     OR
     docker run -p 8000:8000 --env-file <(env | grep IDP) --mount type=bind,source=$(pwd)/config/config.json,target=/app/config/config.json -d jcawley5/app-auth-proxy:latest
   ```

### Deploy the APP

1. Create a new `dev` Namespace:

   ```shell script
   kubectl create namespace dev
   ```

2. Within `./k8s/configmap.yaml` adjust the values and then apply the ConfigMap:

   ```shell script
   kubectl -n dev apply -f ./k8s/configmap.yaml
   ```

3. Get the name of the ServiceInstance:

   ```shell script
   kubectl -n dev get serviceinstances
   ```

   For example:

   | NAME                   | CLASS                     | PLAN        | STATUS | AGE |
   | ---------------------- | ------------------------- | ----------- | ------ | --- |
   | **_xsuaa-showy-yard_** | ClusterServiceClass/xsuaa | application | Ready  | 63m |

4. Within `./k8s/deployment.yaml` adjust the value of `<Service Instance Name>` to the XSUAA service instance name and the apply the Deployment:

   ```shell script
   kubectl -n dev apply -f ./k8s/deployment.yaml
   ```

5. Apply the APIRule:

   ```shell script
   kubectl -n dev apply -f ./k8s/apirule.yaml
   ```

6. Verify that the Deployment is up and running:

   ```shell script
   kubectl -n dev get deployment app-auth-proxy
   ```

7. Use the APIRule `https://app-auth-proxy.{cluster-domain}`
