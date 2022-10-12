package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/kirontoo/atlas/server/internals/models"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const projectDirName = "server"
const database = "atlas"

var db *mongo.Client

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

type api struct {
	router  *gin.Engine
	tickets *models.TicketModel
}

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

func main() {
	projectName := regexp.MustCompile(`^(.*` + projectDirName + `)`)
	currentDir, _ := os.Getwd()
	rootPath := projectName.Find([]byte(currentDir))

	var env config
	err := env.LoadEnv(string(rootPath) + `/.env`)
	if err != nil {
		log.Fatal(err)
	}

	env.LoadVariables()

	db = getMongoClient(env.mongodbUri)

	gin.ForceConsoleColor()
	api := &api{
		router:  gin.New(),
		tickets: &models.TicketModel{DB: db, Collection: getCollection("tickets", db)},
	}

	// set middlewares
	api.router.Use(CORSMiddleware())

	api.router.POST("/api/tickets", api.CreateTicket)
	api.router.GET("/api/tickets/:id", api.GetTicketByID)
	api.router.POST("/api/tickets/:id", api.UpdateTicket)

	api.router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	err = api.router.Run(":" + env.port)
	if err != nil {
		log.Fatal(err)
	}
}

func getMongoClient(uri string) *mongo.Client {
	client, err := mongo.NewClient(options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	} else {
		log.Println("this is working!")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println("Connected to database")
	}

	return client
}

func (s *api) CreateTicket(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var ticket *models.Ticket

	if err := c.BindJSON(&ticket); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	result, err := s.tickets.Insert(ctx, ticket)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "order was not created"})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (s *api) GetTicketByID(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	id := c.Params.ByName("id")

	result, err := s.tickets.Get(ctx, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ticket does not exist"})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (s *api) UpdateTicket(c *gin.Context) {
	id := c.Params.ByName("id")
	var t models.Ticket

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	if err := c.BindJSON(&t); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	result, err := s.tickets.Update(ctx, id, t)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func getCollection(collectionName string, db *mongo.Client) (collection *mongo.Collection) {
	collection = db.Database(database).Collection(collectionName)
	return
}
