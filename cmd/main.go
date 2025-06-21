package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/iotassss/gizzmd/internal/handler"
	"github.com/iotassss/gizzmd/internal/middleware"
	"github.com/iotassss/gizzmd/internal/repository/gormrepo"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// logger file
	loggerFile, err := os.OpenFile("log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		slog.Error("failed to open log file", slog.Any("error", err))
		return
	}
	defer loggerFile.Close()

	slogJSONHandler := slog.NewJSONHandler(loggerFile, nil)
	logger := slog.New(slogJSONHandler)
	slog.SetDefault(logger)

	// load .env
	_ = godotenv.Load(".env")
	env := os.Getenv("APP_ENV")
	if env == "" {
		slog.Error(" environment variables", slog.Any("error", "APP_ENV"))
		return
	}
	appPort := os.Getenv("APP_PORT")
	if appPort == "" {
		slog.Error("Missing required environment variables", slog.Any("error", "APP_PORT"))
		return
	}
	mysqlDatabase := os.Getenv("MYSQL_DATABASE")
	if mysqlDatabase == "" {
		slog.Error("Missing required environment variables", slog.Any("error", "MYSQL_DATABASE"))
		return
	}
	mysqlUser := os.Getenv("MYSQL_USER")
	if mysqlUser == "" {
		slog.Error("Missing required environment variables", slog.Any("error", "MYSQL_USER"))
		return
	}
	mysqlPassword := os.Getenv("MYSQL_PASSWORD")
	if mysqlPassword == "" {
		slog.Error("Missing required environment variables", slog.Any("error", "MYSQL_PASSWORD"))
		return
	}
	dblHost := os.Getenv("DB_HOST")
	if dblHost == "" {
		slog.Error("Missing required environment variables", slog.Any("error", "DB_HOST"))
		return
	}

	// database
	dbDSN := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", mysqlUser, mysqlPassword, dblHost, mysqlDatabase)
	if env == "development" {
		slog.Info("connecting to database", slog.Any("dsn", dbDSN))
	}
	db, err := gorm.Open(mysql.Open(dbDSN), &gorm.Config{})
	if err != nil {
		slog.Error("failed to connect to database", slog.Any("error", err))
		return
	}
	err = db.AutoMigrate(
		&gormrepo.UserModel{},
		&gormrepo.DocModel{},
	)
	if err != nil {
		slog.Error("failed to migrate database", slog.Any("error", err))
		return
	}

	// dummy data
	if env == "development" {
		slog.Info("seeding dummy data")
		userRepo := gormrepo.NewUserRepository(db, context.Background())
		if err := userRepo.SeedDummyUser(); err != nil {
			slog.Error("failed to seed dummy data", slog.Any("error", err))
			return
		}
		slog.Info("dummy data seeded successfully")
	}

	// handler
	loginHandler := handler.NewLoginHandler(db)

	docListHandler := handler.NewListDocsHandler(db)
	docCreateHandler := handler.NewCreateDocHandler(db)
	docGetHandler := handler.NewGetDocHandler(db)
	docUpdateHandler := handler.NewUpdateDocHandler(db)
	docDeleteHandler := handler.NewDeleteDocHandler(db)

	userGetHandler := handler.NewGetUserHandler(db)
	userUpdateHandler := handler.NewUpdateUserHandler(db)

	// router
	r := gin.Default()
	// r.Static("/assets", "./static/dist/assets")
	r.Static("/static", "./web/static")

	// 認証不要なAPI
	api := r.Group("/api")
	{
		api.POST("/login", loginHandler)
	}

	// 認証が必要なAPI
	authorized := r.Group("/api")
	authorized.Use(middleware.AuthMiddleware())
	{
		authorized.GET("/user", userGetHandler)
		authorized.PATCH("/user", userUpdateHandler)

		authorized.GET("/docs", docListHandler)
		authorized.POST("/docs", docCreateHandler)
		authorized.GET("/docs/:doc_id", docGetHandler)
		authorized.PATCH("/docs/:doc_id", docUpdateHandler)
		authorized.DELETE("/docs/:doc_id", docDeleteHandler)
	}

	r.NoRoute(func(c *gin.Context) {
		c.File("./frontend/build/index.html")
	})

	r.Run() // デフォルトで :8080 で起動
}
