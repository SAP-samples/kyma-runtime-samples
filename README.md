# SAP BTP, Kyma Runtime samples

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/kyma-runtime-extension-samples)](https://api.reuse.software/info/github.com/SAP-samples/kyma-runtime-extension-samples)

This project contains sample applications for building extensions using lambdas and microservices on [SAP BTP, Kyma runtime](https://blogs.sap.com/2020/05/12/get-a-fully-managed-runtime-based-on-kyma-and-kubernetes/).

The samples are implemented in multiple languages and demonstrate various Kyma runtime features and use case scenarios. Developers should be able to refer to these samples and implement their own business scenarios.

![kyma-runtime](assets/kyma-runtime-cockpit.png)

## Requirements

Running various samples requires access to the Kyma runtime. There are also other sample-specific requirements that you can find in the _Prerequisites_ section of each sample. An overview of prerequisites is available in the [prerequisites](prerequisites/README.md) directory.

## Samples

🚀 Jumpstart your Kyma journey by using these samples to build event and api based extensions in your favorite technology. We have grouped the samples focusing on their content "center of gravity". But maybe there is more in there, so it is always worth to take a look at all of them 😎

> > In case you are using [Visual Studio Code](https://code.visualstudio.com/) you can open each of the samples as a dedicated workspace. You find the corresponding file in the [workspaces](workspaces) directory

### SAP TechEd

| Year | Repository                                                                                               | Description                                                                                                       | References                                                                                                          |
| ---- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 2021 | [DEV261 - Build Extensions with SAP BTP, Kyma Runtime](https://github.com/SAP-samples/teched2021-DEV261) | This is a full setup including many other SAP BTP Services and a CI/CD setup with the respective SAP BTP service. | Recording no longer available |

## Sample Extensions

| Name                                                                                                                           | Description                                                                                                                                                           | References |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| [Java-based extension with API exposed via Microgateway](./sample-extension-java/README.md)                                    | This sample demonstrates how to build and deploy a Java-based microservice as an extension and expose the API                                                         | -          |
| [Java-based microservice as an Event Trigger using CloudEvents SDK](./sample-event-trigger-java/README.md)                     | This sample demonstrates how to build and deploy a Java-based microservice as an Event Trigger using the CloudEvents SDK                                              | -          |
| [Scala AKKA HTTP based extesnsion with API exposed via Microgateway](./sample-extension-scala/README.md)                       | This sample demonstrates how to build and deploy a Scala Based Akka-HTTP microservice as an extension and expose the API                                              | -          |
| [Sample deploying a websocket based extension on Kyma](./sample-websockets/README.md)                                          | This sample demonstrates using websockets with Kyma when building extensions and applications                                                                         | -          |
| [ASP.NET-based extension with API exposed via Microgateway](./sample-extension-dotnet/README.md)                               | This sample demonstrates how to build and deploy an ASP.NET-based microservice as an extension and expose the API                                                     | -          |
| [ASP.NET-based (.NET 6.0) extension with Minimal API exposed via Microgateway](./sample-extension-dotnet-minimalapi/README.md) | This sample demonstrates how to build and deploy an ASP.NET Core-based microservice as an extension leveraging the minimal web API functionality and exposing the API | -          |

## CX Extensions

| Name                                                                     | Description                                                                                                                         | Blog Post                                                                                                                                                            |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [C4C UI extensibility](./c4c-customization/README.md)                    | This sample shows a Cloud for Customer extension including an Angular UI                                                            | -                                                                                                                                                                    |
| [Sample SAP Customer Data Cloud Extension](./cdc-extension/README.md)    | This example includes a Kyma serverless function as cdc-extension exposed as an SAP Customer Data Cloud Extension endpoint          | [Post](https://blogs.sap.com/2021/11/10/deploying-an-sap-customer-data-cloud-extension-to-sap-btp-kyma-runtime/)                                                     |
| [Sample SAP Customer Data Cloud Webhook](./cdc-webhook/README.md)        | This example includes a Kyma serverless function as cdc-subscription-webhook exposed as an SAP Customer Data Cloud Webhook endpoint | -                                                                                                                                                                    |
| [Sample SAP Customer Data Platform Extension](./cdp-extension/README.md) | This example includes a Kyma Serverless Function as cdp-extension exposed as an SAP Customer Data Platform Extension endpoint       | [Post](https://blogs.sap.com/2021/11/24/enrich-contact-data-on-sap-customer-data-platform-with-master-data-from-sap-s-4hana-cloud-using-a-kyma-serverless-function/) |
| [SAP Sales Cloud address completion](./address-completion-c4c/README.md) | Corrects the address for an account update or create in SAP Sales Cloud                                                             | -                                                                                                                                                                    |
| [Product Review Sentiment Analysis with SAP Commerce Cloud](./sentiment-analysis/README.md) | Automated sentiment analysis and content moderation for customer product reviews in SAP Commerce Cloud | -                                                                                                                                                    |
| [Order Validation with SAP Commerce Cloud](./order-validation/README.md) | Automated order validation with external fraud check service running SAP BTP, Kyma runtime  |

## S/4HANA Extensions

| Name                                                                              | Description                                                                                                                      | References |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| [S/4HANA Nodejs SAP Cloud SDK Example](./s4hana-materialstock-function/README.md) | This sample provides a Serverless Function configured to call the Material Stock API provided by S/4HANA using the SAP Cloud SDK | -          |

## Frontend Samples

| Name                                                      | Description                                                                                  | References                                                                       |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [React frontend MS SQL](./frontend-react-mssql/README.md) | This sample provides a frontend React UI application configured with the sample `Order` APIs | -                                                                                |
| [UI5 frontend MS SQL](./frontend-ui5-mssql/README.md)     | This sample provides a frontend SAPUI5 application configured with the sample `Order` APIs   | - |

## CAP

| Name                                                                 | Description                                                                                                                                                                                 | References                                                        |
|----------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| [From Zero to CAP on Kyma](./from-zero-to-cap-on-kyma/README.md)     | Starting from scratch build a CAP application and deploy it to Kyma runtime                                                                                                                 |                                                                   |

## SAP Cloud SDK

| Name                                                                                                     | Description                                                                                                                       | References                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [SAP Cloud SDK Java Client Certificate Authentication](./cloudsdk-client-cert-auth/README.md)            | This sample show how to connect to an external system secured with Client Certificate Authentication using SAP Cloud SDK          | [Post](https://blogs.sap.com/2022/01/11/use-sap-cloud-sdk-on-kyma-runtime-to-connect-to-external-systems-with-client-cert-authentication/) |

## Utilities

| Name                                                                 | Description                                                                                     | References |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| [Secret from CF Service Key](./secret-from-cf-service-key/README.md) | This sample shows how to create a Kubernetes secret from a Cloud Foundry service key  | -          |
| [Get Egress IPs of a Kyma Cluster](./get-egress-ips/README.md) | This sample shows how to retrieve egress IPs of a Kyma cluster | -    |

## SAP HANA Cloud

| Name                                                                           | Description                                                                         | References |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ---------- |
| [HANA Cloud NodeJS API](./hana-nodejs/README.md)                               | This sample demonstrates how SAP HANA Cloud can be utilized within the Kyma runtime | -          |
| [GeoServer for a geospatial middleware over HANA Cloud](./geoserver/README.md) | This sample provides a GeoServerinstance with the plugin for SAP HANA Connectivity  | -          |

## Advanced scenarios

| Name                                                                                                                          | Description                                                                                                                              | References                                                                                                                                             |
|-------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Connectivity: Accessing a Workload in SAP BTP, Kyma Runtime From the Corporate Network](./on-prem-to-cloud/README.md)                                                                        | This sample shows how to access a workload in Kyma from the corporate network using SAP BTP, Connectivity.                                        |                                                                            |
| [Redis and Kyma Functions](./redis-function/README.md)                                                                        | This sample provides a Redis deployment and two serverless functions that interact with it                                               | [Tutorial](https://developers.sap.com/tutorials/cp-kyma-redis-function.html)                                                                           |
| [Cloud Integration Multi-cloud](./pi-scenario/README.md)                                                                      | This sample details how to bi-directionally connect SAP Process Integration and Kyma                                                     | -                                                                                                                                                      |
| [Cloud Integration Neo](./pi-scenario/README-neo.md)                                                                          | This sample details how to bi-directionally connect SAP Process Integration and Kyma in NEO                                              | -                                                                                                                                                      |
| [gRPC Python](./grpc-python/README.md)                                                                                        | This sample demonstrates gRPC connectivity                                                                                               | -                                                                                                                                                      |
| [Next.js app with Kyma eventing & Go backend connected to SAP HANA Cloud database](./nextjs-app-with-kyma-eventing/README.md) | This sample provides a tutorial for a conference registration app using Next.js                                                          | [Post](https://blogs.sap.com/2022/02/24/going-jamstack-with-kyma-runtime-building-a-high-performance-web-app/)                                         |
| [Data Backup and Restore](./data-backup-and-restore/README.md)                                                                | This sample demonstrates performing a backup and restore for a stateful application where data is stored using Persistence Volume Claim. | -                                                                                                                                                      |
| [HandsOn DSAG Technology Days 2022](./dsagtt22/)                                                                              | This sample gives a walk-through setting up a scenario combining on prem systems with Kyma Functions and the Event Mesh                  | -                                                                                                                                                      |
| [Query LDAP Users on on-premise](./sample-ldap/README.md)                                                                     | This sample queries the LDAP users from an on premise LDAP Server via SAP Connectivity proxy                                             | -                                                                                                                                                      |
| [Deploy Highly Available Workloads](./multi-zone-ha-deployment/README.md)                                                     | This sample demonstrates deploying highly available workloads in Kyma runtime                                                            | -                                                                                                                                                      |
| [Power of serverless with SAP BTP, Kyma runtime.](./kyma-serverless/README.md)                                                | This sample demonstrates how to leverage latest features of kyma functions with SAP HANA Cloud and SAP libraries                         | [Post](https://blogs.sap.com/2023/02/06/power-of-serverless-with-sap-btp-kyma-runtime.-secrets-mounted-as-volumes./)                                   |
| [Using the on-premise Docker registry with Kyma runtime](./on-premise-docker-registry/README.md)                              | This sample demonstrates how to pull images from the on-premise Docker registry for applications deployed on Kyma runtime                | -                                                                                                                                                      |
| [KEDA Cron based scaler](./keda-cron-scaler/README.md)                                                                        | This sample demonstrates how to leverage KEDA Cron scaler for efficient scaling strategies.                                              | -                                                                                                                                                      |
| [SAP Cloud Logging](./sap-cloud-logging/README.md)                                                                        | This sample explains how to integrate SAP Cloud Loghing with Kyma runtime and ship logs, metrics and traces.                                              | -                                                                                                                                                      |

## Authentication and Authorization

| Name                                                                                                              | Description                                                                                                                                   | References |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| [Sample to extend SAP Cloud for Customer with user propagation](./user-propagation/README.md)                     | This sample provides details on how a user propagation flow can be achieved when extending SAP Cloud for Customer(C4C) via IAS                | -          |
| [Sample to extend SAP Cloud for Customer with user propagation via XSUAA](./user-propagation-via-xsuaa/README.md) | This sample demonstrates how a user propagation flow can be achieved when extending SAP Cloud for Customer(C4C) via XSUAA                     | -          |
| [App Reverse Proxy with OIDC Authentication Middleware](./app-auth-proxy/README.md)                               | This sample provides a reverse proxy feature which dispatches requests to other microservice running in Kyma                                  | -          |
| [Standalone approuter on SAP BTP, Kyma runtime](./standalone-approuter/README.md)                                 | This Sample demonstrates deploying a standalone app router on Kyma runtime and use it to securely expose microservices and functions          | -          |
| [Principal Propagation to on premise](./principal-prop-on-prem/README.md)                                         | This sample provides details on how a principal propagation flow can be achieved when extending an on-prem system using SAP BTP, Kyma runtime | -          |
| [Configure Auth0 as IDP for Kyma access](./kyma-access-auth0-as-idp/)                                             | This sample provide details on how Auth0 can be configured as an Identity Provider for accessing Kyma runtime                                 | -          |

## Updates on SAP BTP, Kyma runtime based on Open Source Kyma 2.0

An overview blog post about updates on SAP BTP, Kyma runtime based on Open Source Kyma 2.0 is available here: [A long-awaited update for Kyma runtime](https://blogs.sap.com/2022/02/23/a-long-awaited-update-for-kyma-runtime/)

| Name                                                                            | Description                                                                        | References                                                                              |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [In-Cluster Events](./in-cluster-events/README.md)                              | Sample that walks you through how to set up and test the in-cluster eventing       | [Post](https://blogs.sap.com/2022/02/24/eventing-whats-new-in-kyma-2.0/)                |
| [Installing a custom component](./custom-component-dapr/README.md)              | Sample that installs and uses [Dapr](https://dapr.io/) as Custom Component on Kyma | -                                                                                       |
| [Extending on-premise systems via Kyma runtime](./connectivity-proxy/README.md) | Sample that walks you through how to connect an on premise system                  | [Post](https://blogs.sap.com/2022/02/24/extending-on-premise-systems-via-kyma-runtime/) |
| [Hands-on for DSAG Technlology Days 2022](./dsagtt22/README.md)                 | Hands-on which combines an event-based setup with on-premise connectivity          |                                                                                         |

## Helm Charts

It is also possible to deploy some of the samples as a helm chart and template your Kyma extensions. You find more details in the [Helm Chart Examples](./helm-charts/README.md) file.

## Resources

There are also further resources that allow you to dive into the topic of Kyma:

- [SAP Developer Center - Kyma Missions and Tutorials](https://developers.sap.com/tutorial-navigator.html?tag=software-product%3Atechnology-platform%2Fsap-business-technology-platform%2Fsap-btp-kyma-runtime)
- [Discovery Center - Kyma Missions](https://discovery-center.cloud.sap/missionssearch/Kyma/)

## How to get in touch with us?

If you want to get in touch with us here you go:

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kyma-project)

[![Twitter](https://img.shields.io/twitter/url?label=@kymaproject&style=social&url=https://twitter.com/kymaproject)](https://twitter.com/kymaproject) <!-- markdown-link-check-disable-line -->

## Known issues

The samples are provided on the "as-is" basis. Currently, there are no known issues for the sample projects.

## Get support

The samples are provided "as-is". There is no guarantee that raised issues will be answered or addressed in future releases. For more information, visit [SAP Community](https://community.sap.com/), especially our [Kyma topic page](https://community.sap.com/topics/kyma) and [ask a question](https://answers.sap.com/questions/ask.html?primaryTagId=73554900100800003012), or contact your SAP contact to get support. In case you observe any defect in the product usage itself, kindly use the SAP Product Support channel and raise an incident adequately for the defects observed.

## Contributing

Please refer to the [contrubuting guidelines](./CONTRIBUTING.md)

## Code of Conduct

Please note, that we have a [code of conduct](https://github.com/SAP-samples/.github/blob/main/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## License

Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
