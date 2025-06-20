package domain

type User struct {
	id         ID
	email      Email
	authorName AuthorName
	uiTheme    UITheme
}

func NewUser(
	id ID,
	email Email,
	authorName AuthorName,
	uiTheme UITheme,
) User {
	return User{
		id:         id,
		email:      email,
		authorName: authorName,
		uiTheme:    uiTheme,
	}
}

func (u User) ID() ID                 { return u.id }
func (u User) Email() Email           { return u.email }
func (u User) AuthorName() AuthorName { return u.authorName }
func (u User) UITheme() UITheme       { return u.uiTheme }
