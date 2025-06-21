package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

var jwtSecret = []byte("your-secret-key") // 本番では環境変数等で管理

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
	User        User   `json:"user"`
}

type ErrorResponse struct {
	Message string `json:"message"`
}

type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

// ダミー認証: 本来はDB参照
func authenticateUser(email, password string) (*User, bool) {
	if email == "user@example.com" && password == "password123" {
		return &User{
			ID:    "123e4567-e89b-12d3-a456-426614174000",
			Email: email,
			Name:  "John Doe",
		}, true
	}
	return nil, false
}

func generateJWT(user *User) (string, int, error) {
	expiresIn := 3600
	expiresAt := time.Now().Add(time.Duration(expiresIn) * time.Second)
	claims := jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"name":  user.Name,
		"exp":   expiresAt.Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(jwtSecret)
	return signed, expiresIn, err
}

// ログイン
func NewLoginHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginRequest
		if err := json.NewDecoder(c.Request.Body).Decode(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Message: "Invalid request body"})
			return
		}
		user, ok := authenticateUser(req.Username, req.Password)
		if !ok {
			c.JSON(http.StatusUnauthorized, ErrorResponse{Message: "The provided username or password is incorrect"})
			return
		}
		token, expiresIn, err := generateJWT(user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Message: "Failed to generate token"})
			return
		}
		resp := LoginResponse{
			AccessToken: token,
			TokenType:   "Bearer",
			ExpiresIn:   expiresIn,
			User:        *user,
		}
		c.JSON(http.StatusOK, resp)
	}
}

// JWT検証用ミドルウェア例
func ValidateJWT(tokenString string) (*User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, jwt.ErrInvalidKey
	}
	user := &User{
		ID:    claims["sub"].(string),
		Email: claims["email"].(string),
		Name:  claims["name"].(string),
	}
	return user, nil
}
