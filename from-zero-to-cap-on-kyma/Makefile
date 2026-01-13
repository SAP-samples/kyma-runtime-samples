DOCKER_ACCOUNT?=provide-as-env-var
NAMESPACE?=provide-as-env-var
CLUSTER_DOMAIN?=provide-as-env-var

BUILDER=paketobuildpacks/builder-jammy-base:latest
BUILDPACK=paketo-buildpacks/nodejs

APP_VERSION=0.0.13
HELM_RELEASE_NAME=bookshop

HANA_DEPLOYER=bookshop-hana-deployer
HANA_DEPLOYER_IMAGE_REPO=${DOCKER_ACCOUNT}/${HANA_DEPLOYER}
HANA_DEPLOYER_IMAGE=${HANA_DEPLOYER_IMAGE_REPO}:${APP_VERSION}

CAP_SRV=bookshop-srv
CAP_SRV_IMAGE_REPO=${DOCKER_ACCOUNT}/${CAP_SRV}
CAP_SRV_IMAGE=${CAP_SRV_IMAGE_REPO}:${APP_VERSION}

APPROUTER=bookshop-approuter
APPROUTER_IMAGE_REPO=${DOCKER_ACCOUNT}/${APPROUTER}
APPROUTER_IMAGE=${APPROUTER_IMAGE_REPO}:${APP_VERSION}

init:
	cds init bookshop --add tiny-sample
	cd bookshop && \
		cds add hana,xsuaa --for production && \
		cds add approuter && \
		cd -

run-local:
	cds watch bookshop

create-namespace:
	kubectl create namespace ${NAMESPACE}

prepare-kyma-for-deployment:
	kubectl config set-context --current --namespace=${NAMESPACE}
	kubectl label namespace ${NAMESPACE} istio-injection=enabled --overwrite
	./create-docker-pull-secret.sh

add-istio-destination-rule:
	mkdir -p bookshop/chart/templates && \
		./add-destination-rule.sh > bookshop/chart/templates/destination-rule-approuter.yaml

create-helm-chart:
	cd bookshop && cds add helm && cd -

add-containerize:
	cd bookshop && \
		cds add containerize && \
		cd -

cds-build:
	cds build -in bookshop --production

cds-build-deploy: cds-build
	cd bookshop && \
		cds up -2 k8s && \
		cd -

build-hana-deployer: cds-build
	DOCKER_DEFAULT_PLATFORM=linux/amd64 pack build ${HANA_DEPLOYER} --tag ${HANA_DEPLOYER_IMAGE} \
         --path bookshop/gen/db \
         --buildpack ${BUILDPACK} \
         --builder ${BUILDER} \
         --env BP_NODE_RUN_SCRIPTS=""

push-hana-deployer:
	docker push ${HANA_DEPLOYER_IMAGE}

build-cap-srv: cds-build
	DOCKER_DEFAULT_PLATFORM=linux/amd64 pack build ${CAP_SRV} --tag ${CAP_SRV_IMAGE} \
		--path bookshop/gen/srv \
		--buildpack ${BUILDPACK} \
		--builder ${BUILDER} \
		--env BP_NODE_RUN_SCRIPTS=""

push-cap-srv:
	docker push ${CAP_SRV_IMAGE}

build-approuter: cds-build
	DOCKER_DEFAULT_PLATFORM=linux/amd64 pack build ${APPROUTER} --tag ${APPROUTER_IMAGE} \
		--path bookshop/app/router \
		--buildpack ${BUILDPACK} \
		--builder ${BUILDER} \
		--env BP_NODE_RUN_SCRIPTS=""

push-approuter:
	docker push ${APPROUTER_IMAGE}

deploy-dry-run: cds-build
	helm template ${HELM_RELEASE_NAME} ./bookshop/gen/chart \
			--namespace ${NAMESPACE} \
			--set global.image.tag=${APP_VERSION} \
			--set approuter.env.PLATFORM_COOKIE_NAME=KYMA_APP_SESSION_ID \
			--values bookshop/gen/chart/values.yaml \
			--set-file xsuaa.jsonParameters=bookshop/xs-security.json

deploy: cds-build
	helm upgrade --install ${HELM_RELEASE_NAME} ./bookshop/gen/chart \
			--namespace ${NAMESPACE} \
			--set global.image.tag=${APP_VERSION} \
			--set approuter.env.PLATFORM_COOKIE_NAME=KYMA_APP_SESSION_ID \
			--values bookshop/gen/chart/values.yaml \
			--set-file xsuaa.jsonParameters=bookshop/xs-security.json \
			--wait --wait-for-jobs

check-status:
	kubectl rollout status deployment bookshop-srv --namespace ${NAMESPACE} --timeout=8m
	kubectl rollout status deployment bookshop-approuter --namespace ${NAMESPACE} --timeout=8m

check-hana-deployer-logs:
	kubectl -n ${NAMESPACE} logs -l app.kubernetes.io/name=hana-deployer

check-cap-srv-logs:
	kubectl -n ${NAMESPACE} logs -l app.kubernetes.io/name=srv

check-approuter-logs:
	kubectl -n ${NAMESPACE} logs -l app.kubernetes.io/name=approuter

undeploy:
	helm del ${HELM_RELEASE_NAME} --namespace ${NAMESPACE} --wait

cleanup:
	kubectl delete namespace ${NAMESPACE}
	rm -rf bookshop