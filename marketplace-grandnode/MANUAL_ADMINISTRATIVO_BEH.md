# Manual administrativo BEH

## 1. Acceso

- Tienda: `https://tienda.behformas.com/`
- Administrador: `https://tienda.behformas.com/admin`
- Recuperación: usar **Recuperar contraseña** en la pantalla de ingreso.

Cada integrante debe usar una cuenta individual con correo corporativo. No se deben guardar contraseñas en este documento, enviarlas por chat ni compartir una misma cuenta entre varias personas.

## 2. Roles recomendados

| Rol | Responsabilidad | Accesos principales |
| --- | --- | --- |
| Superadministrador técnico | Configuración y soporte | Sistema, plugins, permisos, copias y todos los módulos |
| Administrador de tienda | Coordinación diaria | Pedidos, pagos, catálogo, clientes, despachos y reportes |
| Comercial | Atención y venta | Pedidos y clientes |
| Catálogo | Publicación de productos | Productos, categorías, marcas, colecciones e imágenes |
| Finanzas | Validación de cobros | Pedidos, transacciones de pago e informes |
| Logística | Preparación y entrega | Pedidos, inventario y envíos |

El permiso de subir plugins, modificar el sistema o gestionar permisos debe quedar únicamente en el rol técnico.

## 3. Crear un acceso

1. Ingresar con una cuenta autorizada.
2. Abrir **Clientes > Clientes**.
3. Seleccionar **Agregar nuevo**.
4. Registrar nombre, correo corporativo y una contraseña temporal robusta.
5. Asignar solamente el grupo correspondiente a la función de la persona.
6. Confirmar que la cuenta esté activa.
7. Pedir al usuario que cambie la contraseña al ingresar.
8. Activar segundo factor cuando la configuración general de correo esté validada.

Registro interno recomendado:

| Dato | Ejemplo |
| --- | --- |
| Responsable | Nombre de la persona |
| Correo | cuenta corporativa |
| Rol | Comercial / Catálogo / Finanzas / Logística |
| Aprobó | Responsable administrativo |
| Fecha de alta | AAAA-MM-DD |
| 2FA | Activo / Pendiente |
| Última revisión | AAAA-MM-DD |

## 4. Retirar o modificar un acceso

1. Abrir **Clientes > Clientes** y localizar la cuenta.
2. Desactivar inmediatamente el usuario cuando salga del equipo o cambie de función.
3. Retirar grupos y permisos que ya no correspondan.
4. Cerrar sesiones y cambiar credenciales relacionadas si la cuenta fue compartida accidentalmente.
5. Registrar responsable, fecha y motivo de la baja.

Revisar accesos al menos cada tres meses.

## 5. Inicio y accesos rápidos

El **Centro de operaciones** presenta:

- **Pedidos:** ventas, estado, cliente y detalle.
- **Pagos:** transacciones pendientes de confirmación.
- **Nuevo producto:** creación directa de una referencia.
- **Clientes:** cuentas, información de contacto e historial.
- **Despachos:** envíos y seguimiento.
- **Ventas de hoy:** monto y cantidad de pedidos.
- **Pendientes y alertas:** pedidos pendientes, carritos abandonados, stock bajo, nuevos clientes y devoluciones.

Los accesos rápidos aparecen según los permisos de cada usuario.

## 6. Flujo de pedido

1. Abrir **Pedidos** y localizar el número o código.
2. Verificar datos del cliente, dirección y productos.
3. Confirmar el método y estado del pago.
4. Si el pago es por transferencia o anticipo, validar el soporte antes de marcarlo como pagado.
5. Preparar los productos y revisar cantidades.
6. Crear o actualizar el envío.
7. Registrar guía, notas y estado de entrega cuando aplique.
8. Cerrar el pedido sólo cuando cobro y entrega estén correctamente conciliados.

No marcar un pago como confirmado únicamente por una captura enviada por el cliente. Finanzas debe validar el ingreso en la cuenta correspondiente.

## 7. Productos y catálogo

Para publicar un producto:

1. Usar **Nuevo producto**.
2. Completar nombre comercial, descripción breve y descripción completa.
3. Registrar SKU único.
4. Definir precio, impuestos e inventario.
5. Cargar imágenes nítidas y consistentes, preferiblemente sobre fondo limpio.
6. Asignar categoría, marca y colección.
7. Revisar título SEO, URL y descripción para buscadores.
8. Previsualizar en la tienda.
9. Publicar únicamente cuando precio, fotos, disponibilidad y variantes estén completos.

No reutilizar SKU ni eliminar un producto con pedidos históricos. En esos casos debe despublicarse.

## 8. Clientes

- Buscar primero por correo antes de crear una cuenta nueva.
- Mantener teléfono, ciudad, dirección y empresa actualizados.
- Usar notas internas para información operativa; no guardar datos bancarios ni contraseñas.
- Revisar el historial de pedidos antes de responder una solicitud.

## 9. Pagos

1. Abrir **Pagos**.
2. Filtrar las transacciones pendientes.
3. Comparar pedido, monto, moneda y referencia.
4. Validar el ingreso con el responsable financiero.
5. Confirmar o rechazar la transacción según la evidencia real.
6. Dejar una nota en el pedido cuando exista una novedad.

Una corrección de pago debe conservar trazabilidad. No borrar registros para ocultar errores.

## 10. Despachos y entregas

1. Confirmar pago y disponibilidad.
2. Revisar dirección, contacto y observaciones.
3. Crear el envío con las cantidades correctas.
4. Registrar transportadora y número de guía cuando exista.
5. Actualizar los estados **Enviado** y **Entregado** en el momento real.
6. Para instalaciones, registrar la coordinación en notas del pedido hasta contar con un módulo de agenda dedicado.

## 11. Rutina diaria

Al iniciar:

1. Revisar pedidos y pagos pendientes.
2. Revisar stock bajo.
3. Confirmar despachos programados.
4. Atender carritos o clientes que requieran seguimiento.

Antes de cerrar:

1. Conciliar pagos confirmados.
2. Actualizar pedidos preparados y enviados.
3. Registrar novedades.
4. Verificar que no queden pedidos sin responsable.

## 12. Seguridad

- Utilizar una contraseña única de mínimo 14 caracteres.
- Activar segundo factor.
- No seleccionar **Recordar este equipo** en computadores compartidos.
- Cerrar sesión al terminar.
- No instalar plugins ni cargar archivos ejecutables desde el administrador.
- Mantener máximo dos superadministradores de uso cotidiano.
- Conservar una cuenta de emergencia en un gestor de contraseñas empresarial.
- Informar inmediatamente accesos sospechosos.

## 13. Recuperación y soporte

Si no puede ingresar:

1. Verificar la URL y el correo.
2. Usar **Recuperar contraseña**.
3. Revisar bandeja de entrada y correo no deseado.
4. Si no llega el mensaje, solicitar al superadministrador que valide la cuenta y el correo saliente.
5. No crear una segunda cuenta para evadir el problema.

Si el panel queda cargando:

1. Recargar una vez.
2. Probar en ventana privada.
3. Registrar hora, módulo, acción y captura.
4. Informar al responsable técnico sin reiniciar la aplicación ni limpiar caché, salvo autorización.

## 14. Pendientes de endurecimiento técnico

Antes de entregar accesos masivos:

- Configurar bloqueo después de cinco intentos fallidos.
- Validar correo y segundo factor con cuentas de prueba.
- Eliminar cuentas demostrativas o compartidas.
- Reducir la duración de las sesiones administrativas.
- Actualizar las dependencias reportadas con vulnerabilidades.
- Cifrar copias de seguridad y probar restauración.
- Evaluar restricción de `/admin` mediante Cloudflare Access, VPN o IP autorizada.

