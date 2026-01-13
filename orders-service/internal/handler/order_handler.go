package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/kyma-project/examples/orders-service/internal/service"
	"github.com/kyma-project/examples/orders-service/internal/service/model"
	"github.com/kyma-project/examples/orders-service/internal/store"
)

type Order struct {
	svc *service.Order
}

type Router interface {
	HandleFunc(path string, f func(http.ResponseWriter, *http.Request)) *mux.Route
}

func NewOrder(svc *service.Order) *Order {
	return &Order{
		svc: svc,
	}
}

func (o *Order) RegisterAll(root string, router Router) {
	router.HandleFunc(fmt.Sprintf("%s", root), o.OnList).Methods(http.MethodGet)
	router.HandleFunc(fmt.Sprintf("%s/{id}", root), o.OnRead).Methods(http.MethodGet)
	router.HandleFunc(fmt.Sprintf("%s", root), o.OnCreate).Methods(http.MethodPost)
	router.HandleFunc(fmt.Sprintf("%s", root), o.OnDeleteAll).Methods(http.MethodDelete)
	router.HandleFunc(fmt.Sprintf("%s/{id}", root), o.OnDeleteOne).Methods(http.MethodDelete)
	router.HandleFunc("/storagetype", o.OnGetStorageType).Methods(http.MethodGet)
}

func (o *Order) OnList(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	list, err := o.svc.List(ctx)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	js, err := json.Marshal(list)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func (o *Order) OnRead(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	vars := mux.Vars(r)

	order, err := o.svc.Get(ctx, vars["id"])
	if err == store.NotFoundError {
		log.Println(err)
		w.WriteHeader(http.StatusNotFound)
		return
	} else if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	js, err := json.Marshal(order)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func (o *Order) OnCreate(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	order := new(model.Order)
	if err := json.Unmarshal(body, order); err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = o.svc.Create(ctx, order)
	if err == store.AlreadyExistsError {
		w.WriteHeader(http.StatusConflict)
		return
	} else if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (o *Order) OnDeleteAll(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := o.svc.DeleteAll(ctx)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (o *Order) OnDeleteOne(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	vars := mux.Vars(r)
	err := o.svc.DeleteOne(ctx, vars["id"])
	if err == store.NotFoundError {
		log.Println(err)
		w.WriteHeader(http.StatusNotFound)
		return
	} else if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (o *Order) OnGetStorageType(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	storageType := o.svc.GetStorageType(ctx)

	w.Header().Set("Content-Type", "text/plain")
	w.Write([]byte(storageType))
}
