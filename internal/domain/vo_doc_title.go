package domain

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

type DocTitle struct {
	value string
}

func NewDocTitle(value string) (DocTitle, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return DocTitle{}, fmt.Errorf("document title cannot be empty")
	}
	if utf8.RuneCountInString(value) > 100 {
		return DocTitle{}, fmt.Errorf("document title cannot exceed 100 characters")
	}
	return DocTitle{value: value}, nil
}

func (d DocTitle) Value() string  { return d.value }
func (d DocTitle) String() string { return d.value }
func (d DocTitle) IsEmpty() bool  { return d.value == "" }
