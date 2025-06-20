package gormrepo

import (
	"context"
	"errors"

	"github.com/iotassss/gizzmd/internal/domain"
	"gorm.io/gorm"
)

type UserModel struct {
	gorm.Model
	ID         string `gorm:"column:id;primaryKey;not null"`
	Email      string `gorm:"column:email;not null;unique"`
	AuthorName string `gorm:"column:author_name;not null"`
	UITheme    string `gorm:"column:ui_theme;not null"`
}

func (UserModel) TableName() string {
	return "users"
}

func toUserDomain(model UserModel) (domain.User, error) {
	id, err := domain.NewID(model.ID)
	if err != nil {
		return domain.User{}, err
	}
	email, err := domain.NewEmail(model.Email)
	if err != nil {
		return domain.User{}, err
	}
	authorName, err := domain.NewAuthorName(model.AuthorName)
	if err != nil {
		return domain.User{}, err
	}
	uiTheme, err := domain.NewUITheme(model.UITheme)
	if err != nil {
		return domain.User{}, err
	}

	return domain.NewUser(id, email, authorName, uiTheme), nil
}

type UserRepository struct {
	db  *gorm.DB
	ctx context.Context
}

func NewUserRepository(
	db *gorm.DB,
	ctx context.Context,
) *UserRepository {
	return &UserRepository{
		db:  db,
		ctx: ctx,
	}
}

func (r *UserRepository) Find(id domain.ID) (domain.User, error) {
	var model UserModel
	if err := r.db.WithContext(r.ctx).First(&model, "id = ?", id.Value()).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.User{}, domain.ErrEntityNotFound
		}
		return domain.User{}, err
	}
	return toUserDomain(model)
}

func (r *UserRepository) Save(user domain.User) (domain.User, error) {
	model := UserModel{
		ID:         user.ID().String(),
		Email:      user.Email().Value(),
		AuthorName: user.AuthorName().Value(),
		UITheme:    user.UITheme().Value(),
	}

	if err := r.db.WithContext(r.ctx).Save(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.User{}, domain.ErrEntityNotFound
		}
		if errors.Is(err, gorm.ErrInvalidData) {
			return domain.User{}, domain.ErrValidationFailed
		}

		return domain.User{}, err
	}

	return toUserDomain(model)
}

func (r *UserRepository) Delete(id domain.ID) error {
	if err := r.db.WithContext(r.ctx).Delete(&UserModel{}, "id = ?", id.Value()).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.ErrEntityNotFound
		}
		return err
	}
	return nil
}
