package main

import (
	"context"
	"log"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
)

var (
	fbAuthClient *auth.Client
	fbApp    *firebase.App
)

func initFirebaseApp() {
	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		log.Fatalf("error initializing firebase app: %v", err)
	}

	fbApp = app
}

func initFirebaseClient() {
	client, err := fbApp.Auth(context.Background())
	if err != nil {
		log.Fatalf("error getting firebase auth client: %v\n", err)
	}

	fbAuthClient = client
}
