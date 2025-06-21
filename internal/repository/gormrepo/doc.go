package gormrepo

import (
	"context"
	"errors"
	"time"

	"github.com/iotassss/gizzmd/internal/domain"
	"gorm.io/gorm"
)

type DocModel struct {
	gorm.Model
	ID        string    `gorm:"column:id;primaryKey;not null"`
	Title     string    `gorm:"column:title;not null"`
	Content   string    `gorm:"column:content;not null"`
	Tags      string    `gorm:"column:tags;not null"`
	Snippet   string    `gorm:"column:snippet;not null"`
	AuthorID  string    `gorm:"column:author_id;not null"`
	CreatedAt time.Time `gorm:"column:created_at;not null"`
	EditedAt  time.Time `gorm:"column:edited_at;not null"`
}

func (DocModel) TableName() string {
	return "docs"
}

func toDocDomain(model DocModel) (domain.Doc, error) {
	id, err := domain.NewID(model.ID)
	if err != nil {
		return domain.Doc{}, err
	}
	title, err := domain.NewDocTitle(model.Title)
	if err != nil {
		return domain.Doc{}, err
	}
	content := domain.NewContent(model.Content)
	tags, err := domain.NewTags(model.Tags)
	if err != nil {
		return domain.Doc{}, err
	}
	snippet, err := domain.NewDocSnippet(model.Snippet)
	if err != nil {
		return domain.Doc{}, err
	}
	authorId, err := domain.NewID(model.AuthorID)
	if err != nil {
		return domain.Doc{}, err
	}
	createdAt := domain.NewCreatedAt(model.CreatedAt)
	editedAt := domain.NewEditedAt(model.EditedAt)

	return domain.NewDoc(id, title, content, tags, snippet, authorId, createdAt, editedAt), nil
}

type DocRepository struct {
	db  *gorm.DB
	ctx context.Context
}

func NewDocRepository(db *gorm.DB, ctx context.Context) *DocRepository {
	return &DocRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *DocRepository) Find(id domain.ID) (domain.Doc, error) {
	var model DocModel
	if err := r.db.WithContext(r.ctx).First(&model, "id = ?", id.String()).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Doc{}, domain.ErrEntityNotFound
		}
		return domain.Doc{}, err
	}
	return toDocDomain(model)
}

func (r *DocRepository) Save(doc domain.Doc) (domain.Doc, error) {
	var existing DocModel
	err := r.db.WithContext(r.ctx).First(&existing, "id = ?", doc.ID().String()).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return domain.Doc{}, err
	}

	model := DocModel{
		ID:        doc.ID().String(),
		Title:     doc.Title().Value(),
		Content:   doc.Content().Value(),
		Tags:      doc.Tags().String(),
		Snippet:   doc.Snippet().Value(),
		AuthorID:  doc.AuthorId().String(),
		CreatedAt: doc.CreatedAt().Value(),
		EditedAt:  doc.EditedAt().Value(),
	}
	if err == nil {
		model.CreatedAt = existing.CreatedAt
		model.UpdatedAt = existing.UpdatedAt
		model.DeletedAt = existing.DeletedAt
	}

	if err := r.db.WithContext(r.ctx).Save(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Doc{}, domain.ErrEntityNotFound
		}
		if errors.Is(err, gorm.ErrInvalidData) {
			return domain.Doc{}, domain.ErrValidationFailed
		}
		return domain.Doc{}, err
	}

	return toDocDomain(model)
}

func (r *DocRepository) FindDocs(query domain.DocsQuery) ([]domain.Doc, int, error) {
	db := r.db.WithContext(r.ctx)

	var models []DocModel
	var total int64

	queryDB := db.Model(&DocModel{})

	if !query.Tags().IsEmpty() {
		tags := query.Tags().Values()
		for _, tag := range tags {
			queryDB = queryDB.Where("tags LIKE ?", "%"+tag+"%")
		}
	}

	if !query.CreatedRange().IsEmpty() {
		if !query.CreatedRange().From().IsNil() {
			queryDB = queryDB.Where("created_at >= ?", query.CreatedRange().From().Value())
		}
		if !query.CreatedRange().To().IsNil() {
			queryDB = queryDB.Where("created_at <= ?", query.CreatedRange().To().Value())
		}
	}

	if !query.UpdatedRange().IsEmpty() {
		if !query.UpdatedRange().From().IsNil() {
			queryDB = queryDB.Where("edited_at >= ?", query.UpdatedRange().From().Value())
		}
		if !query.UpdatedRange().To().IsNil() {
			queryDB = queryDB.Where("edited_at <= ?", query.UpdatedRange().To().Value())
		}
	}

	if err := queryDB.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	orderBy := query.SortBy().Value()
	if query.SortOrder().IsDesc() {
		orderBy += " DESC"
	} else {
		orderBy += " ASC"
	}

	if err := queryDB.Order(orderBy).
		Offset(query.Offset()).
		Limit(query.Limit().Value()).
		Find(&models).Error; err != nil {
		return nil, 0, err
	}

	docs := make([]domain.Doc, len(models))
	for i, model := range models {
		doc, err := toDocDomain(model)
		if err != nil {
			return nil, 0, err
		}
		docs[i] = doc
	}

	return docs, int(total), nil
}

func (r *DocRepository) Delete(id domain.ID) error {
	if err := r.db.WithContext(r.ctx).Delete(&DocModel{}, "id = ?", id.String()).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.ErrEntityNotFound
		}
		return err
	}
	return nil
}

func (r *DocRepository) SeedDummyDocs() error {
	docs := []struct {
		idStr   string
		title   string
		content string
		tags    string
		snippet string
	}{
		{
			idStr:   "11111111-1111-1111-1111-111111111111",
			title:   "ダミードキュメント1",
			content: "# ダミー内容1\nこれはテスト用のドキュメント1です。",
			tags:    "test,dummy",
			snippet: "ダミー内容1",
		},
		{
			idStr:   "22222222-2222-2222-2222-222222222222",
			title:   "ダミードキュメント2",
			content: "# ダミー内容2\nこれはテスト用のドキュメント2です。",
			tags:    "sample,check",
			snippet: "ダミー内容2",
		},
		{
			idStr:   "33333333-3333-3333-3333-333333333333",
			title:   "ダミードキュメント3",
			content: "# ダミー内容3\nこれはテスト用のドキュメント3です。",
			tags:    "example,debug",
			snippet: "ダミー内容3",
		},
	}

	for _, d := range docs {
		id, err := domain.NewID(d.idStr)
		if err != nil {
			return err
		}
		err = r.Delete(id)
		if err != nil {
			return err
		}

		title, err := domain.NewDocTitle(d.title)
		if err != nil {
			return err
		}
		content := domain.NewContent(d.content)
		tags, err := domain.NewTags(d.tags)
		if err != nil {
			return err
		}
		snippet, err := domain.NewDocSnippet(domain.ExtractSnippet(content.Value()))
		if err != nil {
			return err
		}
		authorId, err := domain.NewID("123e4567-e89b-12d3-a456-426614174000") // 既存のダミーユーザーID
		if err != nil {
			return err
		}
		createdAt := domain.NewCreatedAtNow()
		editedAt := domain.NewEditedAtNow()
		dummyDoc := domain.NewDoc(id, title, content, tags, snippet, authorId, createdAt, editedAt)
		_, err = r.Save(dummyDoc)
		if err != nil {
			return err
		}
	}
	return nil
}
