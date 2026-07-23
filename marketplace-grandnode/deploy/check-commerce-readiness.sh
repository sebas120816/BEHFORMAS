#!/bin/bash
set -euo pipefail

ROOT="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
WEB="$ROOT/src/Web/Grand.Web"
FAILED=0

check_file() {
  if [ -f "$1" ]; then
    printf 'OK   %s\n' "$2"
  else
    printf 'FAIL %s\n' "$2"
    FAILED=1
  fi
}

check_text() {
  if grep -Fq "$2" "$1"; then
    printf 'OK   %s\n' "$3"
  else
    printf 'FAIL %s\n' "$3"
    FAILED=1
  fi
}

check_text_optional() {
  if [ ! -f "$1" ]; then
    printf 'WARN %s (archivo no presente en CI limpia)\n' "$3"
    return 0
  fi

  if grep -Fq "$2" "$1"; then
    printf 'OK   %s\n' "$3"
  else
    printf 'FAIL %s\n' "$3"
    FAILED=1
  fi
}

check_file "$WEB/Plugins/Theme.BehOffice/Theme.BehOffice.dll" "Tema BEH compilado"
check_file "$WEB/Plugins/Payments.CashOnDelivery/Payments.CashOnDelivery.dll" "Método de pago manual compilado"
check_text_optional "$WEB/App_Data/InstalledPlugins.cfg" '"Payments.CashOnDelivery"' "Plugin de pago declarado"
check_text "$WEB/App_Data/appsettings.Production.json" '"UseLiteDb": true' "Persistencia LiteDB declarada"
check_text "$WEB/App_Data/appsettings.Production.json" '"ForceUseHTTPS": true' "HTTPS forzado"

check_file "$ROOT/src/Build/Grand.Common.props" "Build props compartidos presentes"
check_file "$ROOT/src/Web/Grand.Web.Vendor/Models/Vendor/VendorModel.cs" "Modelo Vendor del portal presente"

if [ "$FAILED" -ne 0 ]; then
  exit 1
fi

printf '\nConfiguración técnica lista. Aún se requieren pruebas administrativas de SMTP, impuestos, envío y pedido.\n'
