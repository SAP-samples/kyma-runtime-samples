package config

import (
	"log"
	"os"

	"github.com/vrischmann/envconfig"
)

var appConfig Config

//Config struct to hold the app config
type Config struct {
	Server   string `envconfig:"MYAPP_host"`
	Port     string `envconfig:"MYAPP_port,default=1433"`
	Username string `envconfig:"MYAPP_username"`
	Password string `envconfig:"MYAPP_password"`
	Database string `envconfig:"MYAPP_database"`
}

//InitConfig initializes the AppConfig
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

//AppConfig returns the current AppConfig
func GetConfig() Config {
	if appConfig == (Config{}) {
		initConfig()
	}
	return appConfig
}
