# ペン注文管理システム

## デプロイ版へのアクセス

-   フロントエンド: [Vercel URL]
-   バックエンド API: [AWS URL]

## 技術スタック

-   フロントエンド:
    -   Next.js v14.1.0 (App Router)
    -   TypeScript
    -   TailwindCSS
    -   zod, React Hook Form, shadcn/ui, Lucide
    -   ESLint, Prettier
-   バックエンド:
    -   Laravel 11.30.0
    -   MySQL
-   インフラ:
    -   開発環境: Docker/Docker Compose
    -   本番環境: Vercel (フロントエンド), AWS (バックエンド)

## 機能一覧

-   ユーザー認証
-   ペンマスター管理
-   注文管理
-   出荷状態管理

## ローカル開発環境のセットアップ

### 前提条件

-   Docker がインストールされていること
-   Docker Compose がインストールされていること

### セットアップ手順

1. リポジトリのクローン

-   git clone [リポジトリ URL]
-   cd [プロジェクト名]

2. 環境ファイルの準備

-   cp .env.example .env
-   cp breeze_next_chikaraemon/.env.example breeze_next_chikaraemon/.env.local

3. Docker コンテナの起動

-   docker-compose up -d

4. Laravel 環境のセットアップ

-   docker-compose exec backend composer install
-   docker-compose exec backend php artisan key:generate
-   docker-compose exec backend php artisan migrate --seed

5. アプリケーションへのアクセス

-   バックエンド: http://localhost:8000
-   フロントエンド: http://localhost:3000

6. ログイン情報

-   Email: test@example.com
-   Password: Test1234

## デプロイ方法

### フロントエンド (Vercel)

1. Vercel アカウントを作成
2. GitHub リポジトリと連携
3. 環境変数の設定
    - NEXT_PUBLIC_BACKEND_URL=[バックエンドの URL]

### バックエンド (AWS)

1. EC2 インスタンスのセットアップ
2. RDS データベースの構築
3. Laravel 環境の構築
4. 環境変数の設定
    - APP_URL=[バックエンドの URL]
    - FRONTEND_URL=[フロントエンドの URL]
    - DB\_\*=[データベース接続情報]
