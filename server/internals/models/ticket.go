package models

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Ticket struct {
	ID          primitive.ObjectID `bson:"_id"`
	Tags        []string
	Title       string
	Assigned    []primitive.ObjectID
	Description string
	Deadline    primitive.DateTime  `bson:"deadline" json:"deadline"`
	CreatedBy   *primitive.ObjectID `bson:"created_by"`
	CreatedAt   primitive.DateTime  `bson:"created_at,omitempty" json:"created_at,omitempty"`
	UpdatedAt   primitive.DateTime  `bson:"updated_at,omitempty" json:"updated_at,omitempty"`
}

type TicketModel struct {
	DB         *mongo.Client
	Collection *mongo.Collection
}

func (m *TicketModel) Insert(ctx context.Context, t *Ticket) (*mongo.InsertOneResult, error) {
	result, err := m.Collection.InsertOne(ctx, t)
	if err != nil {
		return nil, err
	}
	return result, nil
}
