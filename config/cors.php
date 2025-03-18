<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://www.order-management1.com',
        'https://order-management1.com',
        'http://localhost:3000',
        'https://order-management-frontend.vercel.app',
        'https://order-management-git-frontend-integration-joteejotee.vercel.app',
        'https://order-management-joteejotee.vercel.app'
    ],
    'allowed_origins_patterns' => [
        'https://order-management-.*\.vercel\.app'
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
