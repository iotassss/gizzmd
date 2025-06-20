package domain

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

type DocSnippet struct {
	value string
}

func NewDocSnippet(snippet string) (DocSnippet, error) {
	if utf8.RuneCountInString(snippet) > 100 {
		return DocSnippet{}, fmt.Errorf("snippet cannot exceed 100 characters")
	}
	return DocSnippet{value: snippet}, nil
}

func ExtractSnippet(content string) string {
	content = strings.TrimSpace(content)
	if content == "" {
		return ""
	}

	lines := strings.SplitN(content, "\n", 2)
	firstLine := lines[0]
	runes := []rune(firstLine)
	if len(runes) <= 100 {
		return firstLine
	}

	return string(runes[:100])
}

func (s DocSnippet) Value() string  { return s.value }
func (s DocSnippet) String() string { return s.value }
func (s DocSnippet) IsEmpty() bool  { return s.value == "" }
