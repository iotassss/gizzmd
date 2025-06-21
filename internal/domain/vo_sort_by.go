package domain

import "fmt"

type SortBy struct {
	value string
}

const (
	SortByCreatedAt = "created_at"
	SortByUpdatedAt = "updated_at"
	SortByTitle     = "title"
)

func NewSortBy(value string) (SortBy, error) {
	switch value {
	case SortByCreatedAt, SortByUpdatedAt, SortByTitle:
		return SortBy{value: value}, nil
	default:
		return SortBy{}, fmt.Errorf("invalid sort_by field: %s. allowed values: created_at, updated_at, title", value)
	}
}

func DefaultSortBy() SortBy {
	return SortBy{value: SortByCreatedAt}
}

func (s SortBy) Value() string  { return s.value }
func (s SortBy) String() string { return s.value }