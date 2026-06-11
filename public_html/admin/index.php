<?php
declare(strict_types=1);

session_set_cookie_params([
    'httponly' => true,
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite' => 'Strict',
]);
session_start();
require_once dirname(__DIR__, 2) . '/beh_admin_config.php';
require_once dirname(__DIR__, 2) . '/beh_storage.php';

$error = '';
$_SESSION['beh_csrf'] ??= bin2hex(random_bytes(24));
if (!empty($_SESSION['beh_admin_last']) && time() - (int)$_SESSION['beh_admin_last'] > 1800) {
    session_destroy();
    header('Location: index.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!hash_equals((string)$_SESSION['beh_csrf'], (string)($_POST['csrf'] ?? ''))) {
        http_response_code(403);
        exit('Solicitud no válida.');
    }
    if (isset($_POST['logout'])) {
        session_destroy();
        header('Location: index.php');
        exit;
    }
    $user = trim((string)($_POST['user'] ?? ''));
    $password = (string)($_POST['password'] ?? '');
    $loginIp = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $loginRateFile = sys_get_temp_dir() . '/beh_admin_login_' . hash('sha256', $loginIp) . '.json';
    $loginAttempts = is_file($loginRateFile) ? json_decode((string)file_get_contents($loginRateFile), true) : [];
    $loginAttempts = is_array($loginAttempts) ? $loginAttempts : [];
    $loginAttempts = array_values(array_filter($loginAttempts, static fn($timestamp) => (int)$timestamp >= time() - 900));
    if (count($loginAttempts) >= 8) {
        http_response_code(429);
        exit('Demasiados intentos. Intenta nuevamente más tarde.');
    }
    if (hash_equals(BEH_ADMIN_USER, $user) && password_verify($password, BEH_ADMIN_PASSWORD_HASH)) {
        file_put_contents($loginRateFile, '[]', LOCK_EX);
        session_regenerate_id(true);
        $_SESSION['beh_admin'] = true;
        $_SESSION['beh_admin_last'] = time();
        $_SESSION['beh_csrf'] = bin2hex(random_bytes(24));
        header('Location: index.php');
        exit;
    }
    $loginAttempts[] = time();
    file_put_contents($loginRateFile, json_encode($loginAttempts), LOCK_EX);
    $error = 'Credenciales incorrectas.';
}

$authenticated = !empty($_SESSION['beh_admin']);
if ($authenticated) {
    $_SESSION['beh_admin_last'] = time();
}
$records = $authenticated ? beh_read_records() : [];
$filter = (string)($_GET['type'] ?? 'todos');
if ($filter !== 'todos') {
    $records = array_values(array_filter($records, static fn(array $record): bool => ($record['type'] ?? '') === $filter));
}
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Administrador BEH</title>
  <link rel="stylesheet" href="../assets/css/beh-admin.css?v=20260609">
</head>
<body>
<?php if (!$authenticated): ?>
  <main class="admin-login">
    <form method="post">
      <input type="hidden" name="csrf" value="<?= htmlspecialchars((string)$_SESSION['beh_csrf']) ?>">
      <span>Área privada BEH</span>
      <h1>Mesa técnica</h1>
      <p>Cotizaciones, simulaciones y conocimiento técnico de fabricación.</p>
      <?php if ($error): ?><div class="admin-error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
      <label>Usuario<input name="user" autocomplete="username" required></label>
      <label>Contraseña<input type="password" name="password" autocomplete="current-password" required></label>
      <button type="submit">Ingresar</button>
    </form>
  </main>
<?php else: ?>
  <header class="admin-header">
    <div><span>BEH / Área privada</span><h1>Mesa técnica y comercial</h1></div>
    <form method="post"><input type="hidden" name="csrf" value="<?= htmlspecialchars((string)$_SESSION['beh_csrf']) ?>"><button type="submit" name="logout" value="1" style="padding:10px 14px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;cursor:pointer">Cerrar sesión</button></form>
  </header>
  <main class="admin-shell">
    <nav class="admin-filters" aria-label="Filtrar registros">
      <a class="<?= $filter === 'todos' ? 'is-active' : '' ?>" href="?type=todos">Todos</a>
      <a class="<?= $filter === 'simulacion' ? 'is-active' : '' ?>" href="?type=simulacion">Simulaciones</a>
      <a class="<?= $filter === 'cotizacion' ? 'is-active' : '' ?>" href="?type=cotizacion">Cotizaciones</a>
    </nav>
    <section class="admin-summary">
      <div><strong><?= count($records) ?></strong><span>Registros visibles</span></div>
      <div><strong><?= count(array_filter($records, static fn($r) => ($r['type'] ?? '') === 'simulacion')) ?></strong><span>Simulaciones IA</span></div>
      <div><strong><?= count(array_filter($records, static fn($r) => ($r['type'] ?? '') === 'cotizacion')) ?></strong><span>Cotizaciones</span></div>
    </section>
    <section class="admin-records">
      <?php if (!$records): ?>
        <div class="admin-empty"><h2>Aún no hay registros.</h2><p>Las nuevas simulaciones y cotizaciones aparecerán aquí.</p></div>
      <?php endif; ?>
      <?php foreach ($records as $record): $payload = (array)($record['payload'] ?? []); ?>
        <article class="admin-record">
          <header>
            <div><span><?= htmlspecialchars(strtoupper((string)$record['type'])) ?></span><h2><?= htmlspecialchars((string)($payload['tipo'] ?? $payload['projectType'] ?? 'Solicitud BEH')) ?></h2></div>
            <time><?= htmlspecialchars((string)$record['created_at']) ?></time>
          </header>
          <dl>
            <div><dt>Referencia</dt><dd><?= htmlspecialchars((string)$record['id']) ?></dd></div>
            <div><dt>Fuente</dt><dd><?= htmlspecialchars((string)$record['source']) ?></dd></div>
            <?php if (!empty($payload['prompt'])): ?><div><dt>Brief</dt><dd><?= htmlspecialchars((string)$payload['prompt']) ?></dd></div><?php endif; ?>
            <?php if (!empty($payload['company'])): ?><div><dt>Empresa</dt><dd><?= htmlspecialchars((string)$payload['company']) ?></dd></div><?php endif; ?>
            <?php if (!empty($payload['phone'])): ?><div><dt>WhatsApp</dt><dd><?= htmlspecialchars((string)$payload['phone']) ?></dd></div><?php endif; ?>
            <?php if (!empty($payload['city'])): ?><div><dt>Ciudad</dt><dd><?= htmlspecialchars((string)$payload['city']) ?></dd></div><?php endif; ?>
            <?php if (!empty($payload['material'])): ?><div><dt>Material</dt><dd><?= htmlspecialchars((string)$payload['material']) ?></dd></div><?php endif; ?>
            <?php if (!empty($payload['ancho'])): ?><div><dt>Dimensiones</dt><dd><?= (int)$payload['ancho'] ?> x <?= (int)($payload['profundidad'] ?? 0) ?> x <?= (int)($payload['alto'] ?? 0) ?> cm</dd></div><?php endif; ?>
          </dl>
          <details>
            <summary>Ver información técnica completa</summary>
            <pre><?= htmlspecialchars(json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) ?></pre>
          </details>
        </article>
      <?php endforeach; ?>
    </section>
  </main>
<?php endif; ?>
</body>
</html>
