package domain

type UserRepository interface {
	Find(id ID) (Doc, error)
	Save(doc Doc) error
	Delete(id ID) error
}
