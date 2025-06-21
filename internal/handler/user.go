package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iotassss/gizzmd/internal/domain"
	"github.com/iotassss/gizzmd/internal/repository/gormrepo"
	"gorm.io/gorm"
)

type GetUserResponse struct {
	ID         string `json:"id"`
	Email      string `json:"email"`
	AuthorName string `json:"author_name"`
	UITheme    string `json:"ui_theme"`
}

type UpdateUserRequest struct {
	AuthorName string `json:"author_name,omitempty"`
	UITheme    string `json:"ui_theme,omitempty"`
}

// func NewGetUserHandler(userRepo domain.UserRepository) gin.HandlerFunc {
func NewGetUserHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRepo := gormrepo.NewUserRepository(db, c.Request.Context())

		userIDStr, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}

		userID, err := domain.NewID(userIDStr.(string))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		user, err := userRepo.Find(userID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		response := GetUserResponse{
			ID:         user.ID().String(),
			Email:      user.Email().String(),
			AuthorName: user.AuthorName().String(),
			UITheme:    user.UITheme().String(),
		}

		c.JSON(http.StatusOK, response)
	}
}

func NewUpdateUserHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRepo := gormrepo.NewUserRepository(db, c.Request.Context())

		userIDStr, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}

		userID, err := domain.NewID(userIDStr.(string))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
			return
		}

		var req UpdateUserRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		user, err := userRepo.Find(userID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		updatedUser := user

		if req.AuthorName != "" {
			authorName, err := domain.NewAuthorName(req.AuthorName)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			updatedUser = domain.NewUser(
				user.ID(),
				user.Email(),
				authorName,
				user.UITheme(),
			)
		}

		if req.UITheme != "" {
			uiTheme, err := domain.NewUITheme(req.UITheme)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			updatedUser = domain.NewUser(
				updatedUser.ID(),
				updatedUser.Email(),
				updatedUser.AuthorName(),
				uiTheme,
			)
		}

		savedUser, err := userRepo.Save(updatedUser)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
			return
		}

		response := GetUserResponse{
			ID:         savedUser.ID().String(),
			Email:      savedUser.Email().String(),
			AuthorName: savedUser.AuthorName().String(),
			UITheme:    savedUser.UITheme().String(),
		}

		c.JSON(http.StatusOK, response)
	}
}
