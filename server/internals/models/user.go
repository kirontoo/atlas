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

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"        json:"_id"`
	UID       string             `bson:"uid,omitempty"        json:"uid"`
	Username  string             `bson:"username,omitempty"   json:"username"`
	Email     string             `bson:"email,omitempty"      json:"email"`
	Role      Role               `bson:"role,omitempty"       json:"role"`
	FirstName string             `bson:"firstName,omitempty"  json:"firstName"`
	LastName  string             `bson:"lastName,omitempty"   json:"lastName"`
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
		"required": []string{"uid", "username", "email", "role"},
		"properties": bson.M{
			"uid": bson.M{
				"bsonType":    "string",
				"description": "the Firebase user UID reference, whish is required and must be a string",
			},
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
			"role": bson.M{
				"bsonType":    "int",
				"enum":        role.Values(),
				"description": "the role permissions a user can have",
			},
			"firstName": bson.M{
				"bsonType":    "string",
				"description": "the first name of the user",
			},
			"lastName": bson.M{
				"bsonType":    "string",
				"description": "the last name of the user",
			},
		},
	}
}

func NewUserModel(client *mongo.Client, dbName string) (*UserModel, error) {
	const collectionName = "users"
	db := client.Database(dbName)
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

func (m *UserModel) FindOne(
	ctx context.Context,
	filter interface{},
	opts *options.FindOneOptions,
) (*User, error) {
	var result *User
	err := m.Collection.FindOne(
		ctx,
		filter,
		opts,
	).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, ErrNoRecord
		}
	}

	return result, nil
}

func (m *UserModel) Insert(ctx context.Context, u *User) (*User, error) {
	if u == nil {
		return nil, errors.New("No user data")
	}

	u.ID = primitive.NewObjectID()
	u.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	u.UpdatedAt = u.CreatedAt

	_, err := m.Collection.InsertOne(ctx, *u)
	if err != nil {
		return nil, err
	}

	return u, nil
}

func (m *UserModel) Update(ctx context.Context, id string, u *User) (int64, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return 0, err
	}
	filter := bson.D{{Key: "_id", Value: oid}}
	u.ID = oid
	u.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())

	doc, err := toBsonDocument(u)
	if err != nil {
		return 0, err
	}
	update := bson.D{{Key: "$set", Value: doc}}

	result, err := m.Collection.UpdateOne(ctx, filter, update, nil)
	if err != nil || result.MatchedCount == 0 {
		return 0, err
	}

	return result.MatchedCount, nil
}

func (m *UserModel) Delete(ctx context.Context, id string) (int64, error) {
	return 0, nil
}
