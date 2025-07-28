package db

import (
	"fmt"
	"log"
	"time"
)

//Order -
type Order struct {
	Orderid     string    `json:"order_id"`
	Description string    `json:"description"`
	Created     time.Time `json:"created"`
}

type RowsAffected struct {
	RowsAffected int64
}

func (s *Server) GetOrder(order_id string) ([]Order, error) {
	tsql := fmt.Sprintf("SELECT * FROM Orders WHERE order_id=@p1;")
	return s.query(tsql, order_id)
}

func (s *Server) GetOrders() ([]Order, error) {
	tsql := fmt.Sprintf("SELECT * FROM Orders;")
	return s.query(tsql, nil)
}

func (s *Server) AddOrder(order_id string, description string) ([]Order, error) {
	tsql := fmt.Sprintf("INSERT INTO Orders(order_id, description) VALUES(@p1,@p2);")
	_, err := s.exec(tsql, order_id, description)
	if err != nil {
		return nil, err
	}

	tsql = fmt.Sprintf("SELECT * FROM Orders WHERE order_id=@p1;")
	return s.query(tsql, order_id, description)
}

func (s *Server) EditOrder(order_id string, description string) (RowsAffected, error) {
	tsql := fmt.Sprintf("UPDATE Orders SET description=@p2 WHERE order_id=@p1")
	return s.exec(tsql, order_id, description)
}

func (s *Server) DeleteOrder(order_id string) (RowsAffected, error) {
	tsql := fmt.Sprintf("DELETE FROM Orders WHERE order_id=@p1")
	return s.exec(tsql, order_id)
}

func (s *Server) exec(tsql string, args ...interface{}) (RowsAffected, error) {

	s.getConnection()

	rowsAffectedResult := RowsAffected{}
	rowsAffectedResult.RowsAffected = 0

	log.Printf("Executing SQL: %s \n", tsql)
	log.Printf("With args: %s \n", args...)

	result, err := s.db.Exec(tsql, args...)
	if err != nil {
		return rowsAffectedResult, err
	}
	num, _ := result.RowsAffected()

	rowsAffectedResult.RowsAffected = num

	return rowsAffectedResult, nil

}

func (s *Server) query(tsql string, args ...interface{}) ([]Order, error) {

	s.getConnection()

	order := Order{}
	orders := []Order{}

	log.Printf("Executing SQL: %s \n", tsql)
	log.Printf("With args: %s \n", args...)

	rows, err := s.db.Query(tsql, args...)

	if err != nil {
		log.Println("failed...")
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&order.Orderid, &order.Description, &order.Created)
		if err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}

	return orders, nil
}
