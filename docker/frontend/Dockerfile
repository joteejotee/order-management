# フロントエンドのDockerfile
FROM node:18-alpine

WORKDIR /app

# 環境変数を設定
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
ENV NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
ENV PATH $PATH:/app/node_modules/.bin

# アプリケーションファイルを先にコピー
COPY breeze_next_chikaraemon/ .

# 依存関係をインストール
RUN npm install --legacy-peer-deps
RUN npm install next@13.4.19 react@18.2.0 react-dom@18.2.0 --legacy-peer-deps

EXPOSE 3000

CMD ["npx", "next", "dev"]
