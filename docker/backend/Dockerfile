# バックエンドのDockerfile
# ベースイメージ
FROM php:8.2-fpm

# 必要な拡張機能をインストール
RUN apt-get update && apt-get install -y \
    libonig-dev \
    libzip-dev \
    unzip \
    tini \
    git \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-install pdo_mysql mbstring zip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Composerをインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# PHP-FPMの設定ファイルをコピー
# COPY docker/backend/php-fpm.conf /usr/local/etc/php-fpm.d/zz-log.conf

# アプリケーションコードをコピー
WORKDIR /var/www/html
COPY . .

# 必要なディレクトリを作成
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache \
    && mkdir -p /var/log \
    && touch /var/log/php-fpm.log /var/log/php-fpm.access.log \
    && chown -R www-data:www-data /var/log

# 依存関係をインストール
RUN composer install

# パーミッションの設定
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# ENTRYPOINTとCMDの設定
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["php-fpm"]
