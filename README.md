# order-management　アプリケーション

## 概要

このアプリケーションは、バックエンドをLaravel 11.6.0、フロントエンドをNext.jsで作成しております。認証機能にはLaravel Breezeを使用しています。

#### 機能と実装
- **ユーザー認証**: ユーザー登録、ログイン、ログアウト機能を実装。
- **顧客管理**: 顧客情報の登録、編集、削除が可能。
- **ペン管理**: ペンの情報を登録、編集、削除が可能。
- **注文管理**: 注文の登録、編集、削除が可能。
- **出荷管理**: 注文の出荷ステータスを管理。
- **ページネーション**: 顧客、ペン、注文の一覧表示にページネーションを実装。
- **レスポンシブデザイン**: モバイルデバイスでも利用可能。
- **API連携**: LaravelバックエンドとNext.jsフロントエンドのAPI連携。
- **環境設定**: 環境変数を使用してアプリケーションの設定を管理。
- **デプロイ**: Vercelを使用。

## ローカルでの動かし方

### 前提条件

- Node.jsがインストールされていること
- Composerがインストールされていること
- PHPがインストールされていること
- MySQLなどのデータベースがインストールされていること


## インストール手順

### 1. リポジトリをクローンします。
`git clone https://github.com/joteejotee/order-management.git`　　

### 2. Laravelバックエンドをセットアップします。　　

#### ルートディレクトリに移動
`cd nextjs`　　

#### Composerの依存関係をインストール
`composer install`　　

#### 環境ファイルをコピー
`cp .env.example .env`　　

#### .envファイルに以下を貼り付けて、データベース接続情報を設定
```
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:TzzCxoQodblEZL7syitIA3ZwceWCyM5Axrc2q9UThnA=
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nextjs
DB_USERNAME=root
DB_PASSWORD=
```

#### データベースマイグレーションを実行
`php artisan migrate`

#### サーバーを起動
`php artisan serve`

#### サーバーの起動を確認
ブラウザで、`http://localhost:8000`　にアクセスしてlaravelのバージョン表示がされていれば起動済み

### 3. Next.jsフロントエンドをセットアップします。

#### Next.jsのディレクトリに移動
`cd breeze_next_chikaraemon`

#### 依存関係をインストール
`npm install`

#### 環境ファイルをコピー
`cp .env.example .env.local`

#### .env.localファイルを編集してバックエンドURLを設定
.env.localファイルに以下を貼り付ける
`NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`

#### 開発サーバーを起動
`npm run dev`

### 4. ブラウザでアプリケーションにアクセスします。
`http://localhost:3000`

### 5. アプリケーションにログインします。
右上のloginをクリックする

以下を入力してLOGINボタンをクリックする

e-mail
`hanako@yamada.com`

パスワード
`hanakoyamada`

## 技術スタック
- Laravel 11.30.0
- Next.js v14.1.0 (App Router)　
- TailwindCSS
- TypeScript
- MySQL
- Vercel
- ESLint, Perttier, Postman, Git, GitHub
