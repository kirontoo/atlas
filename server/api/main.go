package main

import (
	"log"
	"net/http"
	"os"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/kirontoo/atlas/server/internals/models"
)

const projectDirName = "server"
const database = "atlas"

type api struct {
	router  *gin.Engine
	tickets *models.TicketModel
	users   *models.UserModel
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

	db := getMongoClient(env.mongodbUri)

	gin.ForceConsoleColor()

	userModel, err := models.NewUserModel(db, database)
	api := &api{
		router:  gin.New(),
		tickets: &models.TicketModel{DB: db, Collection: getCollection(db, "tickets")},
		users:   userModel,
	}

	// set middlewares
	api.router.Use(CORSMiddleware())

	api.router.POST("/api/tickets", api.CreateTicket)
	api.router.GET("/api/tickets/:id", api.GetTicketByID)
	api.router.POST("/api/tickets/:id", api.UpdateTicket)
	api.router.DELETE("/api/tickets/:id", api.DeleteTicket)
	api.router.POST("/api/users/signup", api.UserSignup)

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
