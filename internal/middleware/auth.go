package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	handler "github.com/iotassss/gizzmd/internal/handler"
)

// AuthMiddlewareはJWT認証を行うGin用ミドルウェアです。
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, handler.ErrorResponse{Message: "Missing or invalid Authorization header"})
			return
		}
		tokenString := strings.TrimPrefix(header, "Bearer ")
		user, err := handler.ValidateJWT(tokenString)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, handler.ErrorResponse{Message: "Invalid or expired token"})
			return
		}
		c.Set("user_id", user.ID)
		c.Next()
	}
}

// Ginのcontextからユーザーを取得
func GetUserFromContext(c *gin.Context) *handler.User {
	user, _ := c.Get("user")
	if u, ok := user.(*handler.User); ok {
		return u
	}
	return nil
}
