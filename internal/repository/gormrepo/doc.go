package gormrepo

import (
	"context"
	"errors"
	"time"

	"github.com/iotassss/gizzmd/internal/domain"
	"gorm.io/gorm"
)

type DocModel struct {
	ID       string    `gorm:"column:id;primaryKey;not null"`
	Title    string    `gorm:"column:title;not null"`
	Content  string    `gorm:"column:content;not null"`
	Tags     string    `gorm:"column:tags;not null"`
	Snippet  string    `gorm:"column:snippet;not null"`
	AuthorID string    `gorm:"column:author_id;not null"`
	EditedAt time.Time `gorm:"column:edited_at;not null"`
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
	editedAt := domain.NewEditedAt(model.EditedAt)

	return domain.NewDoc(id, title, content, tags, snippet, authorId, editedAt), nil
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
	model := DocModel{
		ID:       doc.ID().String(),
		Title:    doc.Title().Value(),
		Content:  doc.Content().Value(),
		Tags:     doc.Tags().String(),
		Snippet:  doc.Snippet().Value(),
		AuthorID: doc.AuthorId().String(),
		EditedAt: doc.EditedAt().Value(),
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

func (r *DocRepository) Delete(id domain.ID) error {
	if err := r.db.WithContext(r.ctx).Delete(&DocModel{}, "id = ?", id.String()).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.ErrEntityNotFound
		}
		return err
	}
	return nil
}
