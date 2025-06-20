package domain

import "time"

type EditedAt struct {
	value time.Time
}

func NewEditedAt(value time.Time) EditedAt {
	return EditedAt{value: value}
}

func NewEditedAtNow() EditedAt {
	return EditedAt{value: time.Now()}
}

func (e EditedAt) Value() time.Time { return e.value }
func (e EditedAt) String() string   { return e.value.Format(time.RFC3339) }
func (e EditedAt) IsZero() bool     { return e.value.IsZero() }
