package domain

import "fmt"

type SortOrder struct {
	value string
}

const (
	SortOrderAsc  = "asc"
	SortOrderDesc = "desc"
)

func NewSortOrder(value string) (SortOrder, error) {
	switch value {
	case SortOrderAsc, SortOrderDesc:
		return SortOrder{value: value}, nil
	default:
		return SortOrder{}, fmt.Errorf("invalid sort_order: %s. allowed values: asc, desc", value)
	}
}

func DefaultSortOrder() SortOrder {
	return SortOrder{value: SortOrderDesc}
}

func (s SortOrder) Value() string  { return s.value }
func (s SortOrder) String() string { return s.value }
func (s SortOrder) IsAsc() bool    { return s.value == SortOrderAsc }
func (s SortOrder) IsDesc() bool   { return s.value == SortOrderDesc }