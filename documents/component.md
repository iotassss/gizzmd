# コンポーネント構成

## Components

### App
アプリケーション
- BrowserRouter
    - App
        - Routers
            - Route / Layout
                - Route index Docs
                - Route /doc/:uuid Doc
                    - Route index View
                    - Route /edit Edit
                    - Route /preview Preview
                - Route /mypage Mypage

### Layout
共通部分のコンポーネント構成
- Sidebar
    - SidebarHeader
        - Logo
    - QuickActions（新規作成ボタンなど）
    - RecentDocs（最近のドキュメント）
- Main
    - MainHeader
        - UserMenu（ログアウト、設定など）
    - Outlet（各ページのコンテンツ表示エリア）
    - MainFooter
        - Copyright
        - Links（利用規約、プライバシーポリシーなど）

### Docs
ドキュメント一覧画面の構成
- DocsHeader
    - CreateDocButton（新規作成ボタン）
    - SearchBar（検索機能）
- DocsFilter
    - SortOptions（作成日、更新日、タイトル順）
    - FilterTags（タグによる絞り込み）
- DocsList
    - DocCard（各ドキュメントのカード）
        - DocTitle
        - DocPreview（内容のプレビュー）
        - DocMeta（作成日、更新日、タグ）
        - DocActions（編集、削除、共有ボタン）
- Pagination

### Doc
ドキュメント詳細画面の構成
- DocHeader
    - DocTitle
    - DocMeta
        - AuthorInfo
        - CreatedDate
        - UpdatedDate
    - DocActions
        - ShareButton(Phase2)
        - DeleteButton
        - MoreActionsMenu(Phase2)
- DocNavigation
    - TabMenu
        - ViewTab
        - EditTab
        - PreviewTab
- DocContent
    - Outlet（ViewまたはEditまたはPreviewコンポーネント）
- DocSidebar
    - TableOfContents
        - TOCItem
    - DocTags
        - TagItem
    - RelatedDocs
        - RelatedDocItem

### View（Docの子ルート）
- ViewContent
    - RenderedDocument
        - DocumentSection
        - DocumentImage
        - DocumentTable

### Edit（Docの子ルート）
- EditHeader
    - SaveButton
    - EditingStatus（編集中です/保存済み）
- Editor
    - TextArea

### Preview（Docの子ルート）
- PreviewHeader
    - EditingStatus（編集中です/保存済み）
- PreviewContent
    - RenderedDocument（整形済み表示）

### MyPage
マイページ画面の構成
Phase1では固定ユーザーを使用し編集しない
- UserInfoSection
    - UserProfile
        - UserName
        - UserId
        - EditProfileButton(Phase2)
    - PasswordSection
        - ChangePasswordButton
    - AvatarSection（Phase2）
        - AvatarImage
- SettingsSection
    - ThemeSettings
        - ThemeModeToggle（ダークモード/ライトモード）
