package models

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Ticket struct {
	ID          primitive.ObjectID   `bson:"_id,omitempty" json:"_id"`
	Tags        []string             `bson:"tag,omitemptys" json:"tags"`
	Title       string               `bson:"title,omitempty" json:"title"`
	Assigned    []primitive.ObjectID `bson:"assigned,omitempty" json:"assigned"`
	Description string               `bson:"description,omitempty" json:"description"`
	Deadline    primitive.DateTime   `bson:"deadline,omitempty" json:"deadline"`
	CreatedBy   *primitive.ObjectID  `bson:"created_by,omitempty" json:"created_by"`
	CreatedAt   primitive.DateTime   `bson:"created_at,omitempty" json:"created_at,omitempty"`
	UpdatedAt   primitive.DateTime   `bson:"updated_at,omitempty" json:"updated_at,omitempty"`
}

type TicketModel struct {
	DB         *mongo.Client
	Collection *mongo.Collection
}

// Create a new ticket
func (m *TicketModel) Insert(ctx context.Context, t *Ticket) (*mongo.InsertOneResult, error) {
	t.ID = primitive.NewObjectID()
	t.CreatedBy = nil
	t.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	t.UpdatedAt = t.CreatedAt

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

func (m *TicketModel) Update(ctx context.Context, id string, t Ticket) (int64, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return 0, err
	}
	filter := bson.D{{"_id", oid}}
	t.ID = oid
	t.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())

	doc, err := toBsonDocument(t)
	if err != nil {
		return 0, err
	}
	update := bson.D{{"$set", doc}}

	result, err := m.Collection.UpdateOne(ctx, filter, update, nil)
	if err != nil || result.MatchedCount == 0 {
		return 0, err
	}

	fmt.Println("matched and replaced an existing document")
	return result.MatchedCount, nil
}
