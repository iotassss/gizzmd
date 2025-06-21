package domain

import "fmt"

type Limit struct {
	value int
}

func NewLimit(value int) (Limit, error) {
	if value < 1 {
		return Limit{}, fmt.Errorf("limit must be greater than 0")
	}
	if value > 100 {
		return Limit{}, fmt.Errorf("limit cannot exceed 100")
	}
	return Limit{value: value}, nil
}

func DefaultLimit() Limit {
	return Limit{value: 20}
}

func (l Limit) Value() int    { return l.value }
func (l Limit) String() string { return fmt.Sprintf("%d", l.value) }