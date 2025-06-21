# 1. ビルドステージ (Build)
FROM golang:1.23 AS builder

WORKDIR /app

# モジュールをキャッシュするため、依存関係のみを先にコピー
# これにより、変更がない場合はモジュールのキャッシュが再利用され、ビルド速度が向上
COPY go.mod go.sum ./
RUN go mod download

# アプリケーションコードをコピーしてビルド
COPY . .
RUN go build -o app ./cmd/app

# 2. 実行ステージ (Run)
FROM gcr.io/distroless/base-debian12 AS runner

WORKDIR /root/

# ビルド済みバイナリのみをコピー (不要なファイルを含めない)
COPY --from=builder /app/app .

# 実行
CMD ["./app"]
