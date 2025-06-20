package domain

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

type AuthorName struct {
	value string
}

func NewAuthorName(value string) (AuthorName, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return AuthorName{}, fmt.Errorf("author name cannot be empty")
	}
	if utf8.RuneCountInString(value) > 100 {
		return AuthorName{}, fmt.Errorf("author name cannot exceed 100 characters")
	}
	return AuthorName{value: value}, nil
}

func (a AuthorName) Value() string { return a.value }
func (a AuthorName) String() string { return a.value }
func (a AuthorName) IsEmpty() bool { return a.value == "" }