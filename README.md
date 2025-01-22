# ペン注文管理システム

## 前提条件
- Dockerがインストールされていること
- Docker Composeがインストールされていること

## セットアップ手順

1. リポジトリのクローン
- git clone [リポジトリURL]
- cd [プロジェクト名]

2. 環境ファイルの準備
- cp .env.example .env
- cp breeze_next_chikaraemon/.env.example breeze_next_chikaraemon/.env.local

3. Dockerコンテナの起動
- docker-compose up -d

4. Laravel環境のセットアップ
- docker-compose exec backend composer install
- docker-compose exec backend php artisan key:generate
- docker-compose exec backend php artisan migrate --seed

5. アプリケーションへのアクセス
- バックエンド: http://localhost:8000
- フロントエンド: http://localhost:3000

6. ログイン情報
- Email: test@example.com
- Password: Test1234

## 機能一覧
- ユーザー認証
- ペンマスター管理
- 注文管理
- 出荷状態管理

## 技術スタック
- Laravel 11.30.0
- Next.js v14.1.0 (App Router)
- MySQL
- Docker/Docker Compose
- TailwindCSS
- TypeScript
- zod, React Hook Form, shadcn/ui, Lucide
- ESLint, Prettier