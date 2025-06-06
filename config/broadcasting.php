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
        'port' => env('REVERB_PORT', 8080),  // 👈 ya está bien
        'scheme' => env('REVERB_SCHEME', 'http'),  // 👈 CORREGIDO de https a http
        'useTLS' => false, // 👈 DESACTIVA TLS porque estás usando http
    ],
],


        'null' => [
            'driver' => 'null',
        ],
    ],
];
