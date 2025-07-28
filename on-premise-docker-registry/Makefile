NAMESPACE?=specified-as-env-var
CLUSTER_DOMAIN?=specified-as-env-var
REG_USER_NAME?=specified-as-env-var
REG_USER_PASSWD?=specified-as-env-var
EMAIL?=specified-as-env-var

DOCKER_REG_CONTAINER_NAME=on-prem-docker-registry
DOCKER_REG_PORT=25002
DOCKER_REG_HOST=myregistry.kyma
TAG:=$(shell date +%F-%H-%M)
IMAGE_NAME:=${DOCKER_REG_HOST}:${DOCKER_REG_PORT}/on-prem-nginx:$(TAG)
CWD:=$(shell pwd)

generate-self-signed-cert:
	mkdir -p certs
	openssl req \
  		-newkey rsa:4096 -nodes -sha256 -keyout certs/domain.key \
  		-addext "subjectAltName = DNS:myregistry.kyma" \
  		-x509 -days 365 -out certs/domain.crt

trust-self-signed-cert:
	security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain certs/domain.crt

generate-htpasswd:
	mkdir -p secret
	htpasswd -Bbn ${REG_USER_NAME} ${REG_USER_PASSWD} > ./secret/htpasswd

start-docker-registry:
	docker run -d \
		-v docker-reg-vol:/var/lib/registry \
		-v $(CWD)/certs:/certs \
		-v $(CWD)/config/config.yml:/etc/docker/registry/config.yml \
		-v $(CWD)/secret/htpasswd:/secret/htpasswd \
		-p ${DOCKER_REG_PORT}:443 \
		--restart=always \
		--name ${DOCKER_REG_CONTAINER_NAME} \
		registry:2.8.2

stop-docker-registry:
	docker stop ${DOCKER_REG_CONTAINER_NAME}
	docker rm ${DOCKER_REG_CONTAINER_NAME}

deploy-nginx-reverse-proxy:
	kubectl -n ${NAMESPACE} apply -f k8s/

check-nginx-reverse-proxy:
	kubectl -n ${NAMESPACE} get po -l app=nginx

follow-nginx-reverse-proxy-logs:
	kubectl -n ${NAMESPACE} logs -l app=nginx -c nginx -f

follow-docker-registry-logs:
	docker logs ${DOCKER_REG_CONTAINER_NAME} -f

docker-login:
	docker login ${DOCKER_REG_HOST}:${DOCKER_REG_PORT} -u ${REG_USER_NAME} -p ${REG_USER_PASSWD}

create-test-image:
	docker build --no-cache --platform=linux/amd64 -t ${IMAGE_NAME} .
	docker push --tls-verify=false ${IMAGE_NAME}

create-secret-to-pull-image:
	kubectl -n ${NAMESPACE} create secret docker-registry on-premise-reg \
      --docker-username=${REG_USER_NAME} \
      --docker-password=${REG_USER_PASSWD} \
      --docker-email=${EMAIL} \
      --docker-server=localhost:${NGINX_NODE_PORT}

deploy-test-workload:
	kubectl -n ${NAMESPACE} apply -f test-image-deployment

check-test-workload:
	kubectl -n ${NAMESPACE} get po -l app=test-workload-on-prem-reg

access-test-workload:
	open https://test-workload-on-prem-reg.${CLUSTER_DOMAIN}

remove-test-workload:
	kubectl -n ${NAMESPACE} delete -f test-image-deployment/

remove-nginx-proxy:
	kubectl -n ${NAMESPACE} delete -f k8s/

cleanup: remove-test-workload remove-nginx-proxy stop-docker-registry
