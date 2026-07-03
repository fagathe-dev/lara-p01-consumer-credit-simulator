<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | SEO
    |--------------------------------------------------------------------------
    |
    | Values injected into `resources/data/seo.json` placeholders resolved by
    | App\Services\SeoService (e.g. {{ GOOGLE_SITE_VERIFICATION }}). The theme
    | color mirrors the Design System PRIMARY token (mauve).
    |
    */
    'seo' => [
        'google_site_verification' => env('GOOGLE_SITE_VERIFICATION', ''),
        'bing_site_verification' => env('BING_SITE_VERIFICATION', ''),
        'theme_color' => env('THEME_COLOR', '#966F97'),
    ],

];
