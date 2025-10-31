# This script creates a Docker pull secret for a Kubernetes cluster.
#!/bin/bash
set -e
echo -n "Your docker server: "; read YOUR_DOCKER_SERVER
echo -n "Your docker user: "; read YOUR_USER
echo -n "Your email: "; read YOUR_EMAIL
echo -n "Your API key: "; read -s YOUR_API_KEY
kubectl -n ${NAMESPACE} create secret docker-registry \
    "docker-registry" \
    "--docker-server=$YOUR_DOCKER_SERVER" \
    "--docker-username=$YOUR_USER" \
    "--docker-password=$YOUR_API_KEY" \
    "--docker-email=$YOUR_EMAIL"