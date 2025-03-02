#!/bin/bash

# EC2インスタンスへのデプロイスクリプト
# 使用方法: ./deploy-aws.sh [EC2_HOST] [SSH_KEY_PATH]

EC2_HOST=$1
SSH_KEY=$2

if [ -z "$EC2_HOST" ] || [ -z "$SSH_KEY" ]; then
  echo "使用方法: ./deploy-aws.sh [EC2_HOST] [SSH_KEY_PATH]"
  exit 1
fi

# 必要なファイルをEC2インスタンスに転送
echo "ファイルを転送中..."
rsync -avz --exclude 'node_modules' \
  --exclude 'vendor' \
  --exclude '.git' \
  --exclude 'storage/framework/cache/*' \
  --exclude 'storage/framework/sessions/*' \
  --exclude 'storage/framework/views/*' \
  --exclude 'storage/logs/*' \
  --exclude 'breeze_next_chikaraemon' \
  -e "ssh -i $SSH_KEY" \
  ./ ec2-user@$EC2_HOST:/var/www/html/

# EC2インスタンスでコマンドを実行
echo "EC2インスタンスでセットアップを実行中..."
ssh -i $SSH_KEY ec2-user@$EC2_HOST << 'EOF'
  cd /var/www/html
  composer install --no-dev --optimize-autoloader
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  php artisan migrate --force
  sudo chown -R nginx:nginx /var/www/html/storage
  sudo systemctl restart php-fpm
  sudo systemctl restart nginx
EOF

echo "デプロイが完了しました！" 