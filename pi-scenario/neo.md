This sample details two use cases; the first showing how a call originating from Process Integration can call the Kyma Runtime and the second showing how a call originating from Kyma can call Process Integration. This scenario is intended for PI running in the NEO environment.

### Prerequistes

- [Integration Tenant](https://help.sap.com/viewer/368c481cd6954bdfa5d0435479fd4eaf/Cloud/en-US/e7b1eaa2246641b3a6188233cf219ab8.html)
- [Kyma Runtime](https://developers.sap.com/tutorials/cp-kyma-getting-started.html)
- [Cloud Connector](https://tools.hana.ondemand.com/#cloud)
- [Cloud Connector Connected to BTP Subaccount](https://help.sap.com/viewer/cca91383641e40ffbe03bdc78f00f681/Cloud/en-US/ec68ee242c3d4c7797fc53bb65abcd71.html)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to use the `KUBECONFIG` file downloaded from the Kyma runtime.

## Example Local Service Setup

This example calls an integration flow which calls a locally running service connected to BTP via the Cloud Connector.

For the locally running service httpbin can be used for the example flow. Pull and run the image

```shell
docker pull kennethreitz/httpbin
docker run -p 80:80 kennethreitz/httpbin
```

which will make the service available at http://localhost/

### Connect the Cloud Connector to httpbin

Choose `Cloud To On-Premise`

#### Mapping Virtual To Internal System

- Choose the `Add` button to add a new entry
- Choose the `Back-end Type` of `Non-SAP System` and choose `Next`
- Choose `HTTP` as the `Protocol` and choose `Next`
- Enter `localhost` for the `Internal Host` and `80` for the `Internal Port` and choose `Next`
- Enter `httpbin.local` for the `Virtual Host` and `80` for the `Virtual Port` and choose `Next`
- Choose the default values for the next options and choose `Finish`

#### Resources Of httpbin.local:80

- Choose the `Add` button to add a new entry
- Enter `/` for the `URL Path`
- Choose `Path And All Sub-Paths` for the `Access Policy`
- Choose `Save`

## Kyma Setup

1. Create a new `dev` Namespace:

```shell script
kubectl create namespace dev
kubectl label namespaces dev istio-injection=enabled
```

### Calling Integration From Kyma Setup

1. Apply the Resources:

```shell script
kubectl -n dev apply -f ./k8s/cpi-scc-httpbin/function-neo.yaml
kubectl -n dev apply -f ./k8s/cpi-scc-httpbin/apirule-neo.yaml
```

2. Within the `dev` namespace choose the menu option `Workloads` -> `Functions`.
3. Open the `cpi-scc-httpbin-neo` function.
4. Under `Environment Variables` alter the `cpi_url` value to include your Integration tenant url.
5. Under `Environment Variables` alter the `user` and `password` values using a user that has the role `ESBMessaging.send`
6. Save the Changes.

### Calling Kyma From Integration Setup

1. Apply the Resources:

```shell script
kubectl -n dev apply -f ./k8s/call-kyma-api/function.yaml
kubectl -n dev apply -f ./k8s/call-kyma-api/apirule.yaml
```

2. Within the `dev` namespace choose the menu option `Configuration` -> `OAuth Clients`.
3. Choose `Create OAuth Client` and provide the values:
   1. Name: cpi-client
   2. Response types: Token
   3. Grant types: Client credentials
   4. Scope: read
4. Choose `Create`.
5. Choose the `Decode` option to view the Client Id and Client Secret values. These will be needed in the Integration Setup.

## Integration Setup

### Add Kyma Root Certificate

To setup trust between Integration and the Kyma runtime, the root certificate of Kyma will need to be added into the Integration tenant.

1. Navigate to [dst-root-ca-x3](https://www.identrust.com/dst-root-ca-x3)
2. Copy and Paste the DST Root certificate into a text file on your computer, saving it as `kyma.cer`.
3. Within the Integration tenant choose the menu option `Monitor`.
4. Choose the `Keystore` tile.
5. Choose `Add` -> `Certificate`
6. Choose `Browse` and select the save root certificate `kyma.cer`, do not provide an Alias
7. Choose `Add` and Confirm Cert

### Configure the Kyma API OAuth Credential

1. Within the Integration tenant choose the menu option `Monitor`.
2. Choose the `Security Material` tile.
3. Choose the `Create` drop down and choose `OAuth2 Client Credentials` and provide the values:
   1. Name: kyma
   2. Grant type: Client Credentials
   3. Token Service URL: `https://oauth2.<kyma cluster>/oauth2/token`
   4. Client ID: the value from the kyma oauth client
   5. Client Secret: the value from the kyma oauth client
   6. Client Authentication: Send as Request Header
   7. Include Scope: enabled
   8. Scope: read
   9. Content Type: application/x-www-form-urlencoded
4. Choose the `Deploy` option

### Configure the Integration Artifacts

1. Within the Integration tenant choose the menu option `Design`.
2. Choose the `Import` option and import the `Kyma Samples.zip` found in the cpi folder.
3. Within `Kyma Samples`, choose the Artifacts tab.
4. Choose the `call-kyma-api` artifact to open it.
5. Choose the `Configure` option and provide following values:
   1. Address: `https://cpi-api-read-oauth.<kyma cluster>`
   2. Credential Name: kyma
6. Save the changes.

## Testing the Scenarios

### Calling Integration From Kyma Setup

1. Open the `dev` namespace within the Kyma console.
2. Choose the menu option `Discovery and Network` -> `API Rules`
3. Choose the `Host` option for the `cpi-scc-httpbin-neo` entry.
4. A successful response should contain a json structure containing the data submitted in the request

```
{
   "args":{},
   "data":"{\"somedata\":\"1234\"}",
   "files":{},
   "form":{},
   "headers":{
      "Accept":"*/*",
      "Host":"httpbin.local",
      "Sap-Messageprocessinglogid"
      ...
```

### Calling Kyma From Integration Setup

#### Test the Scenario

1. These steps can be done with a tool such as Postman or using Curl as shown here.
2. Grab the Integration Flow's URL by performing the following steps:
   1. Within the Integration tenant choose the menu option `Monitor`.
   2. Go to `Manage Integration Content` -> `Started` Tile
   3. Verify that 'call-kyma-api' Integration Flow is in the started state. Copy the URL (https://`<tenant url>`/http/kyma/api) from the `Endpoints` tab.
3. Run the following command to set the values into environment variables using a user that has the role `ESBMessaging.send`:

   ```shell script
   export INTEGRATION_FLOW_URL='<integration-flow deployed iflow url>'
   export USER='<your btp user>'
   export PASSWORD='<your btp password>'
   export ENCODED_CREDENTIALS=$(echo -n "$USER:$PASSWORD" | base64)
   ```

4. Send the request to validate the scenario:

   ```shell script
   curl $INTEGRATION_FLOW_URL -H "Authorization: Basic $ENCODED_CREDENTIALS" -H "Content-Type: application/json"
   ```

   A succesfully call should respond with

   ```shell script
   [{"orderid": "00000001", "description": "First sample order", "amount": "100.00"},{"orderid": "00000002", "description": "Second sample order", "amount": "102.00"},{"orderid": "00000003", "description": "Third sample order", "amount": "402.00"}]
   ```
