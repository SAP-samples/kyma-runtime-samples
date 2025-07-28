package db

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/SAP-samples/kyma-runtime-extension-samples/api-mssql-go/internal/config"
	_ "github.com/denisenkom/go-mssqldb"
)

// var db *sql.DB

type Server struct {
	db *sql.DB
}

//InitDatabase - sets database connection configuration
func InitDatabase() *Server {
	var err error

	connString := getConnString()

	log.Printf("Setting connection to db with configuration: %s \n", connString)

	server := &Server{}
	server.db, err = sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatal("Error opening connection: ", err.Error())
	}

	server.db.SetConnMaxLifetime(time.Minute * 4)

	return server
}

//gets configuration and returns appropiate connection string
func getConnString() string {

	config := config.GetConfig()

	connString := fmt.Sprintf("server=%s;user id=%s;password=%s;port=%s;database=%s;",
		config.Server, config.Username, config.Password, config.Port, config.Database)

	return connString
}

//will verify the connection is available or generate a new one
func (s *Server) getConnection() {

	err := s.db.Ping()
	if err != nil {
		log.Fatal("Could not ping db: ", err.Error())
	}
	log.Println("Ping successful")
}
