package models

import (
	"context"
	"errors"
	"fmt"
	"log"
	"runtime/debug"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Project struct {
	ID          primitive.ObjectID  `bson:"_id,omitempty"         json:"_id"`
	Name        string              `bson:"name,omitempty"        json:"name,omitempty"`
	ProjectHead *primitive.ObjectID `bson:"projectHead,omitempty" json:"projectHead,omitempty"`
	Description string              `bson:"description,omitempty" json:"description,omitempty"`
	CreatedBy   primitive.ObjectID  `bson:"createdBy,omitempty"   json:"createdBy,omitempty"`
	Deadline    primitive.DateTime  `bson:"deadline,omitempty"    json:"deadline,omitempty"`
	CreatedAt   primitive.DateTime  `bson:"createdAt,omitempty"   json:"createdAt,omitempty"`
	UpdatedAt   primitive.DateTime  `bson:"updatedAt,omitempty"   json:"updatedAt,omitempty"`
}

type ProjectCollection struct {
	collection *mongo.Collection
}

func (m *ProjectCollection) Init(db *mongo.Database) error {
	const collectionName = "projects"
	if db == nil {
		return errors.New("database does not exist")
	}

	collectionNames, err := db.ListCollectionNames(context.TODO(), bson.D{})
	if err != nil {
		log.Output(2, fmt.Sprintf("%s\n%s", err.Error(), debug.Stack()))
		return err
	}

	if !isStringExists(collectionNames, collectionName) {
		validator := bson.M{
			"$jsonSchema": m.jsonSchema(),
		}

		opts := options.CreateCollection().SetValidator(validator)

		err := db.CreateCollection(context.TODO(), collectionName, opts)
		if err != nil {
			log.Output(2, fmt.Sprintf("%s\n%s", err.Error(), debug.Stack()))
			return err
		}
	}

	m.collection = db.Collection(collectionName)

	return nil
}

func (m *ProjectCollection) jsonSchema() bson.M {
	return bson.M{
		"bsonType": "object",
		"required": []string{"title", "createdBy"},
		"properties": bson.M{
			"title": bson.M{
				"bsonType":    "string",
				"description": "the title of the project, which is required and must be a string",
			},
			"createdBy": bson.M{
				"bsonType":    "objectId",
				"description": "ID reference of the user that created this project, which is required and must be a string",
			},
			"projectHead": bson.M{
				"bsonType":    "objectId",
				"description": "ID reference of the user that is in charge of the project, which is required and must be a string",
			},
			"description": bson.M{
				"bsonType":    "string",
				"description": "the description of the project, which is required and must be a string",
			},
			"deadline": bson.M{
				"bsonType":    "date",
				"description": "the date of when this project is due",
			},
		},
	}
}

func (m *ProjectCollection) Insert(
	ctx context.Context,
	p *Project,
) (*Project, error) {
	p.ID = primitive.NewObjectID()
	p.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	p.UpdatedAt = p.CreatedAt

	_, err := m.collection.InsertOne(ctx, p)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (m *ProjectCollection) Get(
	ctx context.Context,
	filters bson.M,
) ([]Project, error) {
	cursor, err := m.collection.Find(ctx, filters, nil)
	if err != nil {
		return nil, ErrNoRecord
	}

	var results []Project = []Project{}
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}
	return results, nil
}

func (m *ProjectCollection) GetOne(
	ctx context.Context,
	filters bson.M,
) (*Project, error) {
	var result *Project

	err := m.collection.
		FindOne(ctx, filters).
		Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, ErrNoRecord
		}
	}
	return result, nil
}

func (m *ProjectCollection) UpdateOne(
	ctx context.Context,
	project bson.M,
	filters bson.M,
) (int64, error) {
	project["updatedAt"] = primitive.NewDateTimeFromTime(time.Now())

	doc, err := toBsonDocument(project)
	if err != nil {
		return 0, err
	}
	update := bson.D{{Key: "$set", Value: doc}}

	result, err := m.collection.UpdateOne(ctx, filters, update, nil)
	if err != nil || result.MatchedCount == 0 {
		return 0, err
	}

	return result.MatchedCount, nil
}

func (m *ProjectCollection) Delete(
	ctx context.Context,
	id string,
) (int64, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return 0, err
	}

	res, err := m.collection.DeleteOne(context.TODO(), bson.M{"_id": oid}, nil)
	if err != nil {
		log.Print(err)
		return 0, err
	}
	return res.DeletedCount, nil
}
