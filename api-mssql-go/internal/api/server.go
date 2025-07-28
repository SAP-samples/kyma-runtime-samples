package api

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go/internal/db"
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

	order_id := strings.Split(r.URL.Path, "/")[2]
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
	err := json.NewDecoder(r.Body).Decode(&order)

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
	err := json.NewDecoder(r.Body).Decode(&order)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
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
	order_id := strings.Split(r.URL.Path, "/")[2]
	rowsEffected, err := s.db.DeleteOrder(order_id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, _ := json.Marshal(rowsEffected)

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}
