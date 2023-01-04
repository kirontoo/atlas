package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kirontoo/atlas/server/internals/models"
	"go.mongodb.org/mongo-driver/bson"
)

func (s *api) CreateTicket(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
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
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
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

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
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
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	_, err := s.tickets.Delete(ctx, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": ""})
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Deleted %s", id)})
}

func (s *api) UserSignup(c *gin.Context) {
	type userSignupCredentials struct {
		Uid       string `form:"uid"      json:"uid"      binding:"required"`
		Username  string `form:"username" json:"username" binding:"required"`
		Email     string `form:"email"    json:"email"    binding:"required"`
		FirstName string `form:"firstName" json:"firstName"`
		LastName  string `form:"lastName" json:"lastName"`
	}

	var userCred userSignupCredentials

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Return if bad client data
	if err := c.BindJSON(&userCred); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// verify user doesn't exist
	userExists, _ := s.users.FindOne(ctx, bson.D{{Key: "uid", Value: userCred.Uid}}, nil)
	if userExists != nil {
		// user already exists
		c.JSON(http.StatusConflict, gin.H{"status": "error", "message": "user already exists"})
		return
	}

	// create user
	var role models.Role
	_, err := s.users.Insert(ctx, &models.User{
		UID:       userCred.Uid,
		Username:  userCred.Username,
		Email:     userCred.Email,
		Role:      role.Member(),
		FirstName: "",
		LastName:  "",
	})
	if err != nil {
		log.Print(err)
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"status": "error", "message": "user was not created", "errorMessage": err},
		)
		return
	}

	c.JSON(200, gin.H{"success": true, "data": nil, "message": "user created"})
}
