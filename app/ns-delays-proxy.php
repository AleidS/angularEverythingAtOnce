<?php
// credits to copilot :)

$env = parse_ini_file(__DIR__ . '/.env');
$appEnv = $env['APP_ENV'] ?? 'local';


$allowedOrigins = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    'http://localhost:54797',
    // Add more allowed origins here
];
if ($appEnv === 'production') {
    $allowedOrigins = [
        'https://your-production-domain.com',
        // Add more production origins here
    ];
};


if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Headers: Ocp-Apim-Subscription-Key, Content-Type');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
}
$env = parse_ini_file(__DIR__ . '/.env');
$apiKey = $env['NS_API_KEY'] ?? '';

// Build the external API URL
$apiUrl = 'https://gateway.apiportal.ns.nl/Spoorkaart-API/api/v1/storingen.geojson?actual=true';

// Set up the request with headers
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Ocp-Apim-Subscription-Key: $apiKey"
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => curl_error($ch)]);
} else {
    header('Content-Type: application/json');
    echo $response;
}

curl_close($ch);