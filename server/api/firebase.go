package main

import (
	"context"
	"log"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
)

var (
	firebaseClient *auth.Client
	firebaseApp    *firebase.App
)

func initFirebaseApp() {
	app, err := firebase.NewApp(context.Background(), nil)
	if err != nil {
		log.Fatalf("error initializing firebase app: %v", err)
	}

	firebaseApp = app
}

func initFirebaseClient() {
	client, err := firebaseApp.Auth(context.Background())
	if err != nil {
		log.Fatalf("error getting firebase auth client: %v\n", err)
	}

	firebaseClient = client
}
