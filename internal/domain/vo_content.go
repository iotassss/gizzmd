package domain

const maxContentBytes = 16 * 1024 * 1024 // 16MB

type Content struct {
	value string
}

func NewContent(value string) Content {
	return Content{value: value}
}

func (c Content) Value() string  { return c.value }
func (c Content) String() string { return c.value }
func (c Content) IsEmpty() bool  { return c.value == "" }

func (c Content) IsWithin16MB() bool {
	return len(c.value) <= maxContentBytes
}
