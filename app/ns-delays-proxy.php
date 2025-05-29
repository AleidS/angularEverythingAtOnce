<?php
// credits to copilot :)


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