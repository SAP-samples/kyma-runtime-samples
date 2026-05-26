RELEASE?=0.0.25
APP?=sample-extension-java
DOCKER_ACCOUNT?=gauravsap
CONTAINER_IMAGE?=${DOCKER_ACCOUNT}/${APP}:${RELEASE}
NAMESPACE?=dev

.PHONY: build build-image clean push-image all

all: clean build build-image push-image

clean:
	./gradlew clean
build:
	./gradlew -Pversion=$(RELEASE) -Pname=$(APP) clean build

build-image-using-pack: clean build
	pack build $(APP) --tag $(CONTAINER_IMAGE) \
		--path . \
		--builder paketobuildpacks/builder-jammy-tiny \
		--env BP_JVM_VERSION=17

build-image-using-docker: clean build
	cp build/libs/$(APP)-$(RELEASE).jar docker
	docker build -t $(CONTAINER_IMAGE) --no-cache --rm docker
	rm docker/$(APP)-*.jar

push-image:
	docker push $(CONTAINER_IMAGE)

update-gradle-version:
	./gradlew wrapper --gradle-version $(version)