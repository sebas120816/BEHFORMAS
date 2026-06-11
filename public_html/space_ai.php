<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
require_once dirname(__DIR__) . '/beh_storage.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Metodo no permitido']);
    exit;
}

$clientIp = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = sys_get_temp_dir() . '/beh_space_ai_' . hash('sha256', $clientIp) . '.json';
$requests = is_file($rateFile) ? json_decode((string)file_get_contents($rateFile), true) : [];
$requests = is_array($requests) ? $requests : [];
$requests = array_values(array_filter($requests, static fn($timestamp) => (int)$timestamp >= time() - 3600));
if (count($requests) >= 8) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Alcanzaste el limite temporal de estudios. Intenta mas tarde.']);
    exit;
}

$prompt = trim((string)($_POST['prompt'] ?? ''));
$spaceType = trim((string)($_POST['space_type'] ?? 'Espacio corporativo'));
$style = trim((string)($_POST['style'] ?? 'Corporativo calido'));
$consent = (string)($_POST['consent'] ?? '');
$file = $_FILES['space_image'] ?? null;

if ($prompt === '' || mb_strlen($prompt) > 1200 || $consent === '' || !is_array($file) || (int)($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Sube una foto, completa el brief y autoriza su procesamiento.']);
    exit;
}

$configFile = dirname(__DIR__) . '/openai_config.php';
if (is_file($configFile)) {
    require_once $configFile;
}
$apiKey = getenv('OPENAI_API_KEY') ?: (defined('OPENAI_API_KEY') ? OPENAI_API_KEY : '');
$imageModel = getenv('OPENAI_IMAGE_MODEL') ?: (defined('OPENAI_IMAGE_MODEL') ? OPENAI_IMAGE_MODEL : 'gpt-image-2');
if ($apiKey === '' || str_contains($apiKey, 'replace-with')) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'error' => 'El generador de renders está pendiente de configuración por parte de BEH.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$storedAsset = null;
if (is_array($file)) {
    if ((int)$file['error'] !== UPLOAD_ERR_OK || (int)$file['size'] > 8 * 1024 * 1024) {
        http_response_code(413);
        echo json_encode(['ok' => false, 'error' => 'La imagen no pudo cargarse o supera 8 MB.']);
        exit;
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string)$finfo->file((string)$file['tmp_name']);
    $allowed = ['image/jpeg', 'image/png', 'image/webp'];
    $imageInfo = @getimagesize((string)$file['tmp_name']);
    if (!in_array($mime, $allowed, true) || !$imageInfo || ($imageInfo[0] * $imageInfo[1]) > 40000000) {
        http_response_code(415);
        echo json_encode(['ok' => false, 'error' => 'Usa una imagen JPG, PNG o WebP valida.']);
        exit;
    }

    $directory = dirname(__DIR__) . '/data/space_ai/originals';
    if (!is_dir($directory)) {
        mkdir($directory, 0750, true);
    }
    $sourceBytes = file_get_contents((string)$file['tmp_name']);
    $image = $sourceBytes !== false ? @imagecreatefromstring($sourceBytes) : false;
    if ($image === false) {
        http_response_code(415);
        echo json_encode(['ok' => false, 'error' => 'No fue posible validar el contenido de la imagen.']);
        exit;
    }

    $storedAsset = bin2hex(random_bytes(16)) . '.jpg';
    $storedPath = $directory . '/' . $storedAsset;
    $stored = imagejpeg($image, $storedPath, 88);
    if (!$stored) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'No fue posible proteger la imagen cargada.']);
        exit;
    }
}

$directionPrompt = implode("\n", [
    'Edita la fotografía original para crear una propuesta de interiorismo altamente fotorealista y fabricable por BEH.',
    'Tipo de espacio: ' . $spaceType . '.',
    'Dirección visual: ' . $style . '.',
    'Solicitud del cliente: ' . $prompt,
    'Conserva exactamente la perspectiva, encuadre, geometría estructural, accesos, ventanas, piso y techo visibles.',
    'Integra mobiliario de oficina, carpintería a medida, divisiones de vidrio y aluminio e iluminación solo cuando sean coherentes con el brief.',
    'Produce tres alternativas claramente distintas en distribución, materiales o lenguaje de diseño, manteniendo todas la misma cámara.',
    'Resultado: render arquitectónico profesional, realista, detallado, sobrio y ejecutable. Sin personas, sin texto, sin logos y sin marcas de agua.',
]);

$postFields = [
    'model' => $imageModel,
    'image[]' => new CURLFile($storedPath, 'image/jpeg', 'space.jpg'),
    'prompt' => $directionPrompt,
    'n' => '3',
    'size' => '1536x1024',
    'quality' => 'medium',
    'output_format' => 'jpeg',
    'output_compression' => '88',
];

$ch = curl_init('https://api.openai.com/v1/images/edits');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $apiKey],
    CURLOPT_POSTFIELDS => $postFields,
    CURLOPT_CONNECTTIMEOUT => 20,
    CURLOPT_TIMEOUT => 240,
]);
$response = curl_exec($ch);
$curlError = curl_error($ch);
$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false || $curlError !== '') {
    if (isset($storedPath) && is_file($storedPath)) {
        unlink($storedPath);
    }
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'No fue posible conectar con el generador de renders.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$decoded = json_decode($response, true);
$generated = is_array($decoded['data'] ?? null) ? $decoded['data'] : [];
if ($status < 200 || $status >= 300 || count($generated) < 1) {
    $providerMessage = trim((string)($decoded['error']['message'] ?? 'El proveedor no pudo generar propuestas.'));
    if (isset($storedPath) && is_file($storedPath)) {
        unlink($storedPath);
    }
    if (preg_match('/quota|billing|hard limit|insufficient/i', $providerMessage)) {
        $providerMessage = 'El estudio visual BEH está temporalmente en mantenimiento. Intenta nuevamente más tarde.';
    }
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => mb_substr($providerMessage, 0, 300)], JSON_UNESCAPED_UNICODE);
    exit;
}

$renderDirectory = dirname(__DIR__) . '/data/space_ai/renders';
if (!is_dir($renderDirectory)) {
    mkdir($renderDirectory, 0750, true);
}
$proposalTokens = [];
foreach (array_slice($generated, 0, 3) as $item) {
    $bytes = base64_decode((string)($item['b64_json'] ?? ''), true);
    if ($bytes === false || strlen($bytes) < 1000) {
        continue;
    }
    $token = bin2hex(random_bytes(16)) . '.jpg';
    if (file_put_contents($renderDirectory . '/' . $token, $bytes, LOCK_EX) !== false) {
        $proposalTokens[] = $token;
    }
}
if (!$proposalTokens) {
    if (isset($storedPath) && is_file($storedPath)) {
        unlink($storedPath);
    }
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'El proveedor respondio, pero no entrego imagenes validas.'], JSON_UNESCAPED_UNICODE);
    exit;
}

$record = beh_store_record('simulacion', [
    'experience' => 'estudio_ia_espacios',
    'space_type' => mb_substr($spaceType, 0, 80),
    'style' => mb_substr($style, 0, 80),
    'prompt' => $prompt,
    'original_asset' => $storedAsset,
    'render_assets' => $proposalTokens,
    'provider' => 'openai',
    'model' => $imageModel,
    'consent' => true,
    'scope' => 'concepto_visual_pendiente_validacion',
], 'estudio_ia_espacios');

$requests[] = time();
file_put_contents($rateFile, json_encode($requests), LOCK_EX);

echo json_encode([
    'ok' => true,
    'record_id' => $record['id'],
    'status' => 'renders_ready',
    'proposals' => array_map(static fn($token) => 'space_ai_media.php?token=' . $token, $proposalTokens),
    'message' => count($proposalTokens) . ' propuestas personalizadas listas para elegir.',
], JSON_UNESCAPED_UNICODE);
