package config

import (
	"log"
	"os"

	"github.com/vrischmann/envconfig"
)

var appConfig Config

// Config struct to hold the app config
type Config struct {
	Host     string `envconfig:"POSTGRES_HOST"`
	Port     string `envconfig:"POSTGRES_PORT,default=5432"`
	Username string `envconfig:"POSTGRES_USER"`
	Password string `envconfig:"POSTGRES_PASSWORD"`
	Database string `envconfig:"POSTGRES_DB"`
	SSLMode  string `envconfig:"POSTGRES_SSLMODE,default=disable"`
}

// InitConfig initializes the AppConfig
func initConfig() {
	log.Println("initilizing db configuration....")
	appConfig = Config{}

	err := envconfig.Init(&appConfig)
	if err != nil {
		for _, pair := range os.Environ() {
			log.Println(pair)
		}
		log.Fatal("Please check the database connection parameters....", err.Error())
	}
}

// AppConfig returns the current AppConfig
func GetConfig() Config {
	if appConfig == (Config{}) {
		initConfig()
	}
	return appConfig
}
