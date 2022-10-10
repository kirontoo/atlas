package models

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Ticket struct {
	ID          primitive.ObjectID   `bson:"_id" json:"_id"`
	Tags        []string             `bson:"tags" json:"tags"`
	Title       string               `bson:"title" json:"title"`
	Assigned    []primitive.ObjectID `bson:"assigned" json:"assigned"`
	Description string               `bson:"description" json:"description"`
	Deadline    primitive.DateTime   `bson:"deadline" json:"deadline"`
	CreatedBy   *primitive.ObjectID  `bson:"created_by" json:"created_by"`
	CreatedAt   primitive.DateTime   `bson:"created_at,omitempty" json:"created_at,omitempty"`
	UpdatedAt   primitive.DateTime   `bson:"updated_at,omitempty" json:"updated_at,omitempty"`
}

type TicketModel struct {
	DB         *mongo.Client
	Collection *mongo.Collection
}

// Create a new ticket
func (m *TicketModel) Insert(ctx context.Context, t *Ticket) (*mongo.InsertOneResult, error) {
	result, err := m.Collection.InsertOne(ctx, t)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// Retrieve a specific ticket based on its id
func (m *TicketModel) Get(ctx context.Context, id string) (*Ticket, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		fmt.Printf("oid %v, id %v", oid, id)
		return nil, err
	}
	var result *Ticket

	err = m.Collection.FindOne(ctx, bson.D{{"_id", oid}}).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, err
		}
	}
	fmt.Printf("found document %+v", result)
	return result, nil
}
