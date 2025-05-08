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

# 作業ディレクトリ作成
WORKDIR /var/www/html

# 依存ファイルのみ先にコピーしてcomposer installのキャッシュを活用
COPY composer.json composer.lock ./
COPY . .
RUN ls -l /var/www/html
RUN composer install --no-dev --optimize-autoloader

# 必要なディレクトリを作成
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache \
    && mkdir -p /var/log \
    && touch /var/log/php-fpm.log /var/log/php-fpm.access.log \
    && chown -R www-data:www-data /var/log

# パーミッションの設定
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# ENTRYPOINTとCMDの設定
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["php-fpm"]
