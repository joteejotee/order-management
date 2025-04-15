# フロントエンドのDockerfile
FROM node:20-bullseye

WORKDIR /app

# 環境変数を設定
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_BACKEND_URL=http://nginx
ENV NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
ENV HOST=0.0.0.0
ENV PORT=3000

# ユーザーとグループの作成（Debian方式）
RUN groupadd -g 2000 appgroup && \
    useradd -u 2000 -g appgroup -s /bin/sh -m appuser

# package.jsonをコピー
COPY --chown=appuser:appgroup ./breeze_next_chikaraemon/package*.json ./

# npmを最新版にアップデート
RUN npm install -g npm@latest

# 依存関係をインストール（npmを使用）
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# アプリケーションファイルをコピー
COPY --chown=appuser:appgroup ./breeze_next_chikaraemon .

# TypeScriptの設定
COPY --chown=appuser:appgroup ./breeze_next_chikaraemon/tsconfig.json ./tsconfig.json

# パーミッションを設定
RUN chown -R appuser:appgroup /app && \
    chmod -R 755 /app && \
    chmod -R 755 node_modules/.bin

# PATHを設定
ENV PATH="/app/node_modules/.bin:/usr/local/bin:${PATH}"
ENV NODE_PATH="/app/node_modules"

# ユーザーを切り替え
USER appuser

EXPOSE 3000

# Next.jsの開発サーバーを起動
CMD ["npm", "run", "dev"]
