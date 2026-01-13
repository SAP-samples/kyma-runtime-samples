FROM golang:1.14-alpine as builder

ENV BASE_APP_DIR=/go/src/github.com/kyma-project/examples/orders-service \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR ${BASE_APP_DIR}

COPY ./go.mod .
COPY ./go.sum .

# cache deps before building and copying source so that we don't need to re-download as much
# and so that source changes don't invalidate our downloaded layer
RUN go mod download

#
# copy files allowed in .dockerignore
#
COPY . ${BASE_APP_DIR}/

RUN go build -ldflags "-s -w" -a -o main cmd/main.go \
    && mkdir /app \
    && mv ./main /app/main

# get latest CA certs
FROM alpine:latest as certs
RUN apk --update add ca-certificates

# result container
FROM alpine:latest

LABEL source = git@github.com:kyma-project/examples.git

COPY --from=builder /app /app
COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

ENTRYPOINT ["/app/main"]
