# Prerequisites

This file contains a collection of all prerequisites in one central place. The different sample files will reference the relevant entries in this file. The prerequisites are grouped by category and are shortly described.

Usually besides a vanilla installation of the tools depending on your OS you will find packages via the corresponding package managers (e.g. [chocolatey](https://chocolatey.org/) or [winget](https://github.com/microsoft/winget-cli) for Windows or [homebrew](https://brew.sh/) for MacOS)

## Docker

|Tool|Description
|-|-
|[Docker Desktop](https://www.docker.com/) | Tool to build and run OCI-compliant containers

>> ⚠ NOTE: Be aware of the terms of Docker for usage in enterprises. For details see [link](https://www.docker.com/blog/updating-product-subscriptions/)

## Pack

|Tool|Description
|-|-
| [Pack](https://buildpacks.io/docs/tools/pack/)| An alternate to building docker images using buildpacks without writing Dockerfiles

## Kubernetes

|Tool|Description
|-|-
|[kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) | Kubernetes command-line tool, that allows you to run commands against Kubernetes clusters
|[krew](https://krew.sigs.k8s.io/) | Plugin manager for `kubectl` command-line tool
|[kubelogin](https://github.com/int128/kubelogin) | `kubectl` plugin for Kubernetes OpenID Connect (OIDC) authentication
|[Helm](https://helm.sh/) | The package manager for Kubernetes
|[jq](https://stedolan.github.io/jq/) | Tool for JSON processing in CLI

## Kyma

Basis for all samples is the SAP BTP, Kyma runtime. Hence, you need a SAP BTP account with a Kyma instance. You find more information to get one [here](https://www.sap.com/products/business-technology-platform/trial.html).

## JavaScript/TypeScript

|Tool|Description
|-|-
|[Node.js](https://nodejs.org/en/download/) | The Node.js runtime including the node package manager NPM. Install an _LTS_ version.
|[TypeScript](https://www.typescriptlang.org/download)| The TypeScript extension of JavaScript
|[Yarn](https://yarnpkg.com/) | Alternative package manager for JavaScript

## Java

|Tool|Description
|-|-
| [maven](http://maven.apache.org/download.cgi) | Apache Maven is a software project management and comprehension tool based on the concept of a project object model (POM)
| [Gradle](https://gradle.org/) | Tool to build, automate and deliver software

The choice of Java is of course up to you, however we love to see you use [SAP Machine](https://sap.github.io/SapMachine/)

## Scala

|Tool|Description
|-|-
| [Scala](https://www.scala-lang.org/download/) | The Scala language
|[sbt](https://www.scala-sbt.org/) | Scala build tool

## Python

|Tool|Description
|-|-
|[Python](https://www.python.org/) | Python programing language
|[pip](https://pip.pypa.io/en/stable/installation/) | Package installer for Python

## .NET

|Tool|Description
|-|-
| [.NET](https://dotnet.microsoft.com/en-us/download/dotnet)| .NET is a free, cross-platform, open-source developer platform. Install an _LTS_ version.

## Go

|Tool|Description
|-|-
|[Go](https://golang.org/doc/install) | The Go language

## SAP CAP

|Tool|Description
|-|-
|[NPM CAP Package](https://www.npmjs.com/package/@sap/cds-dk) | Install the CAP package via `npm i -g @sap/cds-dk`
| [Containerize Build Tool](https://www.npmjs.com/package/ctz) | Build tool to containerize cloud applications.

## SAP UI5

|Tool|Description
|-|-
[UI5 Tooling](https://sap.github.io/ui5-tooling/) | The SAP UI5 tooling

## SAP Cloud Connector

|Tool|Description
|-|-
| [Cloud Connector](https://tools.hana.ondemand.com/#cloud) | On-premise component that is needed to integrate on-demand applications with customer backend services and is the counterpart of SAP Connectivity service.

## IDE

There is no restriction concerning the IDE or Editor you use to dig into the code. However, we make use of some [VSCode](https://code.visualstudio.com/Download)-specific features in this repository that might make your learning journey even more enjoyable.

The relevant [VSCode extensions](https://marketplace.visualstudio.com/VSCode) for each sample are collected in the corresponding [code workspaces](https://code.visualstudio.com/docs/editor/workspaces) of this repository.

## Databases

### MSSQL and Azure SQL

|Tool|Description
|-|-
|[Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)|Application to manage Azure Storage resources (both in the cloud and local emulated).
|[Azure CLI](https://docs.microsoft.com/en-us/cli/azure/what-is-azure-cli)|Command line interface used to manage Azure resources. Can be run on your local dev environment, in a deployment pipeline or in the [Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview).

## Others

### REST Clients

|Tool|Description
|-|-
|[RESTClient for VSCode](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) or [Postman](https://www.postman.com/)|An extension or  application to make HTTP requests.

### Build Tooling

|Tool|Description
|-|-
|[make](https://www.gnu.org/software/make/) | Tool which controls the generation of executables and other non-source files of a program from the program's source files.

### Microsoft Azure Account

In some samples you need access to azure services. For that you can use the Microsoft [Azure Free Trial](https://azure.microsoft.com/free/). Credit card details are only required to prohibit trial misuse. They won’t be charged till you actively switch or convert your subscription to a paid one.
