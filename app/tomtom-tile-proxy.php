<?php
// also completely copilot :)) 

$env = parse_ini_file(__DIR__ . '/.env');
$apiKey = $env['TOMTOM_API_KEY'] ?? '';

if (!$apiKey) {
    http_response_code(500);
    echo "API key not set";
    exit;
}

// Parse the request URI to extract the tile path
$requestUri = $_SERVER['REQUEST_URI'];
$matches = [];
// Example: /tomtom-tile-proxy.php/flow/relative/10/526/339.png
if (preg_match('#tomtom-tile-proxy\.php/([^/]+)/([^/]+)/(\d+)/(\d+)/(\d+)\.(png|pbf)#', $requestUri, $matches)) {
    $type = $matches[1];      // flow or incidents
    $style = $matches[2];     // relative, absolute, s0, s1, etc.
    $z = $matches[3];
    $x = $matches[4];
    $y = $matches[5];
    $format = $matches[6];
} else {
    http_response_code(400);
    echo "Invalid tile path";
    exit;
}

// Build the TomTom tile URL
if ($type === 'flow') {
    $tileUrl = "https://api.tomtom.com/traffic/map/4/tile/flow/$style/$z/$x/$y.$format?key=$apiKey";
    if (isset($_GET['roadTypes'])) $tileUrl .= "&roadTypes=" . urlencode($_GET['roadTypes']);
    if (isset($_GET['thickness'])) $tileUrl .= "&thickness=" . urlencode($_GET['thickness']);
} elseif ($type === 'incidents') {
    $tileUrl = "https://api.tomtom.com/traffic/map/4/tile/incidents/$style/$z/$x/$y.$format?key=$apiKey";
    if (isset($_GET['t'])) $tileUrl .= "&t=" . urlencode($_GET['t']);
    if (isset($_GET['thickness'])) $tileUrl .= "&thickness=" . urlencode($_GET['thickness']);
} else {
    http_response_code(400);
    echo "Invalid type";
    exit;
}

// Fetch the tile from TomTom
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $tileUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);

$response = curl_exec($ch);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

if (curl_errno($ch)) {
    http_response_code(500);
    echo curl_error($ch);
} else {
    header("Content-Type: $contentType");
    echo $response;
}
curl_close($ch);