package main

import (
	"errors"
	"flag"
	"os"

	"github.com/joho/godotenv"
)

type config struct {
	port       string
	mongodbUri string
}

func (c *config) LoadVariables() {
	defaultPort := "8000"
	defaultUri := "mongodb://mongodb0.example.com:27017"

	envPort, ok := os.LookupEnv("ATLAS_PORT")
	if ok {
		defaultPort = envPort
	}
	envUri, ok := os.LookupEnv("ATLAS_MONGODB_URI")
	if ok {
		defaultUri = envUri
	}

	port := flag.String("port", defaultPort, "HTTP network address")
	uri := flag.String("uri", defaultUri, "Mongo db uri address. dsn should match format: username:password@protocol(address)/dbname?param=value")

	flag.Parse()

	c.port = *port
	c.mongodbUri = *uri
}

func (c *config) LoadEnv(path string) error {
	err := godotenv.Load(path)
	if err != nil {
		return errors.New("Error loading .env file")
	}

	return nil
}
