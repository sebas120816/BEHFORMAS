<?php
declare(strict_types=1);

function beh_storage_path(): string
{
    $directory = __DIR__ . '/data';
    if (!is_dir($directory)) {
        mkdir($directory, 0750, true);
    }
    return $directory . '/beh_records.jsonl';
}

function beh_store_record(string $type, array $payload, string $source = 'web'): array
{
    $record = [
        'id' => 'BEH-' . date('Ymd-His') . '-' . strtoupper(bin2hex(random_bytes(3))),
        'type' => $type,
        'source' => $source,
        'status' => 'nuevo',
        'created_at' => date(DATE_ATOM),
        'ip_hash' => hash('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown')),
        'payload' => $payload,
    ];

    file_put_contents(
        beh_storage_path(),
        json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );

    return $record;
}

function beh_read_records(): array
{
    $path = beh_storage_path();
    if (!is_file($path)) {
        return [];
    }

    $records = [];
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $record = json_decode($line, true);
        if (is_array($record)) {
            $records[] = $record;
        }
    }

    return array_reverse($records);
}

