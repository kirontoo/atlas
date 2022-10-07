package main

import (
	"os"
	"testing"
)

func TestLoadEnv(t *testing.T) {
	t.Run("Should load environment variables", func(t *testing.T) {
		loadEnv()
		mongodb := os.Getenv("MONGODB_URI")
		port := os.Getenv("PORT")

		if mongodb == "" {
			t.Fail()
			t.Error("Could not load 'MONGODB_URI' environmental variable")
		}

		if port == "" {
			t.Fail()
			t.Error("Could not load 'PORT' environmental variable")
		}
	})
}
