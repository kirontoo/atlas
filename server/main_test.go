package main

import (
	"fmt"
	"os"
	"regexp"
	"testing"
)

func TestLoadEnv(t *testing.T) {
	t.Run("Should load environment variables", func(t *testing.T) {
		var c config
		projectName := regexp.MustCompile(`^(.*` + projectDirName + `)`)
		currentDir, _ := os.Getwd()
		rootPath := projectName.Find([]byte(currentDir))
		fmt.Print(string(rootPath))
		err := c.LoadEnv(string(rootPath) + `/.env`)
		if err != nil {
			t.Error("Could not load from environment file")
		}

		mongodb := os.Getenv("ATLAS_MONGODB_URI")
		port := os.Getenv("ATLAS_PORT")

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
