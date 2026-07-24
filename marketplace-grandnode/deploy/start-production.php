<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');

$tokenFile = __DIR__ . '/.beh-deploy-token';
$providedToken = $_SERVER['HTTP_X_DEPLOY_KEY'] ?? '';
$expectedToken = is_file($tokenFile) ? trim((string) file_get_contents($tokenFile)) : '';

if ($expectedToken === '' || !hash_equals($expectedToken, $providedToken)) {
    http_response_code(403);
    exit("Forbidden\n");
}

$disabled = array_map('trim', explode(',', (string) ini_get('disable_functions')));
if (!function_exists('exec') || in_array('exec', $disabled, true)) {
    @unlink($tokenFile);
    http_response_code(500);
    exit("exec() is disabled in this hosting plan.\n");
}

$appRoot = __DIR__;
$appBin = $appRoot . '/Grand.Web';
$appDll = $appRoot . '/Grand.Web.dll';
$log = $appRoot . '/App_Data/production.log';

@exec('pkill -9 -x Grand.Web >/dev/null 2>&1');

if (is_executable($appBin)) {
    $cmd = 'nohup setsid -f ' . escapeshellarg($appBin) . ' >>' . escapeshellarg($log) . ' 2>&1 </dev/null';
} elseif (is_file($appDll)) {
    $cmd = 'nohup setsid -f dotnet ' . escapeshellarg($appDll) . ' >>' . escapeshellarg($log) . ' 2>&1 </dev/null';
} else {
    @unlink($tokenFile);
    http_response_code(500);
    exit("GrandNode binary not found (Grand.Web / Grand.Web.dll).\n");
}

@exec('/bin/bash -lc ' . escapeshellarg($cmd));
sleep(6);

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => "Host: tienda.behformas.com\r\n",
        'timeout' => 6,
    ],
]);
$ok = @file_get_contents('http://127.0.0.1:5080/', false, $context) !== false;

@unlink($tokenFile);

if ($ok) {
    echo "GrandNode started successfully.\n";
    exit(0);
}

echo "Start command executed. Check App_Data/production.log if still unavailable.\n";
