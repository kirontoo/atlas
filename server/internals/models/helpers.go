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
