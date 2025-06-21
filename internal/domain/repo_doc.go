package domain

type DocRepository interface {
	Find(id ID) (Doc, error)
	FindDocs(query DocsQuery) ([]Doc, int, error)
	Save(doc Doc) (Doc, error)
	Delete(id ID) error
}
