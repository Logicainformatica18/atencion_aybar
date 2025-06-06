<?php

return [

    'default' => env('BROADCAST_DRIVER', 'reverb'),

    'connections' => [

        'reverb' => [
            'driver' => 'reverb',
            'key' => env('REVERB_APP_KEY'),
            'secret' => env('REVERB_APP_SECRET'),
            'app_id' => env('REVERB_APP_ID'),
           'options' => [
    'host' => env('REVERB_HOST', '127.0.0.1'),
    'port' => env('REVERB_PORT', 443),
    'scheme' => env('REVERB_SCHEME', 'https'),
    'useTLS' => true, // ✅ porque ahora Laravel habla con Cloudflare, no con localhost
],
'client_options' => [
    'verify' => true, // ✅ Cloudflare sí usa SSL válido
],

        ],

        'null' => [
            'driver' => 'null',
        ],
    ],
];
