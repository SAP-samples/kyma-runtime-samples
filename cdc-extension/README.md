# Sample SAP Customer Data Cloud Extension

## Scenario

This example includes a **Kyma serverless function**, *cdc-extension*, that is exposed as a **SAP Customer Data Cloud extension endpoint**, and demonstrates how to:

* Create an [SAP Customer Data Cloud extension](https://help.sap.com/viewer/8b8d6fffe113457094a17701f63e3d6a/GIGYA/en-US/4153ec2f70b21014bbc5a10ce4041860.html) endpoint using a [Kyma Serverless Function](https://kyma-project.io/external-content/serverless/docs/user/resources/06-10-function-cr)
* Deploy a Kyma serverless function and an API Rule using the [Kubernetes command-line tool](https://kubernetes.io/docs/reference/kubectl/overview/)
* Alternately, deploy a Kyma serverless function and an API Rule using the Kyma Console User Interface
* Explore [api.sap.com](https://api.sap.com/) and try out REST API calls using a sandbox environment
* Use the [SAP Data Quality Management microservice](https://www.sap.com/canada/products/data-quality-management.html) for location data to cleanse addresses

**Notes:**

* All the functionality presented here are subject to change and may be changed by SAP at any time for any reason without notice.
* For demonstration, this example uses an API Key to authenticate requests to SAP Data Quality Management. In a real-world scenario, either [OAuth 2.0](https://help.sap.com/viewer/d95546360fea44988eb614718ff7e959/Cloud/en-US/1fa6310be4e14ebb86c0411491bcff97.html) or [Client Certificate Authentication](https://help.sap.com/viewer/d95546360fea44988eb614718ff7e959/Cloud/en-US/7e983cce55604a8bb23a137483ea5dca.html) are to be used.

### Solution Architecture

![Solution Architecture](assets/cdc-extension-diagram.png)

#### Sequence Diagram

![Sequence Diagram](assets/cdc-extension-seq.jpg)

## Suggested introductory readings

* [What is an SAP Customer Data Cloud Extension?](https://help.sap.com/viewer/8b8d6fffe113457094a17701f63e3d6a/GIGYA/en-US/4153ec2f70b21014bbc5a10ce4041860.html)
* [An Introduction to SAP Customer Data Cloud Extensions (video)](https://microlearning.opensap.com/media/1_ucyxrfoj)
* [What is Kyma Environment?](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/468c2f3c3ca24c2c8497ef9f83154c44.html)
* [What is a Kyma Serverless Function?](https://kyma-project.io/external-content/serverless/docs/user/resources/06-10-function-cr)
* [What is a Kyma API Rule?](https://kyma-project.io/external-content/api-gateway/docs/user/custom-resources/apirule/README)
* [Project Kyma Documentation](https://kyma-project.io/)
* [Administration and Operations in the Kyma Environment](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/b8e16869e64a4abe93cc194aa6fdacf5.html)

## Pre-requisites

* Provision [SAP Data Quality Management, microservices for location data](https://www.sap.com/products/technology-platform/data-quality-management.html) and [set up an SAP Customer Data Cloud site](https://help.sap.com/viewer/8b8d6fffe113457094a17701f63e3d6a/GIGYA/en-US/41720d7370b21014bbc5a10ce4041860.html).
* [Get a Free Account on SAP BTP Trial](https://developers.sap.com/tutorials/hcp-create-trial-account.html)*
* [Enable SAP BTP, Kyma Runtime](https://developers.sap.com/tutorials/cp-kyma-getting-started.html).
* [Download and install the Kubernetes Command Line Tool](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#d81e7789-ced4-4df6-b4a0-132d8c637077).
* [Test the kubectl installation](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#4709f3b9-b9bc-45f1-89c1-cd6f097c55f5).
* [Download the Kyma Runtime kubeconfig](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#2ef10816-b759-4080-a8ec-eadbc3317ebd).
* Create your [api.sap.com](https://api.sap.com/) account.

## Deployment steps

1. Go to the [kyma-runtime-extension-samples](https://github.com/SAP-samples/kyma-runtime-extension-samples) repository and clone it. This repository contains a collection of Kyma sample applications including this example (in the **cdc-extension** subfolder). Download the code by choosing the green Code button, and then choosing one of the options to download the code locally. Alternately, you can also run the following command using your command-line interface within your desired folder location:

    ```shell
    git clone https://github.com/SAP-samples/kyma-runtime-extension-samples`
    ```

    >> **Note:** The source code of this example is in the [cdc-extension](https://github.com/SAP-samples/kyma-runtime-extension-samples/tree/main/cdc-extension) subfolder of this repository.

2. Update the values of the following environment variables in the **./kyma-runtime-extension-samples/cdc-extension/k8s/function.yaml** file: `CDC_API_KEY`, `SAP_API_HUB_API_KEY`, `PUBLIC_KEY_KID`, `PUBLIC_KEY_N` and `PUBLIC_KEY_E`

    * `CDC_API_KEY` - This is the API Key of the SAP Customer Data Cloud site and can be got from the [SAP Customer Data Cloud console](https://console.gigya.com/).
    * `SAP_API_HUB_API_KEY` - This is the API Key of SAP API Business Hub. Login to [api.sap.com](https://api.sap.com/). Then, go to your profile settings and click on **Show API Key** to get the value for this variable.

    Go to "https://accounts.`SAP_Customer_Data_Cloud_Data_Center`/accounts.getJWTPublicKey?apiKey=`Your_SAP_Customer_Data_Cloud_Site_API_Key`".

    [Find your SAP Customer Data Cloud Data Center](https://help.sap.com/viewer/8b8d6fffe113457094a17701f63e3d6a/GIGYA/en-US/41573b6370b21014bbc5a10ce4041860.html). Replace **SAP_Customer_Data_Cloud_Data_Center** with your Data Center (For example, the US Data Center is **us1.gigya.com**). Replace **Your_SAP_Customer_Data_Cloud_Site_API_Key** with your SAP Customer Data Cloud site's API Key.

    The response JSON body will also include the following fields: **kid**, **n** and **e**

    * `PUBLIC_KEY_KID` - This is the value of the **kid** field in the response above.
    * `PUBLIC_KEY_N` - This is the value of the **n** field in the response above.
    * `PUBLIC_KEY_E` - This is the value of the **e** field in the response above.

3. Create a Kubernetes namespace with the name `cdc`.

    ```shell
    kubectl create namespace cdc`
    ```

    > **Note:** As a prerequisite, please follow the steps listed in the following tutorial: [Download the Kyma Runtime kubeconfig](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#2ef10816-b759-4080-a8ec-eadbc3317ebd)

    **Alternately, use the Kyma Console User Interface to create a new namespace**

    * Open the Kyma console and click on **Add new namespace**. Enter its name as **cdc** and click the **Create** button.

4. Create/update Kubernetes resources of the **cdc-extension serverless function**.

    ```shell
    kubectl apply -f ./kyma-runtime-extension-samples/cdc-extension/k8s/function.yaml
    kubectl apply -f ./kyma-runtime-extension-samples/cdc-extension/k8s/api-rule.yaml
    ```

    >> **Note:** As a prerequisite, please follow the steps listed in the following tutorial: [Download the Kyma Runtime kubeconfig](https://developers.sap.com/tutorials/cp-kyma-download-cli.html#2ef10816-b759-4080-a8ec-eadbc3317ebd)

    >> The resources are represented as declarative YAML objects. Applying the resources will perfom the following steps:

    * Deploy the Kyma serverless function
    * Expose the serverless function using a Kyma API Rule that will serve as the SAP Customer Data Cloud Extension endpoint

    **Alternately, deploy the Kyma serverless function and API Rule using the Kyma Console User Interface:**

    * Open the Kyma console and select the **cdc** namespace.
    * Click on **Workloads**. Then, click on **Deploy new workload** and select **Upload YAML**.
    * Then, click on **Browse** to select the following YAML file, and click on **Deploy**: **./kyma-runtime-extension-samples/cdc-extension/k8s/function.yaml**
    * Repeat the above steps and select the following YAML file. Then, click on **Deploy**: **./kyma-runtime-extension-samples/cdc-extension/k8s/api-rule.yaml**

5. Go to the Kyma Console -> **cdc** namespace -> **Discovery & Network** -> **API Rules**. Copy the **host** URL of the cdc-extension API Rule. 

6. Then, go to the [SAP Customer Data Cloud Console](https://console.gigya.com/). Select your site and click on **Extensions** -> **Add**. 

7. Enter any Name, select the API as **accounts.setAccountInfo** (OnBeforeSetAccountInfo), enter any **Description**, paste the **host** URL from step 5 above and click on **Advanced**. Then, enter the **Timeout** as 1000 ms, select the **Fallback Policy** as **FailOnAnyError** and click **Save**.

8. In the SAP Customer Data Cloud Console, select your site and click on **Schema** in the left menu under **Registration-as-a-Service**.

9. Set the following schema fields to be **Required** and select **Write Access** as **clientModify** for all of them. Then, click **Save Changes**.

    * profile.address
    * profile.city
    * profile.state
    * profile.zip
    * profile.country

10. In the [SAP Customer Data Cloud Console](https://console.gigya.com/), select your site and click on **Screen-Sets** in the left menu under **Registration-as-a-Service**.

11. Click on the **Default-RegistrationLogin** screen-set.

12. Select the **Registration Completion** screen from the dropdown.

13. Add four Textbox components and one Dropdown component to the SAP Customer Data Cloud **Registration Completion** screen and map them to the following fields.

    * profile.address
    * profile.city
    * profile.state
    * profile.zip
    * profile.country

## Steps to test the solution

1. Register an account in your SAP Customer Data Cloud site. 

    >> **Note:** This can also be done by previewing the registration screen of the **Default-RegistrationLogin** screen-set in the [SAP Customer Data Cloud console](https://console.gigya.com/).

2. The **Registration Completion** screen will be displayed. Enter an invalid address and click the Submit button. An error message will be returned.

3. Fix the address and click the **Submit** button. The form should be processed successfully.

4. View the details of the account that was registered in the **Identity Access** screen of the SAP Customer Data Cloud console. It can be observed that the address of the user has been cleansed.

## Troubleshooting steps

### Check the logs of your Kubernetes pods

* To see the logs of a specific function, open the function in the Kyma console (Go to **Workloads** > **Functions** > **cdc-extension**) and you will see the logs in an expandable window at the bottom of the page.
* Alternately, go to **Workloads** > **Pods** in the Kyma Console (within the cdc namespace) to see the list of all running pods. Then, click on the three dots to the right of the running pod of the cdc-extension function, and click on Show Logs to see the logs of the pod.
* Or use the following `kubectl` to get the list of pods running in the cdc namespace.

    ```shell
    kubectl get pods -n cdc
    ```

* Then, to see the logs of any of the pods, use the following syntax:

    ```shell
    kubectl logs <pod-name> -n <namespace-name>
    ```

    Example:
    
    ```shell
    kubectl logs cdc-extension-65khj-58b6d69cd9-l7dgs -n cdc
    ```
