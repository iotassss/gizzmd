package domain

type Doc struct {
	id        ID
	title     DocTitle
	content   Content
	tags      Tags
	snippet   DocSnippet
	authorId  ID
	createdAt CreatedAt
	editedAt  EditedAt
}

func NewDoc(
	id ID,
	title DocTitle,
	content Content,
	tags Tags,
	snippet DocSnippet,
	authorId ID,
	createdAt CreatedAt,
	editedAt EditedAt,
) Doc {
	return Doc{
		id:        id,
		title:     title,
		content:   content,
		tags:      tags,
		snippet:   snippet,
		authorId:  authorId,
		createdAt: createdAt,
		editedAt:  editedAt,
	}
}

func (d Doc) ID() ID              { return d.id }
func (d Doc) Title() DocTitle     { return d.title }
func (d Doc) Content() Content    { return d.content }
func (d Doc) Tags() Tags          { return d.tags }
func (d Doc) Snippet() DocSnippet { return d.snippet }
func (d Doc) AuthorId() ID        { return d.authorId }
func (d Doc) CreatedAt() CreatedAt { return d.createdAt }
func (d Doc) EditedAt() EditedAt  { return d.editedAt }
