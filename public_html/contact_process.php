<?php
declare(strict_types=1);

session_start();
require_once dirname(__DIR__) . '/beh_storage.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

function field(string $key): string
{
    return trim((string)($_POST[$key] ?? ''));
}

$name = field('name');
$email = field('email');
$phone = field('phone');
$company = field('company');
$city = field('city');
$subject = field('subject');
$message = field('message');
$website = field('website');

if ($website !== '') {
    http_response_code(204);
    exit;
}

$now = time();
$lastSubmit = (int)($_SESSION['beh_contact_last_submit'] ?? 0);
$clientIp = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = sys_get_temp_dir() . '/beh_contact_rate_' . hash('sha256', $clientIp) . '.json';
$requests = is_file($rateFile) ? json_decode((string)file_get_contents($rateFile), true) : [];
$requests = is_array($requests) ? $requests : [];
$requests = array_values(array_filter($requests, static fn($timestamp) => (int)$timestamp >= time() - 600));
if (($lastSubmit > 0 && ($now - $lastSubmit) < 20) || count($requests) >= 5) {
    http_response_code(429);
    echo 'Espera unos minutos antes de enviar otra solicitud.';
    exit;
}
$_SESSION['beh_contact_last_submit'] = $now;
$requests[] = $now;
file_put_contents($rateFile, json_encode($requests), LOCK_EX);

if (
    $name === '' ||
    $message === '' ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    mb_strlen($name) > 120 ||
    mb_strlen($email) > 180 ||
    mb_strlen($phone) > 60 ||
    mb_strlen($company) > 160 ||
    mb_strlen($city) > 120 ||
    mb_strlen($subject) > 180 ||
    mb_strlen($message) > 3000 ||
    preg_match('/[\r\n]/', $email)
) {
    http_response_code(422);
    echo 'Por favor completa nombre, correo valido y mensaje.';
    exit;
}

$to = 'gerencia@behformas.com';
$mailSubject = 'Nueva solicitud desde behformas.com';
$safeSubject = $subject !== '' ? $subject : 'Proyecto BEH';

$body = "Nueva solicitud de contacto\n\n";
$body .= "Nombre: {$name}\n";
$body .= "Correo: {$email}\n";
$body .= "Telefono: {$phone}\n";
$body .= "Empresa: {$company}\n";
$body .= "Ciudad: {$city}\n";
$body .= "Proyecto: {$safeSubject}\n\n";
$body .= "Mensaje:\n{$message}\n";

$headers = [
    'From: BEH Web <gerencia@behformas.com>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
];

$record = beh_store_record('cotizacion', [
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'company' => $company,
    'city' => $city,
    'subject' => $safeSubject,
    'message' => $message,
], 'formulario_contacto');

$sent = mail($to, $mailSubject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo 'No fue posible enviar el mensaje. Puedes contactarnos por WhatsApp: +57 310 320 0976.';
    exit;
}
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mensaje enviado | BEH</title>
  <link rel="stylesheet" href="assets/css/behformas-2026.css?v=20260610d">
</head>
<body>
  <main class="page-hero">
    <div class="wrap">
      <span class="eyebrow">Mensaje enviado</span>
      <h1>Gracias, recibimos tu solicitud.</h1>
      <p>Referencia <strong><?= htmlspecialchars((string)$record['id']) ?></strong>. Revisaremos la información y te contactaremos para definir el siguiente paso.</p>
      <a class="btn" href="https://wa.me/573103200976" target="_blank" rel="noopener">Abrir WhatsApp</a>
      <a class="btn secondary" href="index.html">Volver al inicio</a>
    </div>
  </main>
</body>
</html>
