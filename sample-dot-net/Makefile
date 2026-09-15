-include .env

IMAGE_NAME      = $(DOCKER_ACCOUNT)/$(APP_NAME):$(TAG)
CONTAINER_NAME  = $(APP_NAME)

.DEFAULT_GOAL := help
.PHONY: build-arm build-amd push-image dev run stop clean help

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) \
		| awk -F ':|##' '{printf "  \033[36m%-12s\033[0m %s\n", $$(NF-2), $$NF}'

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

push-image: ## Push image to Docker registry
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
