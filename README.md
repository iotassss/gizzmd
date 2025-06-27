# GizzMD

GoバックエンドとReactフロントエンドで構築されたMarkdownドキュメント管理システムです。

## 主な機能

- JWTによるメール/パスワード認証
- ドキュメントの作成・編集・閲覧
- シンタックスハイライト付きMarkdownプレビュー
- 日付やタグによるドキュメントの絞り込み
- ダーク/ライトテーマ対応
- ユーザープロファイル管理

## 技術スタック

- **バックエンド**: Ginフレームワークを用いたGo
- **フロントエンド**: React（TypeScript & Vite）
- **データベース**: MySQL
- **認証**: JWT

## クイックスタート

```bash
# Docker Composeで起動
docker-compose up

# アプリケーションへアクセス
# フロントエンド: http://localhost:3000
# バックエンドAPI: http://localhost:8080
```
