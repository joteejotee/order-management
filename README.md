# order-management 　アプリケーション

## 概要

このアプリケーションは、ペンの専門店向けの商品管理と受注管理を目的としています。バックエンドには Laravel 11.30.0、フロントエンドには Next.js 15.3.1 を使用し、Laravel Breeze による認証機能を実装。ユーザーは顧客、ペン、注文情報の登録・編集・削除、出荷ステータスの管理が可能です。また、可読性の向上のため、顧客やペン、注文の一覧表示にはページネーション機能を搭載しています。

**Docker のみ**で、面倒なセットアップ不要・数分で動作確認できます。

## 主な機能

-   **ユーザー認証**（登録・ログイン・ログアウト）
-   **顧客管理**（登録・編集・削除）
-   **ペン管理**（登録・編集・削除）
-   **注文管理**（登録・編集・削除）
-   **出荷管理**（注文の出荷ステータス管理）
-   **ページネーション**（顧客・ペン・注文一覧）
-   **レスポンシブデザイン**
-   **API 連携**（Laravel バックエンドと Next.js フロントエンド）
-   **環境変数による設定管理**
-   **Vercel デプロイ対応**

---

## 動作確認方法

### 本番環境（Vercel + EC2）

-   下記 URL にアクセスしてください（例）  
    `https://your-vercel-or-ec2-domain/`
-   ※ 本番環境の URL は運用状況により異なります。面接時などは事前にご案内します。

**ログイン情報（初期ユーザー）**

-   メールアドレス: `test@example.com`
-   パスワード: `Test1234`

### ローカル（Docker）

-   この README の手順に従い、Docker でご自身の PC 上で起動・動作確認できます。

---

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
cd breeze_next_chikaraemon
cp .env.example .env.local
cd ..
```

### ③ Docker コンテナを起動

```sh
docker-compose up --build
```

-   初回起動時は依存パッケージのインストール・DB 初期化（マイグレーション＆シード）が自動で行われます。
-   起動完了まで数分かかる場合があります。

---

## 3. アクセス方法

-   フロントエンド: [http://localhost:3000](http://localhost:3000)
-   バックエンド API: [http://localhost:8000](http://localhost:8000)

---

## 4. ログイン情報（初期ユーザー）

-   メールアドレス: `test@example.com`
-   パスワード: `Test1234`

---

## 5. トラブルシュート

-   **ポート競合エラー**
    　 → 3000 番/8000 番ポートを使用中のアプリがないかご確認ください。
-   **Docker Desktop 未起動**
    　 → Docker Desktop を起動してから再度お試しください。
-   **DB 初期化に失敗した場合**
    　 → 下記コマンドで手動実行できます:
    　　`docker-compose exec backend php artisan migrate --seed`

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
-   ほか: zod, React Hook Form, shadcn/ui, Lucide, Postman, Git, GitHub
