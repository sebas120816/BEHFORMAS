# Configuración del Modo Mantenimiento

## 📋 Descripción

Este sistema te permite mostrar una página de "Proximamente" mientras trabajas en la tienda online. Incluye:

✅ Página de mantenimiento elegante con loader animado  
✅ Modal de newsletter/suscripción  
✅ Banner de aceptación de cookies  
✅ Control de acceso por IP (para admins)  

---

## 🚀 Instalación Rápida

### Opción 1: Redireccionamiento vía .htaccess (Recomendado para cPanel)

Añade esto al inicio de `/public_html/.htaccess`:

```apache
# Maintenance Mode
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/maintenance\.html$
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_URI} !^/assets/
RewriteCond %{REMOTE_ADDR} !^127\.0\.0\.1$
RewriteRule ^(.*)$ /maintenance.html [L]
```

Para agregar tu IP (desde donde administras):
```apache
RewriteCond %{REMOTE_ADDR} !^192\.168\.1\.100$
```

### Opción 2: PHP Check (Si usas index.php como punto de entrada)

En el **inicio** de tu `public_html/index.php` (antes que cualquier otra cosa):

```php
<?php
// Maintenance Mode - Coloca esto PRIMERO
if (file_exists(__DIR__ . '/maintenance-check.php')) {
    include_once __DIR__ . '/maintenance-check.php';
}

// ... resto de tu código
?>
```

Luego edita `maintenance-check.php` y establece:

```php
define('MAINTENANCE_MODE', true);  // true = activado, false = desactivado
```

**Para permitir tu acceso como admin**, añade tu IP en el array:

```php
$admin_ips = array(
    '192.168.1.100',  // Reemplaza con tu IP real
    '127.0.0.1'       // Localhost
);
```

Para saber tu IP, ve a: https://www.cualesmiip.com/

---

## 🎨 Personalización

### Cambiar el título y mensaje

En `maintenance.html`, busca:

```html
<h1>Estamos trabajando para ti</h1>
<p class="subtitle">
    Estamos preparando una experiencia increíble...
</p>
```

### Cambiar colores

Los colores principales están definidos con estos valores:
- `#667eea` - Color azul principal
- `#764ba2` - Color púrpura (gradiente)

Busca y reemplaza en el CSS `<style>` de `maintenance.html`.

### Cambiar el logo

Reemplaza `<div class="logo-text">BEH</div>` con tu logo:

```html
<!-- Opción 1: Texto -->
<div class="logo-text">TU LOGO</div>

<!-- Opción 2: Imagen -->
<img src="/assets/logo.png" style="width: 100px; height: 100px;">
```

---

## 📊 Ver Suscriptores

Los datos de suscriptores se guardan en **localStorage** del navegador. Para exportarlos a servidor:

### Opción A: Consola del navegador
```javascript
// Abre DevTools (F12) → Console y ejecuta:
console.log(JSON.parse(localStorage.getItem('beh_subscribers')));
```

### Opción B: API endpoint (crear en servidor)

Crea `public_html/api/get-subscribers.php`:

```php
<?php
header('Content-Type: application/json');

// Proteger con contraseña simple
if ($_GET['key'] !== 'tu_contraseña_segura') {
    http_response_code(401);
    exit('Unauthorized');
}

// Leer archivo de suscriptores
$file = __DIR__ . '/../../data/subscribers.jsonl';
$subscribers = [];

if (file_exists($file)) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $subscribers[] = json_decode($line);
    }
}

echo json_encode($subscribers, JSON_PRETTY_PRINT);
?>
```

Accede vía: `https://behformas.com/api/get-subscribers.php?key=tu_contraseña_segura`

---

## 🔧 Desactivar Modo Mantenimiento

### Con .htaccess
Simplemente comenta las líneas o elimina la sección.

### Con PHP
En `maintenance-check.php`:
```php
define('MAINTENANCE_MODE', false);  // Cambia a false
```

---

## 📱 Testing en Local

### Simular mantenimiento en tu computadora:

```bash
# Abre terminal en el directorio del proyecto
cd /Users/sebastianrodriguez/Documents/behformas_backup_original

# Inicia servidor PHP local
php -S localhost:8000

# Ve a http://localhost:8000
```

---

## 🔐 Seguridad

✅ **No expongas IPs públicas** en el código  
✅ **Usa HTTPS** en producción  
✅ **Protege el archivo** `maintenance-check.php` si lo usas  
✅ **Cambia la contraseña** en `get-subscribers.php`  

---

## 📝 Próximos Pasos

Cuando termines de trabajar en la tienda:

1. Desactiva modo mantenimiento (cambia `true` → `false`)
2. Exporta los suscriptores a tu base de datos
3. Implementa un sistema de newsletter real (Mailchimp, SendGrid, etc.)

¿Necesitas ayuda? 🚀
