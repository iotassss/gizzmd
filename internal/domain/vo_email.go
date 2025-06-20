package domain

import (
	"fmt"
	"regexp"
	"strings"
)

type Email struct {
	value string
}

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)

func NewEmail(value string) (Email, error) {
	// TODO: net/mail.ParseAddressを使用することを検討する

	value = strings.TrimSpace(value)
	if value == "" {
		return Email{}, fmt.Errorf("email cannot be empty")
	}
	if !emailRegex.MatchString(value) {
		return Email{}, fmt.Errorf("invalid email format: %s", value)
	}
	return Email{value: strings.ToLower(value)}, nil
}

func (e Email) Value() string  { return e.value }
func (e Email) String() string { return e.value }
func (e Email) IsEmpty() bool  { return e.value == "" }
