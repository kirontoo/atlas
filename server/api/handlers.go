package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kirontoo/atlas/server/internals/models"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

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
	if errors.Is(err, models.ErrNoRecord) {
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

func (s *api) DeleteTicket(c *gin.Context) {
	id := c.Params.ByName("id")
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	_, err := s.tickets.Delete(ctx, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": ""})
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Deleted %s", id)})
}

func (s *api) UserSignup(c *gin.Context) {
	type userSignup struct {
		Email    string `form:"email"    json:"email"    binding:"required"`
		Password string `form:"password" json:"password" binding:"required"`
		Username string `form:"username" json:"username" binding:"required"`
	}

	var userCred userSignup

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Return if bad client data
	if err := c.BindJSON(&userCred); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// verify user doesn't exist
	userNameExists, _ := s.users.FindOne(ctx, bson.D{{"username", userCred.Username}}, nil)
	if userNameExists != nil {
		// user already exists
		c.JSON(http.StatusConflict, gin.H{"status": "error", "message": "username already exists"})
		return
	}

	emailExists, _ := s.users.FindOne(ctx, bson.D{{"email", userCred.Email}}, nil)
	if emailExists != nil {
		// email already exists
		c.JSON(http.StatusConflict, gin.H{"status": "error", "message": "user already exist"})
		return
	}

	// hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(userCred.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// create user
	_, err = s.users.Insert(ctx, &models.User{
		Email:    userCred.Email,
		Username: userCred.Username,
		Password: string(hashed),
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "user was not created"})
		return
	}

	c.JSON(200, gin.H{"success": true, "data": nil, "message": "successful signup!"})
}
