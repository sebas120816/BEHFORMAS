<?php
declare(strict_types=1);

$token = (string)($_GET['token'] ?? '');
if (!preg_match('/^[a-f0-9]{32}\.jpg$/', $token)) {
    http_response_code(404);
    exit;
}

$path = dirname(__DIR__) . '/data/space_ai/renders/' . $token;
if (!is_file($path)) {
    http_response_code(404);
    exit;
}

header('Content-Type: image/jpeg');
header('Content-Length: ' . filesize($path));
header('Cache-Control: private, max-age=3600');
header('X-Content-Type-Options: nosniff');
readfile($path);
