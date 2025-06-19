-- ユーザーテーブル
CREATE TABLE users (
  id           CHAR(36) PRIMARY KEY,              -- UUID
  email        VARCHAR(255) NOT NULL UNIQUE,
  authorName   VARCHAR(100) NOT NULL,
  uiTheme      VARCHAR(10) NOT NULL DEFAULT 'light',
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- ドキュメントテーブル
CREATE TABLE docs (
  id         CHAR(36) PRIMARY KEY,                -- UUID
  title      VARCHAR(100) NOT NULL,
  content    MEDIUMTEXT,                          -- Markdown
  snippet    VARCHAR(100),                        -- content冒頭100文字
  authorId   CHAR(36) NOT NULL,
  editedAt   DATETIME(3),                         -- アプリ側で更新
  createdAt  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
             ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_docs_author FOREIGN KEY (authorId)
             REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_tags_json CHECK (JSON_VALID(tags))
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- タグ
CREATE TABLE tags (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ドキュメント×タグ（多対多）
CREATE TABLE doc_tags (
  doc_id CHAR(36) NOT NULL,
  tag_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (doc_id, tag_id),
  CONSTRAINT fk_dt_doc FOREIGN KEY (doc_id) REFERENCES docs(id) ON DELETE CASCADE,
  CONSTRAINT fk_dt_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
