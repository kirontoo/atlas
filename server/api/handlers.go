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
		UID       string      `form:"uid"       json:"uid"       binding:"required"`
		Username  string      `form:"username"  json:"username"  binding:"required"`
		Email     string      `form:"email"     json:"email"     binding:"required"`
		FirstName string      `form:"firstName" json:"firstName"`
		LastName  string      `form:"lastName"  json:"lastName"`
		Role      models.Role `form:"role"      json:"role"`
	}

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var userCred userSignupCredentials

	// Return if bad client data
	if err := c.BindJSON(&userCred); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// verify user doesn't exist
	userExists, error := s.users.FindOne(
		ctx,
		bson.D{
			{
				Key: "$or",
				Value: bson.A{
					bson.D{{Key: "username", Value: userCred.Username}},
					bson.D{{Key: "email", Value: userCred.Email}},
				},
			},
		},
		nil,
	)

	if error == nil {
		if userExists.Email == userCred.Email {
			c.AbortWithStatusJSON(
				http.StatusConflict,
				gin.H{"status": "error", "message": "email already exists"},
			)
			return
		}

		if userExists.Username == userCred.Username {
			c.AbortWithStatusJSON(
				http.StatusConflict,
				gin.H{"status": "error", "message": "username already exists"},
			)
			return
		}
	}

	// assign a role: defaults to Member
	var role models.Role
	if userCred.Role > 0 {
		role = userCred.Role
	} else {
		role = role.Member()
	}

	// create user
	user, err := s.users.Insert(ctx, &models.User{
		UID:       userCred.UID,
		Username:  userCred.Username,
		Email:     userCred.Email,
		Role:      role,
		FirstName: userCred.FirstName,
		LastName:  userCred.LastName,
	})
	if err != nil {
		log.Fatalf("error creating user in db: %v", err)
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"status": "error", "message": "user was not created"},
		)
		return
	}

	c.JSON(200, gin.H{"success": true, "data": user, "message": "user created"})
}

func (s *api) userUpdate(c *gin.Context) {
	type validUserUpdateData struct {
		Username  string      `form:"username"  json:"username,omitempty"`
		Email     string      `form:"email"     json:"email,omitempty"`
		Role      models.Role `form:"role"      json:"role,omitempty"`
		FirstName string      `form:"firstName" json:"firstName,omitempty"`
		LastName  string      `form:"lastName"  json:"lastName,omitempty"`
	}

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	_, exists := getCurrentUser(c)
	if exists {
		dataToUpdate := validUserUpdateData{}
		// Return if bad client data
		if err := c.BindJSON(&dataToUpdate); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			fmt.Println(err)
			return
		}

		update := structToMap(dataToUpdate)

		id := getCurrentUserId(c)

		modified, err := s.users.UpdateOne(ctx, id, update)
		if err != nil {
			log.Print(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update user"})
			return
		}

		if modified == 1 {
			c.JSON(200, gin.H{"success": true, "data": nil, "message": "user updated"})
			return
		}

	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": ""})
		return
	}
}

func (s *api) userDelete(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	id := getCurrentUserId(c)

	_, err := s.users.Delete(ctx, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not delete user"})
		fmt.Println(err)
		return
	}
}

func (s *api) CreateProject(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	var project *models.Project

	user, exists := getCurrentUser(c)
	if !exists {
		c.AbortWithStatus(http.StatusInternalServerError)
	}

	if err := c.BindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	project.CreatedBy = user.ID

	result, err := s.projects.Insert(ctx, project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "order was not created"})
		fmt.Println(err)
		return
	}

	c.JSON(200, gin.H{"success": true, "data": result, "message": "user created"})
}
