#!/bin/bash
# LaravelのECサーバー修正スクリプト

# SSH接続する関数
ssh_ec2() {
  ssh -i ~/.ssh/ec2-laravel-key.pem -o StrictHostKeyChecking=no ec2-user@18.181.207.55 "$@"
}

echo "=== Laravelのログディレクトリの権限を修正しています ==="
ssh_ec2 "sudo chown -R nginx:nginx /usr/share/nginx/html/storage && sudo chmod -R 775 /usr/share/nginx/html/storage && echo '権限を修正しました'"

echo "=== Laravelのキャッシュをクリアしています ==="
ssh_ec2 "cd /usr/share/nginx/html && sudo -u nginx php artisan config:clear && sudo -u nginx php artisan cache:clear && sudo -u nginx php artisan view:clear && echo 'キャッシュをクリアしました'"

echo "=== 新しいユーザーを作成しています ==="
ssh_ec2 "cd /usr/share/nginx/html && sudo -u nginx php artisan tinker --execute=\"
\\App\\Models\\User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => \\Illuminate\\Support\\Facades\\Hash::make('password'),
    'email_verified_at' => now()
]);
echo 'ユーザーを作成しました';
\""

echo "=== 完了しました ===" 