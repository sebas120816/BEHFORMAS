<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Metodo no permitido']);
    exit;
}

require_once dirname(__DIR__) . '/beh_storage.php';

$clientIp = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = sys_get_temp_dir() . '/beh_capture_rate_' . hash('sha256', $clientIp) . '.json';
$requests = is_file($rateFile) ? json_decode((string)file_get_contents($rateFile), true) : [];
$requests = is_array($requests) ? $requests : [];
$requests = array_values(array_filter($requests, static fn($timestamp) => (int)$timestamp >= time() - 600));
if (count($requests) >= 30) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Demasiadas solicitudes. Intenta más tarde.']);
    exit;
}

$input = json_decode(file_get_contents('php://input') ?: '{}', true);
$type = (string)($input['type'] ?? '');
$payload = is_array($input['payload'] ?? null) ? $input['payload'] : [];
$allowedTypes = ['simulacion', 'cotizacion'];

if (!in_array($type, $allowedTypes, true) || !$payload) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Datos incompletos']);
    exit;
}

$encoded = json_encode($payload, JSON_UNESCAPED_UNICODE);
if ($encoded === false || strlen($encoded) > 50000) {
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'Solicitud demasiado extensa']);
    exit;
}

$record = beh_store_record($type, $payload, 'frontend');
$requests[] = time();
file_put_contents($rateFile, json_encode($requests), LOCK_EX);
echo json_encode(['ok' => true, 'id' => $record['id']], JSON_UNESCAPED_UNICODE);
