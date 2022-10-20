package models

import "go.mongodb.org/mongo-driver/bson"

func toBsonDocument(s interface{}) (*bson.D, error) {
	var doc *bson.D
	data, err := bson.Marshal(s)
	if err != nil {
		return nil, err
	}

	err = bson.Unmarshal(data, &doc)
	return doc, nil
}

func isStringExists(list []string, target string) bool {
	for _, s := range list {
		if s == target {
			return true
		}
	}
	return false
}
