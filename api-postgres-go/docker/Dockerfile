FROM golang:1.21 as builder

ENV GO111MODULE=on

WORKDIR /app
COPY go.mod .
COPY go.sum .

RUN go mod download

COPY cmd               ./cmd
COPY internal               ./internal

RUN ls /app/
RUN CGO_ENABLED=0 GOOS=linux go build -v -trimpath -o api-postgres-go ./cmd/api

FROM scratch
WORKDIR /app
COPY --from=builder /app/api-postgres-go /app/

EXPOSE 8000
ENTRYPOINT ["/app/api-postgres-go"]