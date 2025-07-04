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

このアプリケーションは、ボールペンなどの筆記用具店向けの商品管理と注文管理を目的としています。バックエンドには Laravel 11.30.0、フロントエンドには Next.js 15.3.1 を使用し、Laravel Breeze による認証機能を実装。ユーザーは商品や注文情報の登録・編集・削除、出荷ステータスの管理が可能です。また、可読性の向上のため、商品、注文の一覧表示にはページネーション機能を搭載しています。

Docker のみで、面倒なセットアップ不要・数分で動作確認できます。

## 主な機能

### 機能一覧

-   **ユーザー認証機能(Laravel Sanctum)**

    -   ログイン・ログアウト機能
    -   CSRF 保護
    -   セッション管理

-   **商品管理機能**

    -   商品登録・編集・削除(CRUD)
    -   商品詳細表示
    -   在庫管理

-   **注文管理機能**

    -   注文登録・編集・削除(CRUD)
    -   顧客・商品選択
    -   注文数量管理

-   **出荷管理機能**

    -   出荷ステータス管理(未出荷/出荷済み)
    -   ワンクリック出荷操作（axios 非同期処理）
    -   出荷状況一覧表示

-   **ダッシュボード機能(Chart.js)**

    -   商品数・注文数統計表示
    -   週別・月別売上グラフ
    -   売れ筋商品 TOP5 表示
    -   在庫切れ・低在庫商品アラート

-   **ページネーション機能**

    -   ページ数・件数表示

-   **フロントエンドバリデーション**

    -   **Zod**: スキーマ定義・型安全性・バリデーションルール
    -   **React Hook Form(RHF)**: フォーム状態管理・UI 制御・ユーザー操作
    -   リアルタイムバリデーション
    -   エラーメッセージ表示

-   **非同期通信機能(axios)**

    -   カスタム axios インスタンス
    -   リクエストキャンセル機能
    -   エラーハンドリング
    -   認証ヘッダー自動付与

-   **データベース機能(MySQL)**

    -   トランザクション管理
    -   外部キー制約
    -   Eager Loading によるパフォーマンス最適化

-   **CI/CD・デプロイ機能**

    -   **GitHub Actions**によるEC2への自動デプロイ(バックエンド)
    -   **Vercel for GitHub**によるVercelへの自動デプロイ(フロントエンド)
    -   **GitHub Actions Secrets**（SSH キー・環境変数の暗号化管理）
    -   Docker 対応(Docker Compose)
    -   マルチコンテナ構成(Frontend/Backend/DB/Nginx)

-   **テスト機能**
    -   バックエンド API テスト(PestPHP)
    -   E2E テスト(Laravel Dusk)
    -   フロントエンドコンポーネントテスト(Jest + React Testing Library)
    -   ブラウザ自動化テスト(Playwright)

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
        `docker compose exec nextjs-backend-1 php artisan migrate:fresh --seed`

---

## 7. 画面一覧

| ログイン画面                                         | ダッシュボード画面                                                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ![ログイン画面](./docs/screenshots/login.png)        | ![ダッシュボード画面](./docs/screenshots/dashboard.png)                                                                              |
| ログイン ID とパスワードでの認証機能を実装しました。 | 商品数、未出荷・出荷済み注文数の統計表示、週別・月別売上グラフ、売れ筋商品 TOP5、在庫切れ商品・在庫 5 個以下の商品一覧を表示します。 |

| 商品一覧画面                                     | 注文一覧画面                                       |
| ------------------------------------------------ | -------------------------------------------------- |
| ![商品一覧画面](./docs/screenshots/pen-list.png) | ![注文一覧画面](./docs/screenshots/order-list.png) |
| 登録済みの商品の一覧表示機能を実装しました。     | 登録済みの注文の一覧表示機能を実装しました。       |

| 商品編集画面                                           | 注文編集画面                                                   |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| ![商品編集画面](./docs/screenshots/pen-edit.png)       | ![注文編集画面](./docs/screenshots/order-edit.png)             |
| 商品情報を入力して、保存ボタンをクリックしてください。 | 顧客と商品、数量を入力して、登録ボタンをクリックしてください。 |

| 商品新規登録画面                                       | 注文新規登録画面                                               |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| ![商品新規登録画面](./docs/screenshots/pen-create.png) | ![注文新規登録画面](./docs/screenshots/order-create.png)       |
| 商品情報を入力して、保存ボタンをクリックしてください。 | 顧客と商品、数量を入力して、登録ボタンをクリックしてください。 |

---

## 8. 技術スタック

-   Laravel 11.30.0
-   Next.js 15.3.1 (App Router)
-   React 18.3.1
-   TypeScript 5.5.4
-   TailwindCSS 3.4.1
-   zod 3.22.4
-   React Hook Form 7.53.2
-   shadcn/ui 0.0.4
-   ESLint 8.57.1
-   Prettier 3.5.3
-   MySQL 8.0
-   Docker/Docker Compose
-   Git/GitHub
-   GitHub Actions
-   GitHub Actions Secrets
-   他: Lucide, Postman

### テスト環境

-   **バックエンド API**: PestPHP（Laravel 用 API テスト・ユニットテスト）
-   **バックエンド E2E**: Laravel Dusk（サーバーサイドブラウザ自動化テスト）
-   **フロントエンド**: Jest + React Testing Library（React コンポーネントテスト）
-   **フロントエンド E2E**: Playwright（クライアントサイドブラウザ自動化テスト）
-   **テストカバレッジ**: PestPHP・Jest Coverage Report 対応

---

## 9. システム構成図

-   以下は、本アプリケーションの全体的なシステム構成を示した図です。
-   Vercel でホストされたフロントエンド（Next.js）と、AWS EC2 上の Docker コンテナ群（Laravel + MySQL + Nginx）で構成されています。

![architecture](./docs/order-management-architecture.drawio.png)

---

## 10. ER 図

-   このアプリケーションでは、以下のようなエンティティ関係図に基づいてデータベースを設計しています。
    -   customers・orders・pens は、注文フローの中核を担う 3 テーブルで構成
    -   users テーブルはログイン認証用で、現在は初期ユーザー 1 名のみ作成
    -   外部キー制約により、データ整合性を保っています

![architecture](./docs/order-management-schema.png)

---

## . License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
