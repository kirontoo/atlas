package models

import (
	"context"
	"errors"
	"fmt"
	"log"
	"runtime/debug"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id"`
	Username  string             `bson:"username,omitempty" json:"username"`
	Email     string             `bson:"email,omitempty" json:"email"`
	Password  string             `bson:"password,omitempty" json:"password"`
	Avatar    *string            `bson:"avatar,omitempty" json:"avatar"`
	Role      Role               `bson:"role,omitempty" json:"role"`
	Projects  []Project          `bson:"projects,omitempty,inline" json:"projects"`
	CreatedAt primitive.DateTime `bson:"created_at,omitempty" json:"created_at,omitempty"`
	UpdatedAt primitive.DateTime `bson:"updated_at,omitempty" json:"updated_at,omitempty"`
}

type UserModel struct {
	db         *mongo.Client
	Collection *mongo.Collection
}

func (m *UserModel) jsonSchema() bson.M {
	var role Role
	return bson.M{
		"bsonType": "object",
		"required": []string{"username", "email", "password"},
		"properties": bson.M{
			"username": bson.M{
				"bsonType": "string",
				"description": "the username of the user, which is required and " +
					"must be a string",
			},
			"email": bson.M{
				"bsonType": "string",
				"description": "the email of the user, which is required and " +
					"must be a valid email address",
			},
			"password": bson.M{
				"bsonType": "string",
				"description": "the hashed password of the user, which is required and " +
					"must be a string",
			},
			"avatar": bson.M{
				"bsonType": "string",
				"description": "the avatar source of the user, which is not required and " +
					"must be a string and a valid url",
			},
			"projects": bson.M{
				"bsonType":    "array",
				"description": "the projects a user is involved in",
				"required":    []string{"title", "created_at", "updated_at"},
				"items": bson.M{
					"properties": bson.M{
						"title": bson.M{
							"bsonType":    "string",
							"description": "the title of the project",
						},
						"created_at": bson.M{
							"bsonType":    "timestamp",
							"description": "the date and time of when this user was created",
						},
						"updated_at": bson.M{
							"bsonType":    "timestamp",
							"description": "the date and time of when this user was created",
						},
					},
				},
			},
			"roles": bson.M{
				"enum":        role.Values(),
				"description": "the role permissions a user can have",
			},
			"created_at": bson.M{
				"bsonType":    "timestamp",
				"description": "the date and time of when this user was created",
			},
			"updated_at": bson.M{
				"bsonType":    "timestamp",
				"description": "the date and time of when this user was created",
			},
		},
	}
}

func NewUserModel(client *mongo.Client, dbName string) (*UserModel, error) {
	const collectionName = "users"
	var db = client.Database(dbName)
	if db == nil {
		return nil, errors.New("database does not exist")
	}

	userModel := &UserModel{}

	collectionNames, err := db.ListCollectionNames(context.TODO(), bson.D{})
	if err != nil {
		log.Output(2, fmt.Sprintf("%s\n%s", err.Error(), debug.Stack()))
		return nil, err
	}

	if !isStringExists(collectionNames, collectionName) {
		validator := bson.M{
			"$jsonSchema": userModel.jsonSchema(),
		}

		opts := options.CreateCollection().SetValidator(validator)

		err := db.CreateCollection(context.TODO(), "users", opts)
		if err != nil {
			log.Output(2, fmt.Sprintf("%s\n%s", err.Error(), debug.Stack()))
			return nil, err
		}

	}

	userModel.db = client
	userModel.Collection = db.Collection(collectionName)

	return userModel, nil
}

func (m *UserModel) GetById(id string) (*User, error) {
	return nil, nil
}

func (m *UserModel) Insert(data *User) (*User, error) {
	return nil, nil
}

func (m *UserModel) Update(data *User) (*User, error) {
	return nil, nil
}
