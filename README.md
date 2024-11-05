# order-management　アプリケーション

####  概要

order-managementアプリケーションは、Laravel BreezeとNext.jsを組み合わせたアプリケーションです。このリポジトリは、Laravel 11.6.0をバックエンド環境として使用し、フロントエンドをNext.jsで作成しております。認証機能にはLaravel Breezeを使用しています。

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
cd breeze_next_chikaraemon

#### 依存関係をインストール
npm install

#### 環境ファイルをコピー
cp .env.example .env.local

#### .env.localファイルを編集してバックエンドURLを設定
.env.localファイルに以下を貼り付ける
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

#### 開発サーバーを起動
npm run dev



### 4. ブラウザでアプリケーションにアクセスします。
http://localhost:3000



### 5. アプリケーションにログインします。
右上のloginをクリックする

以下を入力してLOGINボタンをクリックする
e-mail　hanako@yamada.com
パスワード　hanakoyamada

ナビゲーションメニューのPen Masterではペンの商品登録画面が表示され、
Order Masterではペンの受注情報、出荷状況が表示されます。
