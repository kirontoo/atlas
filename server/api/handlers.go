package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kirontoo/atlas/server/internals/models"
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
