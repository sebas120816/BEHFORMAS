<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');

$tokenFile = '/home/behforma/.beh-deploy-token';
$providedToken = $_SERVER['HTTP_X_DEPLOY_KEY'] ?? '';
$expectedToken = is_file($tokenFile) ? trim((string) file_get_contents($tokenFile)) : '';

if ($expectedToken === '' || !hash_equals($expectedToken, $providedToken)) {
    http_response_code(403);
    exit("Forbidden\n");
}

if (!class_exists(ZipArchive::class)) {
    http_response_code(500);
    exit("ZipArchive is not available.\n");
}

set_time_limit(0);
$root = __DIR__;
$archivePath = $root . '/grandnode-production.zip';
$zip = new ZipArchive();

if ($zip->open($archivePath) !== true) {
    http_response_code(500);
    exit("Could not open deployment package.\n");
}

if (!$zip->extractTo($root)) {
    $zip->close();
    http_response_code(500);
    exit("Could not extract deployment package.\n");
}

$zip->close();
@chmod($root . '/Grand.Web', 0755);
@unlink($archivePath);
@unlink($tokenFile);
@unlink(__FILE__);

echo "GrandNode production package extracted successfully.\n";
