package api

import (
	"encoding/json"
	"net/http"
)

type orderCode struct {
	OrderCode string `json:"orderCode"`
}

func (s *server) ConsumeOrderCode(w http.ResponseWriter, r *http.Request) {
	var order orderCode

	defer r.Body.Close()
	err := json.NewDecoder(r.Body).Decode(&order)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	_, err = s.db.AddOrder(order.OrderCode, "order received from event")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
