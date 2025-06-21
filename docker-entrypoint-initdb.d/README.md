# docker-entrypoint-initdb.d

このディレクトリは、MySQL コンテナの初回起動時に自動で実行される初期化スクリプトを配置するためのものです。

## initDB.sql
- テストDBの作成などDBの初期化を行う SQL スクリプトを配置します。

## Docker Compose との関係

このディレクトリは `docker-compose.yml` で以下のようにマウントされます：

```yaml
services:
  db:
    image: mysql:8.0
    volumes:
      - ./docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d
