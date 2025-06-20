package domain

import (
	"fmt"

	"github.com/google/uuid"
)

type ID struct {
	value uuid.UUID
}

func NewID(value string) (ID, error) {
	parsedUUID, err := uuid.Parse(value)
	if err != nil {
		return ID{}, fmt.Errorf("invalid UUID: %w", err)
	}
	return ID{value: parsedUUID}, nil
}

func GenerateID() ID {
	return ID{value: uuid.New()}
}

func (id ID) Value() uuid.UUID { return id.value }
func (id ID) String() string   { return id.value.String() }
func (id ID) IsNil() bool      { return id.value == uuid.Nil }
