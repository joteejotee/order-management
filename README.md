# order-management 　アプリケーション

## 概要

このアプリケーションは、ペンの専門店向けの商品管理と受注管理を目的としています。バックエンドには Laravel 11.30.0、フロントエンドには Next.js 15.3.1 を使用し、Laravel Breeze による認証機能を実装。ユーザーは顧客、ペン、注文情報の登録・編集・削除が可能で、出荷ステータスを管理します。また、効率的なデータ管理のため、顧客やペン、注文の一覧表示にはページネーション機能を搭載しています。

#### 機能と実装

-   **ユーザー認証**: ユーザー登録、ログイン、ログアウト機能を実装。
-   **顧客管理**: 顧客情報の登録、編集、削除が可能。
-   **ペン管理**: ペンの情報を登録、編集、削除が可能。
-   **注文管理**: 注文の登録、編集、削除が可能。
-   **出荷管理**: 注文の出荷ステータスを管理。
-   **ページネーション**: 顧客、ペン、注文の一覧表示にページネーションを実装。
-   **レスポンシブデザイン**: モバイルデバイスでも利用可能。
-   **API 連携**: Laravel バックエンドと Next.js フロントエンドの API 連携。
-   **環境設定**: 環境変数を使用してアプリケーションの設定を管理。
-   **デプロイ**: Vercel を使用。

## ローカルでの動かし方

### 前提条件

-   Node.js がインストールされていること
-   Composer がインストールされていること
-   PHP がインストールされていること
-   MySQL などのデータベースがインストールされていること

## インストール手順

### 1. リポジトリをクローンします。

`git clone https://github.com/joteejotee/order-management.git`

### 2. Laravel バックエンドをセットアップします。

#### ルートディレクトリで Composer の依存関係をインストール

composer install

#### 環境ファイルをコピー

`cp .env.example .env`

#### .env ファイルに以下を貼り付けて、データベース接続情報を設定

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

#### MySQL を起動し、データベースマイグレーションとシードを実行

`php artisan migrate --seed`

#### サーバーを起動

`php artisan serve`

#### サーバーの起動を確認

ブラウザで、`http://localhost:8000`　にアクセスして laravel のバージョン表示がされていれば起動済み

### 3. Next.js フロントエンドをセットアップします。

#### Next.js のディレクトリに移動

`cd breeze_next_chikaraemon`

#### 依存関係をインストール

`npm install`

#### 環境ファイルをコピー

`cp .env.example .env.local`

#### .env.local ファイルを編集してバックエンド URL を設定

.env.local ファイルに以下を貼り付ける
`NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`

#### 開発サーバーを起動

`npm run dev`

### 4. ブラウザでアプリケーションにアクセスします。

`http://localhost:3000`

### 5. アプリケーションにログインします。

右上の login をクリックする

以下を入力して LOGIN ボタンをクリックする

e-mail
`test@example.com`

パスワード
`Test1234`

## 技術スタック

-   Laravel 11.30.0
-   Next.js 15.3.1 (App Router)
-   React 18.3.1
-   TypeScript 5.5.4
-   TailwindCSS 3.4.1
-   ESLint 8.57.1
-   Prettier 3.5.3
-   MySQL 8.0
-   ほか: zod, React Hook Form, shadcn/ui, Lucide, Postman, Git, GitHub
