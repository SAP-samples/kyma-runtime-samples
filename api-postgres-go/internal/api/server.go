package api

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-postgres-go/internal/db"
)

type orderData struct {
	Orderid     string `json:"order_id"`
	Description string `json:"description"`
}

type server struct {
	db *db.Server
}

func InitAPIServer() *server {
	server := &server{}
	server.db = db.InitDatabase()
	return server
}

func (s *server) GetOrder(w http.ResponseWriter, r *http.Request) {
	order_id := mux.Vars(r)["id"]
	if order_id == "" {
		http.Error(w, "missing order id", http.StatusBadRequest)
		return
	}
	orders, err := s.db.GetOrder(order_id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(orders)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func (s *server) GetOrders(w http.ResponseWriter, r *http.Request) {
	orders, err := s.db.GetOrders()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(orders)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func (s *server) EditOrder(w http.ResponseWriter, r *http.Request) {

	var order orderData

	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if order.Orderid == "" {
		http.Error(w, "order_id is required", http.StatusBadRequest)
		return
	}

	rowsEffected, err := s.db.EditOrder(order.Orderid, order.Description)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(rowsEffected)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func (s *server) AddOrder(w http.ResponseWriter, r *http.Request) {

	var order orderData

	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if order.Orderid == "" {
		http.Error(w, "order_id is required", http.StatusBadRequest)
		return
	}

	orders, err := s.db.AddOrder(order.Orderid, order.Description)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(orders)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func (s *server) DeleteOrder(w http.ResponseWriter, r *http.Request) {
	order_id := mux.Vars(r)["id"]
	if order_id == "" {
		http.Error(w, "missing order id", http.StatusBadRequest)
		return
	}
	rowsEffected, err := s.db.DeleteOrder(order_id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(rowsEffected)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}
