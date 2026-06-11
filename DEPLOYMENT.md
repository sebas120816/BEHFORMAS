# Deployment Guide - behformas.com

## 🚀 Configuración Inicial (Una sola vez)

### 1. Subir el código a GitHub

```bash
cd /Users/sebastianrodriguez/Documents/behformas_backup_original

# El repo ya existe, así que:
git add .
git commit -m "Initial setup: BEH Space AI with deployment config"
git branch -M main
git remote add origin https://github.com/sebas120816/BEHFORMAS.git
git push -u origin main
```

### 2. ⚠️ Configurar GitHub Secrets (CRÍTICO)

**NO compartas estas credenciales públicamente**

Ve a: **GitHub → sebas120816/BEHFORMAS → Settings → Secrets and variables → Actions**

Haz clic en **"New repository secret"** y crea estos 3 secrets:

| Secret Name | Valor |
|---|---|
| `FTP_SERVER` | `ftp.behformas.com` |
| `FTP_USERNAME` | `sebas@behformas.com` |
| `FTP_PASSWORD` | `Sebas123*sebas` |

**Pasos detallados:**

1. Ve a: https://github.com/sebas120816/BEHFORMAS/settings/secrets/actions
2. Haz clic en **"New repository secret"**
3. Name: `FTP_SERVER` → Value: `ftp.behformas.com` → Click **"Add secret"**
4. Repite para `FTP_USERNAME` y `FTP_PASSWORD`

✅ Después de configurar, GitHub Actions podrá acceder automáticamente sin mostrar contraseñas.

---

## 📁 Estructura del Deploy

El workflow automático copia:

```
public_html/  → /public_html/ (en el servidor)
data/         → /data/       (en el servidor)
```

No se suben:
- `.git` (control de versiones)
- `.DS_Store` (archivos del sistema)
- `.env` (configuración privada)
- `openai_config.php` (API keys)

---

## 🔄 Cómo Usar (Después de configurar)

### Deploy Automático (recomendado)

Simplemente haz `git push`:

```bash
# Haz cambios en tu código
git add .
git commit -m "Add feature X"
git push origin main

# ✅ GitHub Actions se ejecutará automáticamente
# Verifica en: https://github.com/sebas120816/BEHFORMAS/actions
```

### Deploy Manual

Si necesitas forzar un deploy sin cambios:

1. Ve a: https://github.com/sebas120816/BEHFORMAS/actions
2. Selecciona el workflow **"Deploy to behformas.com (FTP)"**
3. Haz clic en **"Run workflow"** → **"Run workflow"**

---

## 📝 Configuración en el Servidor

Después del primer deploy, configura estos archivos **manualmente en cPanel**:

### 1. Crear `openai_config.php`

Via **File Manager** de cPanel, crea `/public_html/openai_config.php`:

```php
<?php
define('OPENAI_API_KEY', 'sk-xxxx'); // Reemplaza con tu API key real
define('OPENAI_ORGANIZATION', ''); // Opcional
?>
```

Permisos: `644`

### 2. Verificar Permisos de Directorios

Via Terminal en cPanel (SSH):

```bash
# Conectar al servidor
ssh sebas@behformas.com

# Dar permisos correctos
chmod 755 ~/public_html/data
chmod 755 ~/public_html/data/space_ai
chmod 755 ~/public_html/data/space_ai/originals
chmod 755 ~/public_html/data/space_ai/renders
```

---

## ✅ Checklist Pre-Deploy

- [ ] GitHub secrets configurados (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD)
- [ ] `openai_config.php` existe en servidor (NO en Git)
- [ ] Directorios `data/space_ai/*` tienen permisos 755
- [ ] Maintenance page está activa (opcional)

---

## 🧪 Verificar Deployment

### 1. Comprobar Files en GitHub Actions

https://github.com/sebas120816/BEHFORMAS/actions

Haz clic en el workflow más reciente para ver logs.

### 2. Prueba en Vivo

```bash
# Desde tu terminal (macOS/Linux)
curl -I https://behformas.com/maintenance.html

# Deberías obtener: HTTP/1.1 200 OK
```

### 3. Probar API

```bash
# Test de Groq (seeb_wood_ai)
curl -X POST https://behformas.com/seeb_wood_ai.php \
  -F "prompt=sofá moderno 2 plazas" \
  -F "image=@tu_imagen.jpg"
```

---

## 🔄 Rollback (Revertir cambios)

Si algo falla, revert es fácil:

```bash
# Revisar historial
git log --oneline

# Revertir al commit anterior
git revert HEAD
git push origin main

# GitHub Actions redesplegará la versión anterior automáticamente
```

---

## 🐛 Troubleshooting

### ❌ "Authentication failed"
- Verifica credenciales FTP en cPanel
- Asegúrate que los secrets están correctos en GitHub

### ❌ "Permission denied: data/"
- Via SSH: `chmod -R 755 ~/public_html/data/`
- Verificar user/permisos en cPanel

### ❌ "API key error"
- Confirma que `openai_config.php` existe y tiene la API key correcta
- No debe estar en Git (está en `.gitignore`)

### ✅ Ver logs detallados

En GitHub Actions, expande cada step del workflow para ver errores.

---

## 📞 Soporte Rápido

**Preguntas frecuentes:**

**P: ¿Dónde veo los logs de deployment?**  
R: https://github.com/sebas120816/BEHFORMAS/actions → Click en workflow reciente

**P: ¿Puedo deplegar sin hacer push?**  
R: Sí, en Actions → Selecciona workflow → "Run workflow" (botón azul)

**P: ¿Mi contraseña está segura en GitHub?**  
R: Sí. GitHub encripta todos los secrets. Solo el workflow puede leerlos.

**P: ¿Cómo cambio la contraseña FTP?**  
R: En cPanel → FTP Accounts → Cambias ahí, luego actualizas en GitHub Secrets

---

## 🎯 Próximos Pasos

1. ✅ Configura secrets en GitHub
2. ✅ Haz primer push a main
3. ✅ Verifica deployment en Actions
4. ✅ Crea `openai_config.php` en servidor
5. ✅ Prueba endpoints API
6. ✅ Activa/desactiva mantenimiento según necesites

