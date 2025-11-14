# Lambdas

This directory contains the `Functions` for processing events from SAP Commerce Cloud and performing sentiment analysis and updating downstream systems such as SAP Service Cloud and Slack

Each function contains a handler file and a dependencies file depending on the Function runtime selected (Node or Python).

Each function also contains a `k8s` directory that contains the `Function` deployment file and either an `APIRule` or `Subscription` depending on if it is a syncronous or asyncronous process.

The functions are configured to be pulled directly from Git.  A `Secret` named `git-creds-basic` and a `GitRepository` resource must be provided in the namespace.  See the [Kyma documentation](https://kyma-project.io/external-content/serverless/docs/user/tutorials/01-11-create-git-function) for details.