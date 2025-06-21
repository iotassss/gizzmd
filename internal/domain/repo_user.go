package domain

type UserRepository interface {
	Find(id ID) (User, error)
	Save(user User) (User, error)
	Delete(id ID) error
}
