# order-management アプリケーション

[![Laravel](https://img.shields.io/badge/Laravel-v11.30.0-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![Next.js](https://img.shields.io/badge/Next.js-v15.3.1-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-v18.3.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-v8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![ESLint](https://img.shields.io/badge/ESLint-v8.57.1-4B32C3?logo=eslint&logoColor=white)](https://eslint.org)
[![Prettier](https://img.shields.io/badge/Prettier-v3.5.3-F7B93E?logo=prettier&logoColor=white)](https://prettier.io)

## 概要

このアプリケーションは、ボールペンなどの筆記用具店向けの商品管理と受注管理を目的としています。バックエンドには Laravel 11.30.0、フロントエンドには Next.js 15.3.1 を使用し、Laravel Breeze による認証機能を実装。ユーザーは商品や注文情報の登録・編集・削除、出荷ステータスの管理が可能です。また、可読性の向上のため、商品、注文の一覧表示にはページネーション機能を搭載しています。

Docker のみで、面倒なセットアップ不要・数分で動作確認できます。

## 主な機能

-   **ユーザー認証**（ログイン・ログアウト）
-   **ペン管理**（登録・編集・削除）
-   **注文管理**（登録・編集・削除）
-   **出荷管理**（出荷・未出荷で出荷ステータス管理）
-   **ページネーション**（商品一覧・注文一覧）
-   **API 連携**（Laravel バックエンドと Next.js フロントエンド）
-   **環境変数による設定管理**
-   **Vercel デプロイ対応**

---

## 動作確認方法

## 本番環境（Vercel + EC2）

-   下記 URL にアクセスしてください
    [https://www.order-management1.com](https://www.order-management1.com)

**ログイン情報（初期ユーザー）**

-   メールアドレス: `test@example.com`
-   パスワード: `Test1234`

## ローカル環境（Docker）

-   この README の手順に従い、Docker でご自身の PC 上で起動・動作確認できます。

## 1. 前提条件

-   Docker Desktop（または Docker Engine）がインストール済みであること
-   docker-compose が利用可能であること

---

## 2. セットアップ手順

### ① リポジトリをクローン

```sh
git clone https://github.com/joteejotee/order-management.git
cd order-management
```

### ② 環境変数ファイルをコピー

```sh
cp .env.example .env
cp .dockerignore.dev .dockerignore
cd breeze_next_chikaraemon
cp .env.example .env.local
cd ..
```

### ③ Docker コンテナを起動・マイグレーション・シード

```sh
docker-compose up --build -d
docker compose exec nextjs-backend-1 composer install
docker compose exec nextjs-backend-1 php artisan key:generate
docker compose exec nextjs-backend-1 php artisan migrate --seed
```

-   起動完了まで数分かかる場合があります。

---

## 3. アクセス方法

-   下記 URL にアクセスしてください
    [http://localhost:3000](http://localhost:3000)

---

## 4. ログイン情報（初期ユーザー）

-   メールアドレス: `test@example.com`
-   パスワード: `Test1234`

---

## 5. トラブルシュート

-   **ポート競合エラー**
    -   3000 番/8000 番ポートを使用中のアプリがないかご確認ください。
-   **Docker Desktop 未起動**
    -   Docker Desktop を起動してから再度お試しください。
-   **DB 初期化に失敗した場合**
    -   もう一度下記コマンドの実行をお試しください:
        `docker compose exec nextjs-backend-1 php artisan migrate --seed`

---

## 6. 技術スタック

-   Laravel 11.30.0
-   Next.js 15.3.1 (App Router)
-   React 18.3.1
-   TypeScript 5.5.4
-   TailwindCSS 3.4.1
-   ESLint 8.57.1
-   Prettier 3.5.3
-   MySQL 8.0
-   Git/GitHub
-   GitHub Actions（CI/CD 自動化）
-   GitHub Actions Secrets（機密情報管理）
-   他: zod, React Hook Form, shadcn/ui, Lucide, Postman
