-include .env

IMAGE_NAME      = $(DOCKER_ACCOUNT)/$(APP_NAME):$(TAG)
CONTAINER_NAME  = $(APP_NAME)
HELM_CHART      = helm/sample-dot-net

JWT_ENABLED  ?= false
JWT_ISSUER   ?=
JWT_JWKS_URI ?=

.DEFAULT_GOAL := help
.PHONY: build-arm build-amd push-image dev run stop clean create-namespace create-registry-secret helm-template helm-dry-run helm-deploy helm-undeploy help

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) \
		| awk -F ':|##' '{printf "  \033[36m%-16s\033[0m %s\n", $$(NF-2), $$NF}'

build-arm: ## Build image on macOS/ARM — uses builder native platform (linux/amd64 via Rosetta)
	pack build $(APP_NAME) \
		--tag $(IMAGE_NAME) \
		--builder $(BUILDER) \
		--path $(APP_DIR)

build-amd: ## Build image for Linux/AMD64 (linux/amd64)
	pack build $(APP_NAME) \
		--tag $(IMAGE_NAME) \
		--builder $(BUILDER) \
		--path $(APP_DIR) \
		--platform linux/amd64

dev: ## Run the app locally with dotnet CLI (no Docker)
	cd $(APP_DIR) && dotnet run

push-image: build-amd ## Push image to Docker registry
	docker push $(IMAGE_NAME)

run: ## Run the container locally on host port 5085
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(HOST_PORT):$(CONTAINER_PORT) \
		$(IMAGE_NAME)

stop: ## Stop the running container
	docker stop $(CONTAINER_NAME)

clean: ## Remove the container (stop if running)
	docker stop $(CONTAINER_NAME) 2>/dev/null || true
	docker rm   $(CONTAINER_NAME) 2>/dev/null || true

create-namespace: ## Create namespace and enable Istio sidecar injection
	kubectl create namespace $(NAMESPACE) --dry-run=client -o yaml | kubectl apply -f -
	kubectl label namespace $(NAMESPACE) istio-injection=enabled --overwrite

create-registry-secret: ## Create image pull secret for the private registry
	kubectl create secret docker-registry $(REGISTRY_SECRET) \
		--namespace $(NAMESPACE) \
		--docker-server=https://index.docker.io/v1/ \
		--docker-username=$(DOCKER_ACCOUNT) \
		--docker-password=$(DOCKER_PASSWORD) \
		--docker-email=$(DOCKER_EMAIL) \
		--dry-run=client -o yaml | kubectl apply -f -

helm-template: ## Render helm templates locally (dry run, no cluster needed)
	helm template $(HELM_RELEASE) $(HELM_CHART) \
		--namespace $(NAMESPACE) \
		--set image.repository=$(IMAGE_NAME) \
		--set imagePullSecrets[0].name=$(REGISTRY_SECRET) \
		--set apirule.jwt.enabled=$(JWT_ENABLED) \
		--set "apirule.jwt.authentications[0].issuer=$(JWT_ISSUER)" \
		--set "apirule.jwt.authentications[0].jwksUri=$(JWT_JWKS_URI)"

helm-dry-run: ## Simulate helm install against the cluster (server-side dry run)
	helm upgrade --install $(HELM_RELEASE) $(HELM_CHART) \
		--namespace $(NAMESPACE) \
		--set image.repository=$(IMAGE_NAME) \
		--set imagePullSecrets[0].name=$(REGISTRY_SECRET) \
		--set apirule.jwt.enabled=$(JWT_ENABLED) \
		--set "apirule.jwt.authentications[0].issuer=$(JWT_ISSUER)" \
		--set "apirule.jwt.authentications[0].jwksUri=$(JWT_JWKS_URI)" \
		--dry-run=server --debug

helm-deploy: ## Deploy app to Kyma via Helm
	helm upgrade --install $(HELM_RELEASE) $(HELM_CHART) \
		--namespace $(NAMESPACE) \
		--set image.repository=$(IMAGE_NAME) \
		--set imagePullSecrets[0].name=$(REGISTRY_SECRET) \
		--set apirule.jwt.enabled=$(JWT_ENABLED) \
		--set "apirule.jwt.authentications[0].issuer=$(JWT_ISSUER)" \
		--set "apirule.jwt.authentications[0].jwksUri=$(JWT_JWKS_URI)" \
		--wait

helm-undeploy: ## Remove Helm release from the cluster
	helm uninstall $(HELM_RELEASE) --namespace $(NAMESPACE) --wait
