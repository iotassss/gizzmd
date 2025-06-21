package domain

import "fmt"

type Page struct {
	value int
}

func NewPage(value int) (Page, error) {
	if value < 1 {
		return Page{}, fmt.Errorf("page must be greater than 0")
	}
	return Page{value: value}, nil
}

func DefaultPage() Page {
	return Page{value: 1}
}

func (p Page) Value() int    { return p.value }
func (p Page) String() string { return fmt.Sprintf("%d", p.value) }