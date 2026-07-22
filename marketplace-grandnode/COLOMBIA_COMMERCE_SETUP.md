# Configuración comercial Colombia

## Pago operativo inicial

La tienda incluye el plugin `Payments.CashOnDelivery`, adaptado por BEH como:

**Transferencia bancaria o anticipo coordinado**

Este método:

- Registra el pedido con pago pendiente.
- No cobra ni marca el pedido como pagado.
- Permite validar inventario, fabricación, entrega e instalación.
- No contiene cuentas bancarias ni credenciales en el código.

En administración:

1. Abrir **Configuración > Plugins**.
2. Confirmar que el método de pago está instalado.
3. Abrir **Configuración > Pagos > Métodos de pago**.
4. Activar `Transferencia bancaria o anticipo coordinado`.
5. Mantener el cargo adicional en cero.
6. Realizar un pedido de prueba y confirmar el estado pendiente.

## Pasarela en línea

Para PSE y tarjetas se debe elegir un proveedor con contrato activo. La integración requiere:

- Llave pública y privada de producción.
- Llaves separadas de pruebas.
- URL de webhook HTTPS.
- Política de firma y validación de eventos.
- Confirmación de moneda COP.
- Flujo de reembolsos y conciliación.

No se deben usar credenciales reales en archivos versionados.

## Correo transaccional

Configurar en **Configuración > Cuentas de correo**:

- Remitente del dominio `@behformas.com`.
- Servidor SMTP, puerto y cifrado indicados por el proveedor.
- Usuario y contraseña almacenados en el administrador.
- Correo de pedidos, recuperación de contraseña y notificaciones.

Después, activar tareas programadas y comprobar la cola de correo.

## Envíos

Cobertura inicial recomendada:

- Bogotá: entrega coordinada.
- Sabana de Bogotá: tarifa según municipio.
- Otras ciudades: cotización logística antes del pago.
- Instalación, escaleras y restricciones de acceso: valoración separada.

No publicar una tarifa nacional única hasta validar pesos, volumen y transportadora.

## Impuestos

La tasa, inclusión de IVA y reglas de facturación deben ser aprobadas por contabilidad. Antes de activarlas:

- Definir si los precios publicados incluyen IVA.
- Crear categorías tributarias.
- Probar subtotal, envío, descuentos e impuesto.
- Confirmar datos exigidos para facturación electrónica.
