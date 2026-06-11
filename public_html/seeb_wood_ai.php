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
$rateFile = sys_get_temp_dir() . '/beh_ai_rate_' . hash('sha256', $clientIp) . '.json';
$rateHandle = fopen($rateFile, 'c+');
if ($rateHandle !== false) {
    flock($rateHandle, LOCK_EX);
    $rawRate = stream_get_contents($rateHandle);
    $requests = json_decode($rawRate ?: '[]', true);
    $requests = is_array($requests) ? $requests : [];
    $cutoff = time() - 60;
    $requests = array_values(array_filter($requests, static fn($timestamp) => (int)$timestamp >= $cutoff));

    if (count($requests) >= 10) {
        flock($rateHandle, LOCK_UN);
        fclose($rateHandle);
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'Demasiadas solicitudes. Intenta nuevamente en un minuto.']);
        exit;
    }

    $requests[] = time();
    rewind($rateHandle);
    ftruncate($rateHandle, 0);
    fwrite($rateHandle, json_encode($requests));
    fflush($rateHandle);
    flock($rateHandle, LOCK_UN);
    fclose($rateHandle);
}

$configFile = dirname(__DIR__) . '/openai_config.php';
if (is_file($configFile)) {
    require_once $configFile;
}

$apiKey = getenv('OPENAI_API_KEY') ?: (defined('OPENAI_API_KEY') ? OPENAI_API_KEY : '');
$textModel = getenv('OPENAI_TEXT_MODEL') ?: (defined('OPENAI_TEXT_MODEL') ? OPENAI_TEXT_MODEL : 'gpt-5.5');
if (!$apiKey || str_contains($apiKey, 'replace-with')) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'La inteligencia BEH esta pendiente de configuracion']);
    exit;
}

$input = json_decode(file_get_contents('php://input') ?: '{}', true);
$prompt = trim((string)($input['prompt'] ?? ''));

if ($prompt === '' || mb_strlen($prompt) > 1200) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Describe un mueble en maximo 1200 caracteres']);
    exit;
}

$schemaInstruction = <<<'TXT'
Eres el asistente de diseño BEH, experto en oficinas, carpinteria, mobiliario a medida y cotizacion preliminar.
Interpreta el texto del usuario y responde SOLO un JSON valido, sin markdown.
El JSON debe tener estas claves:
{
  "tipo": "escritorio|closet|biblioteca|mueble de TV|mueble de cocina|otro",
  "ancho": 140,
  "profundidad": 60,
  "alto": 75,
  "material": "melamina blanca",
  "color": "blanca|negra|roble|nogal|gris|natural",
  "cajones": 0,
  "cajones_izquierda": 0,
  "cajones_centro": 0,
  "cajones_derecha": 0,
  "repisas": 0,
  "repisas_izquierda": 0,
  "repisas_centro": 0,
  "repisas_derecha": 0,
  "puertas": 0,
  "estilo": "minimalista|moderno|premium|funcional",
  "instalacion": "piso|flotante|empotrado",
  "modulos": [
    {"zona":"izquierda","tipo":"cajones","cantidad":2},
    {"zona":"centro","tipo":"repisas","cantidad":2},
    {"zona":"derecha","tipo":"cajones","cantidad":2}
  ],
  "canto": "PVC 0.45 mm|PVC 2 mm",
  "sistema": "herrajes estándar|rieles telescópicos|push open",
  "confianza": 90,
  "descripcion": "descripcion comercial corta del mueble, maximo 34 palabras",
  "sugerencias": ["mejora concreta de diseno o funcionalidad", "mejora de acabado premium", "validacion tecnica recomendada"],
  "notas": ["nota tecnica corta"]
}
Usa centimetros. Si falta una medida, infiere una medida comercial razonable.
Interpreta distribuciones por zonas aunque el usuario las escriba en lenguaje natural: izquierda, centro, medio, derecha, superior, inferior.
Si el usuario dice "2 cajones a la izquierda y 2 cajones a la derecha", cajones debe ser 4 y tambien debes llenar cajones_izquierda=2 y cajones_derecha=2.
Si dice "flotante", instalacion debe ser "flotante".
La descripcion debe vender el mueble con lenguaje premium, pero sin prometer fabricacion final.
Las sugerencias deben ser utiles para carpinteria real: herrajes, canto, pasacables, iluminacion LED, niveladores, divisiones, ventilacion, anclajes o ergonomia.
No inventes precios. No incluyas texto fuera del JSON.
TXT;

$payload = [
    'model' => $textModel,
    'instructions' => $schemaInstruction,
    'input' => "Responde en JSON valido para este proyecto:\n" . $prompt,
    'reasoning' => ['effort' => 'low'],
    'max_output_tokens' => 1400,
    'text' => [
        'format' => ['type' => 'json_object'],
        'verbosity' => 'low',
    ],
];

$ch = curl_init('https://api.openai.com/v1/responses');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
    CURLOPT_TIMEOUT => 25,
]);

$response = curl_exec($ch);
$curlError = curl_error($ch);
$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false || $curlError) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'No se pudo conectar con OpenAI']);
    exit;
}

$decoded = json_decode($response, true);
$content = '';
foreach (($decoded['output'] ?? []) as $outputItem) {
    foreach (($outputItem['content'] ?? []) as $contentItem) {
        if (($contentItem['type'] ?? '') === 'output_text') {
            $content .= (string)($contentItem['text'] ?? '');
        }
    }
}
$design = json_decode((string)$content, true);

if ($status < 200 || $status >= 300 || !is_array($design)) {
    http_response_code(502);
    $providerMessage = trim((string)($decoded['error']['message'] ?? 'OpenAI no devolvio una propuesta valida'));
    if (preg_match('/quota|billing|hard limit|insufficient/i', $providerMessage)) {
        $providerMessage = 'La inteligencia BEH está temporalmente en mantenimiento. Intenta nuevamente más tarde.';
    }
    echo json_encode(['ok' => false, 'error' => mb_substr($providerMessage, 0, 300)]);
    exit;
}

$design['tipo'] = (string)($design['tipo'] ?? 'escritorio');
$design['ancho'] = max(30, min(300, (int)($design['ancho'] ?? 140)));
$design['profundidad'] = max(20, min(120, (int)($design['profundidad'] ?? 60)));
$design['alto'] = max(20, min(260, (int)($design['alto'] ?? 75)));
$design['material'] = (string)($design['material'] ?? 'melamina blanca');
$design['color'] = (string)($design['color'] ?? 'blanca');
$design['cajones'] = max(0, min(12, (int)($design['cajones'] ?? 0)));
$design['cajones_izquierda'] = max(0, min(8, (int)($design['cajones_izquierda'] ?? 0)));
$design['cajones_centro'] = max(0, min(8, (int)($design['cajones_centro'] ?? 0)));
$design['cajones_derecha'] = max(0, min(8, (int)($design['cajones_derecha'] ?? 0)));
$design['repisas'] = max(0, min(16, (int)($design['repisas'] ?? 0)));
$design['repisas_izquierda'] = max(0, min(10, (int)($design['repisas_izquierda'] ?? 0)));
$design['repisas_centro'] = max(0, min(10, (int)($design['repisas_centro'] ?? 0)));
$design['repisas_derecha'] = max(0, min(10, (int)($design['repisas_derecha'] ?? 0)));
$design['puertas'] = max(0, min(10, (int)($design['puertas'] ?? 0)));
$design['estilo'] = (string)($design['estilo'] ?? 'funcional');
$design['instalacion'] = (string)($design['instalacion'] ?? 'piso');
$design['canto'] = (string)($design['canto'] ?? 'PVC 0.45 mm');
$design['sistema'] = (string)($design['sistema'] ?? 'herrajes estándar');
$design['confianza'] = max(40, min(99, (int)($design['confianza'] ?? 85)));
$design['descripcion'] = trim((string)($design['descripcion'] ?? ''));
if (mb_strlen($design['descripcion']) > 260) {
    $design['descripcion'] = mb_substr($design['descripcion'], 0, 260);
}
$rawSuggestions = is_array($design['sugerencias'] ?? null) ? $design['sugerencias'] : [];
$design['sugerencias'] = array_values(array_slice(array_filter(array_map(static function ($item) {
    $text = trim((string)$item);
    return mb_strlen($text) > 180 ? mb_substr($text, 0, 180) : $text;
}, $rawSuggestions)), 0, 5));

$zoneDrawers = $design['cajones_izquierda'] + $design['cajones_centro'] + $design['cajones_derecha'];
if ($zoneDrawers > $design['cajones']) {
    $design['cajones'] = min(12, $zoneDrawers);
}

$zoneShelves = $design['repisas_izquierda'] + $design['repisas_centro'] + $design['repisas_derecha'];
if ($zoneShelves > $design['repisas']) {
    $design['repisas'] = min(16, $zoneShelves);
}

$record = beh_store_record('simulacion', ['prompt' => $prompt, 'provider' => 'openai', 'model' => $textModel] + $design, 'planeador_ia');
$publicFields = [
    'tipo', 'ancho', 'profundidad', 'alto', 'material', 'color', 'cajones',
    'repisas', 'puertas', 'estilo', 'instalacion', 'descripcion', 'confianza',
];
$publicDesign = array_intersect_key($design, array_flip($publicFields));

echo json_encode([
    'ok' => true,
    'provider' => 'openai',
    'model' => $textModel,
    'record_id' => $record['id'],
    'design' => $publicDesign,
], JSON_UNESCAPED_UNICODE);
