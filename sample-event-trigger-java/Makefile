RELEASE=0.0.4
APP=sample-event-trigger-java
DOCKER_ACCOUNT?=TBD
CONTAINER_IMAGE=${DOCKER_ACCOUNT}/${APP}:${RELEASE}

.PHONY: build build-image clean push-image

all: clean build build-image push-image

clean:
	./gradlew clean
build:
	./gradlew -Pversion=$(RELEASE) -Pname=$(APP) clean build

build-image: clean build
	cp build/libs/$(APP)-$(RELEASE).jar docker
	docker build -t $(CONTAINER_IMAGE) --no-cache --rm docker
	rm docker/$(APP)-*.jar

push-image: build-image
	docker push $(CONTAINER_IMAGE)