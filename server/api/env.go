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
	secretKey  string
}

const (
	ENV_ATLAS_SECRET_KEY  = "ATLAS_SECRET_KEY"
	ENV_ATLAS_PORT        = "ATLAS_PORT"
	ENV_ATLAS_MONGODB_URI = "ATLAS_MONGODB_URI"
)

func (c *config) LoadVariables() {
	defaultPort := "8000"
	defaultUri := "mongodb://mongodb0.example.com:27017"
	defaultSecretKey := ENV_ATLAS_SECRET_KEY

	envPort, ok := os.LookupEnv(ENV_ATLAS_PORT)
	if ok {
		defaultPort = envPort
	}
	envUri, ok := os.LookupEnv(ENV_ATLAS_MONGODB_URI)
	if ok {
		defaultUri = envUri
	}
	envSecretKey, ok := os.LookupEnv(ENV_ATLAS_SECRET_KEY)
	if ok {
		defaultSecretKey = envSecretKey
	}

	port := flag.String("port", defaultPort, "HTTP network address")
	uri := flag.String(
		"uri",
		defaultUri,
		"Mongo db uri address. dsn should match format: username:password@protocol(address)/dbname?param=value",
	)
	secretKey := flag.String("secret", defaultSecretKey, "JWT Secret Key")

	flag.Parse()

	c.port = *port
	c.mongodbUri = *uri
	c.secretKey = *secretKey
}

func (c *config) LoadEnv(path string) error {
	err := godotenv.Load(path)
	if err != nil {
		return errors.New("Error loading .env file")
	}

	return nil
}

func GetEnvSecretKey() (string, bool) {
	return os.LookupEnv(ENV_ATLAS_SECRET_KEY)
}

func GetEnvMongodbUri() (string, bool) {
	return os.LookupEnv(ENV_ATLAS_MONGODB_URI)
}
