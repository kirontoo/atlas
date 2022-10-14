package main

import (
	"os"
	"regexp"
	"testing"
)

func TestLoadEnv(t *testing.T) {
	t.Run("Should load environment variables", func(t *testing.T) {
		var c config
		rootPath := getRootPath(nil)
		err := c.LoadEnv(rootPath + `/.env`)
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

func getRootPath(dir *string) string {
	projectName := regexp.MustCompile(`^(.*server)`)
	if dir != nil {
		projectName = regexp.MustCompile(`^(.*` + *dir + `)`)
	}
	currentDir, _ := os.Getwd()
	rootPath := projectName.Find([]byte(currentDir))
	return string(rootPath)

}
