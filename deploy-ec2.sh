#!/bin/bash

# EC2のホスト名またはIPアドレス
EC2_HOST="18.181.207.55"
# EC2のユーザー名
EC2_USER="ec2-user"
# EC2上のデプロイ先ディレクトリ
DEPLOY_DIR="/usr/share/nginx/html"
# SSHキーのパス
SSH_KEY="/Users/jo-m1/.ssh/ec2-laravel-key.pem"

# rsyncでファイルを転送
rsync -avz --exclude '.git' --exclude '.github' \
  --exclude 'breeze_next_chikaraemon' \
  --exclude '.vscode' --exclude '.DS_Store' \
  --exclude '.next' --exclude 'node_modules' \
  --exclude 'docker' --exclude 'docker-compose.yml' \
  --exclude '.vercel' --exclude 'vercel.json' \
  --exclude 'deploy-aws.sh' --exclude '.env.local' \
  --exclude '.cursorrules' --exclude 'api-test.http' \
  --exclude 'README_LOCAL.md' \
  --exclude 'deploy-ec2.sh' \
  --exclude '.env' \
  -e "ssh -i ${SSH_KEY}" \
  ./ ${EC2_USER}@${EC2_HOST}:${DEPLOY_DIR}/

# キャッシュクリアなどのコマンドを実行
ssh -i ${SSH_KEY} ${EC2_USER}@${EC2_HOST} "cd ${DEPLOY_DIR} && \
  php artisan cache:clear && \
  php artisan route:clear && \
  php artisan config:clear && \
  php artisan optimize"

echo "デプロイが完了しました！" 