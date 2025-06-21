package domain

import (
	"fmt"
	"time"
)

type DateFilter struct {
	value *time.Time
}

func NewDateFilter(value string) (DateFilter, error) {
	if value == "" {
		return DateFilter{value: nil}, nil
	}

	parsedTime, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return DateFilter{}, fmt.Errorf("invalid date format: %s. expected RFC3339 format (e.g., 2024-01-01T00:00:00Z)", value)
	}

	return DateFilter{value: &parsedTime}, nil
}

func (d DateFilter) Value() *time.Time { return d.value }
func (d DateFilter) String() string {
	if d.value == nil {
		return ""
	}
	return d.value.Format(time.RFC3339)
}
func (d DateFilter) IsNil() bool { return d.value == nil }

type DateRange struct {
	from DateFilter
	to   DateFilter
}

func NewDateRange(from, to DateFilter) (DateRange, error) {
	if !from.IsNil() && !to.IsNil() && from.value.After(*to.value) {
		return DateRange{}, fmt.Errorf("from date cannot be after to date")
	}
	return DateRange{from: from, to: to}, nil
}

func (dr DateRange) From() DateFilter { return dr.from }
func (dr DateRange) To() DateFilter   { return dr.to }
func (dr DateRange) IsEmpty() bool    { return dr.from.IsNil() && dr.to.IsNil() }
