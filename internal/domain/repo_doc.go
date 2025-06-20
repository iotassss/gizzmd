package domain

type DocRepository interface {
	Find(id ID) (Doc, error)
	Save(doc Doc) (Doc, error)
	Delete(id ID) error
}
