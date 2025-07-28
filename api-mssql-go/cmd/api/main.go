package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go/internal/api"
)

func main() {
	router := mux.NewRouter().StrictSlash(true)

	apiServer := api.InitAPIServer()

	router.HandleFunc("/orders", apiServer.GetOrders).Methods("GET")
	router.HandleFunc("/orders/{id}", apiServer.GetOrder).Methods("GET")
	router.HandleFunc("/orders/{id}", apiServer.DeleteOrder).Methods("DELETE")
	router.HandleFunc("/orders/{id}", apiServer.EditOrder).Methods("PUT")
	router.HandleFunc("/orders", apiServer.AddOrder).Methods("POST")

	router.HandleFunc("/orderCodeEvent", apiServer.ConsumeOrderCode).Methods("POST")

	log.Fatal(http.ListenAndServe(":8000", router))
}
