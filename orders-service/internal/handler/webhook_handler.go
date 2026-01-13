package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/kyma-project/examples/orders-service/internal/service"
	"github.com/kyma-project/examples/orders-service/internal/service/model"
	"github.com/kyma-project/examples/orders-service/internal/store"
	"io/ioutil"
	"log"
	"net/http"
)

type Webhook struct {
	svc *service.Order
}

func NewWebhook(svc *service.Order) *Webhook {
	return &Webhook{
		svc: svc,
	}
}

func (h *Webhook) RegisterAll(root string, router Router) {
	router.HandleFunc(fmt.Sprintf("%s", root), h.onHook).Methods(http.MethodPost)
}

func (h *Webhook) onHook(w http.ResponseWriter, r *http.Request) {
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

	err = h.svc.Create(ctx, order)
	if err == store.AlreadyExistsError {
		w.WriteHeader(http.StatusConflict)
		return
	} else if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
