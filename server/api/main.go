package main

import (
	"log"
	"net/http"
	"os"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/kirontoo/atlas/server/internals/models"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	projectDirName = "server"
	databaseName   = "atlas"
)

type api struct {
	router   *gin.Engine
	tickets  *models.TicketModel
	users    *models.UserCollection
	projects *models.ProjectCollection
}

var (
	db       *mongo.Database
	users    = &models.UserCollection{}
	projects = &models.ProjectCollection{}
)

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

	mongoClient := getMongoClient(env.mongodbUri)
	db = mongoClient.Database(databaseName)

	// firebase init
	initFirebaseApp()
	initFirebaseClient()

	gin.ForceConsoleColor()

	// initialize collections
	err = users.Init(db)
	if err != nil {
		log.Fatalf("could not make user collection: %v", err)
	}

	err = projects.Init(db)
	if err != nil {
		log.Fatalf("could not make user collection: %v", err)
	}

	api := &api{
		router: gin.New(),
		tickets: &models.TicketModel{
			DB:         mongoClient,
			Collection: getCollection(mongoClient, "tickets"),
		},
		users:    users,
		projects: projects,
	}

	// set middlewares
	api.router.Use(gin.Logger())
	api.router.Use(gin.Recovery())
	api.router.Use(CORSMiddleware())

	ticketRouter := api.router.Group("/api/tickets")
	ticketRouter.Use(AuthRequired())
	{
		ticketRouter.POST("/", api.CreateTicket)
		ticketRouter.GET("/:id", api.GetTicketByID)
		ticketRouter.POST("/:id", api.UpdateTicket)
		ticketRouter.DELETE("/:id", api.DeleteTicket)
	}

	userRouter := api.router.Group("/api/users")
	userRouter.Use(AuthRequired())
	{
		userRouter.DELETE(("/"), api.userDelete)
		userRouter.PATCH(("/"), api.userUpdate)
	}

	projectRouter := api.router.Group("/api/projects")
	projectRouter.Use(AuthRequired())
	{
		projectRouter.POST("/", api.CreateProject)
		projectRouter.GET("/", api.GetAllProjects)
		projectRouter.GET("/:id", api.GetProjectById)
		projectRouter.PATCH("/:id", api.UpdateProject)
		projectRouter.DELETE("/:id", api.DeleteProject)
	}

	api.router.POST("/api/users", api.UserSignup)

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
