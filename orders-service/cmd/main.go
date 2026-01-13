package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"github.com/kyma-project/examples/orders-service/internal/handler"
	"github.com/kyma-project/examples/orders-service/internal/service"
	"github.com/kyma-project/examples/orders-service/internal/store"
)

const (
	timeout = 15 * time.Second
)

func main() {
	storage := createStorage()
	orderSvc := service.NewOrders(storage)

	r := mux.NewRouter()
	r.Use(logRequest)

	order := handler.NewOrder(orderSvc)
	order.RegisterAll("/orders", r)

	webhook := handler.NewWebhook(orderSvc)
	webhook.RegisterAll("/", r)

	log.Println("List of registered endpoints:")
	err := printEndpoints(r)
	if err != nil {
		log.Fatalf("Cannot print registered routes, because: %v", err)
	}

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	srv := http.Server{
		Addr:         fmt.Sprintf(":%s", port),
		Handler:      cors.AllowAll().Handler(r),
		ReadTimeout:  timeout,
		WriteTimeout: timeout,
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Println(err)
		}
	}()

	log.Println(fmt.Sprintf("Listening on %s", srv.Addr))
	onShutdown(srv, timeout)
}

func createStorage() store.Store {
	storage := createRedisStorage()
	if storage != nil {
		return storage
	}
	return store.NewMemory()
}

func createRedisStorage() store.Store {
	redisPrefix := os.Getenv("APP_REDIS_PREFIX")
	if redisPrefix == "" {
		redisPrefix = "REDIS_"
	}

	host := os.Getenv(fmt.Sprintf("%sHOST", redisPrefix))
	port := os.Getenv(fmt.Sprintf("%sPORT", redisPrefix))
	password := os.Getenv(fmt.Sprintf("%sREDIS_PASSWORD", redisPrefix))

	if host != "" && port != "" && password != "" {
		redisClient := redis.NewClient(&redis.Options{
			Addr:     fmt.Sprintf("%s:%s", host, port),
			Password: password,
		})
		log.Println(redisClient)
		return store.NewRedis(redisClient)
	}
	return nil
}

func logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(fmt.Sprintf("[%s] %s", r.Method, r.RequestURI))
		next.ServeHTTP(w, r)
	})
}

func printEndpoints(router *mux.Router) error {
	return router.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		pathTemplate, err := route.GetPathTemplate()
		if err != nil {
			return err
		}

		methods, err := route.GetMethods()
		if err != nil {
			return err
		}

		log.Println(fmt.Sprintf("Path: %s, Methods: %s", pathTemplate, strings.Join(methods, ",")))
		return nil
	})
}

func onShutdown(srv http.Server, timeout time.Duration) {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	<-c

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()
	srv.Shutdown(ctx)
	log.Println("Shutting down")
	os.Exit(0)
}
