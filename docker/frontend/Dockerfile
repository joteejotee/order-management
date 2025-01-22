# フロントエンドのDockerfile
FROM node:18-alpine

WORKDIR /app

# 環境変数を設定
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
ENV NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# パッケージファイルをコピー
COPY breeze_next_chikaraemon/package*.json ./

# 依存関係をインストール（--legacy-peer-depsフラグを追加）
RUN npm install --legacy-peer-deps

# アプリケーションファイルをコピー
COPY breeze_next_chikaraemon/ .

EXPOSE 3000

CMD ["npm", "run", "dev"]
