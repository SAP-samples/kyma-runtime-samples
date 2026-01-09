# customer-review-webhook

## Overview

This function is the handler for the `CustomerProductReview` webhook configured in SAP Commerce. (see [webhooks.impex](../../commerce-impex/webhooks.impex)) 

It uses the `nodejs16` function runtime and creates a `CloudEvent` from the webhook payload and places it on an internal custom event called `sap.kyma.custom.internal.product.reviewsubmitted.v1`.  

This API is protected with OAuth2 which also must be configured in SAP Commerce. 

It is configured to pull the source code directly from Git. 

[handler.js](handler.js) - Javscript source code for the webhook handler - updated for Kyma v2.10 (see [Send and Receive Cloud Events](https://kyma-project.io/external-content/serverless/docs/user/tutorials/01-90-set-asynchronous-connection.html#create-the-emitter-function))

[package.json](package.json) - Dependencies for the function

[k8s/function.yaml](k8s/function.yaml) - `Function` configuration for the handler.

[k8s/api-access.yaml](k8s/api-access.yaml) - `APIRule` to expose the function and a `OAuth2Client` to provide the OAuth2 authentication token. 

**NOTE** - Update [k8s/api-access.yaml](k8s/api-access.yaml) with the proper host name for your cluster. 

## Deploy
The [k8s](k8s) directory contains the yaml files with the `Function` and `APIRule` `OAuth2Client` and configuration. 

**NOTE** - Update [k8s/api-access.yaml](k8s/api-access.yaml) with the proper host name for your cluster. 

Apply the configuration as follows:


* Set up environment variables

  * OSX

    ```shell script
    export NS={your-namespace}
    ```

  * Windows PowerShell

    ```powershell
    $NS={your-namespace}
    ```


```
kubectl apply -n $NS -f k8s/function.yaml
kubectl apply -n $NS -f k8s/api-access.yaml
```

Retrieve `client_id` & `client_secret` from the secret created by the **OAuth2Client** `sentiment-analysis-client`.  This will be needed by the Webhook service in SAP Commerce Cloud.

```
kubectl get secret -n $NS sentiment-analysis-client --template='{{.data.client_id}}' | base64 -D
kubectl get secret -n $NS sentiment-analysis-client --template='{{.data.client_id}}' | base64 -D
```

## Verify

Call the API using the API Rule endpoint

cusrevwh-o.{your-cluster}.kyma.shoot.live.k8s-hana.ondemand.com

Send a POST request with the OData payload from Commerce.

SAP Commerce Cloud Backoffice has a **Validate Webhook Configuration** feature which makes this process very simple. See [Validating Webhook Configurations](https://help.sap.com/docs/SAP_COMMERCE/50c996852b32456c96d3161a95544cdb/4a9ca4a5e2984375bc7d0b600dc26c47.html) in SAP Commerce Cloud Help.

See [Main README.md](../../README.md) for example payload.