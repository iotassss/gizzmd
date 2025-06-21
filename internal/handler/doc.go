package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iotassss/gizzmd/internal/domain"
	"github.com/iotassss/gizzmd/internal/repository/gormrepo"
	"gorm.io/gorm"
)

type GetDocResponse struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Content  string `json:"content"`
	Tags     string `json:"tags"`
	Snippet  string `json:"snippet"`
	AuthorID string `json:"author_id"`
	EditedAt string `json:"edited_at"`
}

type UpdateDocRequest struct {
	Title   string `json:"title,omitempty"`
	Content string `json:"content,omitempty"`
	Tags    string `json:"tags,omitempty"`
}

type CreateDocRequest struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Tags    string `json:"tags"`
}

func NewListDocsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 実装例: クエリパラメータ取得・DB検索・レスポンス生成
	}
}

// ドキュメント作成
func NewCreateDocHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		docRepo := gormrepo.NewDocRepository(db, c.Request.Context())

		var req CreateDocRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}
		if req.Title == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
			return
		}
		title, err := domain.NewDocTitle(req.Title)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		content := domain.NewContent(req.Content)
		tags, err := domain.NewTags(req.Tags)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		snippet, _ := domain.NewDocSnippet(domain.ExtractSnippet(req.Content))
		authorIDStr, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}
		authorID, err := domain.NewID(authorIDStr.(string))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid author ID"})
			return
		}

		doc := domain.NewDoc(
			domain.GenerateID(),
			title,
			content,
			tags,
			snippet,
			authorID,
			domain.NewEditedAtNow(),
		)
		saved, err := docRepo.Save(doc)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create document"})
			return
		}

		resp := GetDocResponse{
			ID:       saved.ID().String(),
			Title:    saved.Title().String(),
			Content:  saved.Content().String(),
			Tags:     saved.Tags().String(),
			Snippet:  saved.Snippet().String(),
			AuthorID: saved.AuthorId().String(),
			EditedAt: saved.EditedAt().String(),
		}
		c.JSON(http.StatusCreated, resp)
	}
}

func NewGetDocHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		docRepo := gormrepo.NewDocRepository(db, c.Request.Context())

		docIDStr := c.Param("doc_id")
		docID, err := domain.NewID(docIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
			return
		}

		doc, err := docRepo.Find(docID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
			return
		}

		resp := GetDocResponse{
			ID:       doc.ID().String(),
			Title:    doc.Title().String(),
			Content:  doc.Content().String(),
			Tags:     doc.Tags().String(),
			Snippet:  doc.Snippet().String(),
			AuthorID: doc.AuthorId().String(),
			EditedAt: doc.EditedAt().String(),
		}
		c.JSON(http.StatusOK, resp)
	}
}

// ドキュメント更新
func NewUpdateDocHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		docRepo := gormrepo.NewDocRepository(db, c.Request.Context())

		docIDStr := c.Param("doc_id")
		docID, err := domain.NewID(docIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
			return
		}

		var req UpdateDocRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		doc, err := docRepo.Find(docID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
			return
		}

		updatedDoc := doc
		if req.Title != "" {
			title, err := domain.NewDocTitle(req.Title)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			updatedDoc = domain.NewDoc(
				doc.ID(),
				title,
				doc.Content(),
				doc.Tags(),
				doc.Snippet(),
				doc.AuthorId(),
				domain.NewEditedAtNow(),
			)
		}

		if req.Content != "" {
			content := domain.NewContent(req.Content)
			snippet, _ := domain.NewDocSnippet(domain.ExtractSnippet(req.Content))
			updatedDoc = domain.NewDoc(
				updatedDoc.ID(),
				updatedDoc.Title(),
				content,
				updatedDoc.Tags(),
				snippet,
				updatedDoc.AuthorId(),
				domain.NewEditedAtNow(),
			)
		}

		if req.Tags != "" {
			tags, err := domain.NewTags(req.Tags)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}
			updatedDoc = domain.NewDoc(
				updatedDoc.ID(),
				updatedDoc.Title(),
				updatedDoc.Content(),
				tags,
				updatedDoc.Snippet(),
				updatedDoc.AuthorId(),
				domain.NewEditedAtNow(),
			)
		}

		saved, err := docRepo.Save(updatedDoc)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update document"})
			return
		}

		resp := GetDocResponse{
			ID:       saved.ID().String(),
			Title:    saved.Title().String(),
			Content:  saved.Content().String(),
			Tags:     saved.Tags().String(),
			Snippet:  saved.Snippet().String(),
			AuthorID: saved.AuthorId().String(),
			EditedAt: saved.EditedAt().String(),
		}
		c.JSON(http.StatusOK, resp)
	}
}

// ドキュメント削除
func NewDeleteDocHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		docRepo := gormrepo.NewDocRepository(db, c.Request.Context())

		docIDStr := c.Param("doc_id")
		docID, err := domain.NewID(docIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid document ID"})
			return
		}

		err = docRepo.Delete(docID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete document"})
			return
		}

		c.Status(http.StatusNoContent)
	}
}
