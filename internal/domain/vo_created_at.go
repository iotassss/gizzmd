package domain

import "time"

type CreatedAt struct {
	value time.Time
}

func NewCreatedAt(value time.Time) CreatedAt {
	return CreatedAt{value: value}
}

func NewCreatedAtNow() CreatedAt {
	return CreatedAt{value: time.Now()}
}

func (c CreatedAt) Value() time.Time { return c.value }
func (c CreatedAt) String() string   { return c.value.Format(time.RFC3339) }
func (c CreatedAt) IsZero() bool     { return c.value.IsZero() }