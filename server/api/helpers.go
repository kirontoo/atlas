package main

import (
	"context"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/kirontoo/atlas/server/internals/models"
	"go.mongodb.org/mongo-driver/bson"
)

type SignedDetails struct {
	Email string
	jwt.StandardClaims
}

func generateTokens(secretKey string, email string, username string) (string, string, error) {
	claims := &SignedDetails{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(24)).Unix(),
		},
	}

	refreshClaims := &SignedDetails{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(168)).Unix(),
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(secretKey)
	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).
		SignedString([]byte(secretKey))
	if err != nil {
		log.Panic(err)
		return "", "", err
	}

	return token, refreshToken, err
}

func getUserByRefId(refId string) (*models.User, error) {
	return users.FindOne(context.Background(), bson.D{{Key: "uid", Value: refId}}, nil)
}

func getCurrentUserId(c *gin.Context) string {
	value, exists := c.Get(UserContext)
	user := value.(models.User)
	if exists {
		return user.ID.String()
	}
	return ""
}

func getCurrentUser(c *gin.Context) (models.User, bool) {
	value, exists := c.Get(UserContext)
	user := value.(models.User)
	return user, exists
}
