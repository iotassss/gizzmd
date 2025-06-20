package domain

import "fmt"

type UITheme struct {
	value string
}

const (
	UIThemeLight = "light"
	UIThemeDark  = "dark"
)

func NewUITheme(value string) (UITheme, error) {
	switch value {
	case UIThemeLight, UIThemeDark:
		return UITheme{value: value}, nil
	default:
		return UITheme{}, fmt.Errorf("invalid UI theme: %s (must be 'light' or 'dark')", value)
	}
}

func DefaultUITheme() UITheme {
	return UITheme{value: UIThemeLight}
}

func (u UITheme) Value() string { return u.value }
func (u UITheme) String() string { return u.value }
func (u UITheme) IsLight() bool { return u.value == UIThemeLight }
func (u UITheme) IsDark() bool { return u.value == UIThemeDark }