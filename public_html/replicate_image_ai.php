<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
http_response_code(410);
echo json_encode([
    'ok' => false,
    'error' => 'Este servicio experimental fue retirado.',
], JSON_UNESCAPED_UNICODE);
