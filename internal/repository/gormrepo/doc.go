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
		created time.Time
		edited  time.Time
	}{
		{
			idStr:   "11111111-1111-1111-1111-111111111111",
			title:   "ダミードキュメント1",
			content: "# ダミー内容1\nこれはテスト用のドキュメント1です。",
			tags:    "test,dummy",
			snippet: "ダミー内容1",
			created: time.Date(2024, 12, 1, 10, 0, 0, 0, time.UTC),
			edited:  time.Date(2024, 12, 2, 12, 0, 0, 0, time.UTC),
		},
		{
			idStr:   "22222222-2222-2222-2222-222222222222",
			title:   "ダミードキュメント2",
			content: "# ダミー内容2\nこれはテスト用のドキュメント2です。",
			tags:    "sample,check",
			snippet: "ダミー内容2",
			created: time.Date(2025, 1, 10, 9, 30, 0, 0, time.UTC),
			edited:  time.Date(2025, 1, 15, 14, 0, 0, 0, time.UTC),
		},
		{
			idStr:   "33333333-3333-3333-3333-333333333333",
			title:   "ダミードキュメント3",
			content: "# ダミー内容3\nこれはテスト用のドキュメント3です。",
			tags:    "example,debug",
			snippet: "ダミー内容3",
			created: time.Date(2025, 2, 5, 8, 0, 0, 0, time.UTC),
			edited:  time.Date(2025, 2, 6, 18, 0, 0, 0, time.UTC),
		},
		{
			idStr:   "44444444-4444-4444-4444-444444444444",
			title:   "プロジェクト要件定義書",
			content: "# プロジェクト要件定義書\nこのドキュメントは新規Webアプリ開発プロジェクトの要件をまとめたものです。\n- 機能一覧\n- スケジュール\n- 担当者\n詳細は各セクションを参照してください。",
			tags:    "要件定義,プロジェクト管理,仕様",
			snippet: "新規Webアプリ開発の要件をまとめたドキュメントです。",
			created: time.Date(2025, 3, 1, 11, 0, 0, 0, time.UTC),
			edited:  time.Date(2025, 3, 10, 16, 0, 0, 0, time.UTC),
		},
		{
			idStr:   "55555555-5555-5555-5555-555555555555",
			title:   "API設計ガイドライン",
			content: "# API設計ガイドライン\n本ガイドラインは社内システム向けREST APIの設計方針を記載しています。\n- エンドポイント命名規則\n- レスポンス形式\n- エラーハンドリング\n開発者は必ず遵守してください。",
			tags:    "API,設計,ガイドライン,REST",
			snippet: "社内向けREST API設計のためのガイドラインです。",
			created: time.Date(2025, 4, 5, 13, 0, 0, 0, time.UTC),
			edited:  time.Date(2025, 4, 20, 17, 0, 0, 0, time.UTC),
		},
		{
			idStr: "66666666-6666-6666-6666-666666666666",
			title: "2025年度上期KPIレポート",
			content: `# 2025年度上期KPIレポート

本レポートは2025年度上期（1月〜6月）の主要KPIの集計結果および分析をまとめたものです。

## 1. サマリー
2025年度上期は、売上・ユーザー数ともに前年同期比で増加傾向を維持しました。特に新規サービスの導入が奏功し、アクティブユーザー数が大幅に伸長しました。

## 2. 売上推移
- 1月: 1,200万円
- 2月: 1,350万円
- 3月: 1,500万円
- 4月: 1,600万円
- 5月: 1,700万円
- 6月: 1,800万円
前年同期比: +18.2%

## 3. ユーザー数
- 新規登録ユーザー: 8,200人（前年同期比+22%）
- アクティブユーザー: 15,400人（前年同期比+19%）

## 4. サービス稼働率
- 平均稼働率: 99.97%
- 重大障害件数: 0件

## 5. 考察・今後の課題
- 新規サービスの定着率向上施策が奏功
- 既存ユーザーの離脱率がやや増加傾向のため、フォローアップ施策が必要
- 次期は海外展開に向けた準備を強化予定

## 6. 参考資料
- [売上推移グラフ]
- [ユーザー数推移グラフ]
- [稼働率月次推移表]

詳細データやグラフは添付資料を参照してください。
`,
			tags:    "KPI,レポート,分析,2025,業績,ユーザー,稼働率",
			snippet: "2025年度上期のKPI集計・分析・考察を含む詳細レポートです。",
			created: time.Date(2025, 6, 10, 8, 0, 0, 0, time.UTC),
			edited:  time.Date(2025, 6, 20, 19, 0, 0, 0, time.UTC),
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
		createdAt := domain.NewCreatedAt(d.created)
		editedAt := domain.NewEditedAt(d.edited)
		dummyDoc := domain.NewDoc(id, title, content, tags, snippet, authorId, createdAt, editedAt)
		_, err = r.Save(dummyDoc)
		if err != nil {
			return err
		}
	}
	return nil
}
