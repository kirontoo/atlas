package main

import (
	"context"
	"regexp"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().
			Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

const (
	UserContext  = "user"
	TokenContext = "authToken"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// find token from headers
		authHeader := c.Request.Header.Get("Authorization")
		r, _ := regexp.Compile("^Bearer (.+)$")

		match := r.FindStringSubmatch(authHeader)
		if len(match) == 0 {
			c.AbortWithStatus(401)
			return
		}

		tokenString := match[1]

		if len(tokenString) == 0 {
			c.AbortWithStatus(401)
			return
		}

		// check firebase id token validity
		token, err := fbAuthClient.VerifyIDToken(context.Background(), tokenString)
		if err != nil {
			c.AbortWithStatus(401)
			return
		}

		// find user by uid
		user, err := getUserByRefId(token.UID)
		if err != nil {
			c.AbortWithStatus(401)
			return
		}

		// set context user
		c.Set(UserContext, user)

		// set context token
		c.Set(TokenContext, token)

		c.Next()
	}
}
