package domain

import (
	"fmt"
	"strings"
	"unicode/utf8"
)

type Tags struct {
	value string // カンマ区切り文字列で保持
}

// カンマ区切り文字列からTagsを生成
func NewTags(csv string) (Tags, error) {
	csv = strings.TrimSpace(csv)
	if csv == "" {
		return Tags{value: ""}, nil
	}

	parts := strings.Split(csv, ",")
	seen := make(map[string]bool)
	for i, part := range parts {
		tag := strings.TrimSpace(part)
		if tag == "" {
			return Tags{}, fmt.Errorf("tag at position %d is empty", i+1)
		}
		if utf8.RuneCountInString(tag) < 1 || utf8.RuneCountInString(tag) > 50 {
			return Tags{}, fmt.Errorf("tag '%s' must be 1-50 characters", tag)
		}
		if seen[tag] {
			return Tags{}, fmt.Errorf("duplicate tag: %s", tag)
		}
		seen[tag] = true
	}

	return Tags{value: csv}, nil
}

func (ts Tags) Values() []string {
	if ts.value == "" {
		return []string{}
	}
	parts := strings.Split(ts.value, ",")
	for i := range parts {
		parts[i] = strings.TrimSpace(parts[i])
	}
	return parts
}

func (ts Tags) String() string { return ts.value }
func (ts Tags) IsEmpty() bool  { return ts.value == "" }
