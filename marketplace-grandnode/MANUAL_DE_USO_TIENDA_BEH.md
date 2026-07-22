# Manual de uso y operación de la tienda BEH GrandNode

## 1. Propósito y alcance

Este manual explica cómo operar la tienda **BEH Oficinas**, construida sobre GrandNode 2.3, desde las tareas comerciales diarias hasta el mantenimiento técnico y el despliegue.

Direcciones principales:

- Tienda pública: `https://tienda.behformas.com/`
- Administración: `https://tienda.behformas.com/admin`
- Sitio institucional y cotizador empresarial: `https://behformas.com/`
- Cotizador empresarial: `https://behformas.com/#cotizador`
- Aplicación de producción en el servidor: `/home/behforma/tienda.behformas.com`
- Puerto interno de producción: `http://127.0.0.1:5080`

> **Importante:** la tienda y el sitio institucional son aplicaciones independientes. No deben compartir base de datos, sesiones ni archivos. La tienda vende referencias seleccionadas; las cotizaciones por volumen, visitas técnicas y proyectos integrales se atienden mediante el cotizador del sitio institucional.

### Roles recomendados

| Rol | Responsabilidades |
|---|---|
| Operación comercial | Productos, categorías, pedidos, clientes, descuentos y contenido |
| Logística | Inventario, preparación, envíos, entregas y notas de pedido |
| Finanzas | Pagos, impuestos, reembolsos y conciliación |
| Administrador funcional | Usuarios, permisos, configuración comercial y plugins autorizados |
| Administrador técnico | Backups, mantenimiento, despliegue, servidor y recuperación |

Las acciones sobre pagos, impuestos, plugins, base de datos, archivos de producción o despliegues deben ser realizadas o aprobadas por un administrador técnico.

---

## 2. Acceso seguro

### 2.1 Ingresar al panel

1. Abra `https://tienda.behformas.com/admin`.
2. Ingrese con su cuenta administrativa individual.
3. Confirme que el navegador muestra HTTPS y el dominio exacto `tienda.behformas.com`.
4. Al terminar, cierre sesión, especialmente en equipos compartidos.

No guarde contraseñas, tokens, cadenas de conexión ni credenciales de pago en este manual, tickets, chats o capturas de pantalla.

### 2.2 Si no puede ingresar

1. Confirme que usa `/admin` y no el acceso de cliente de la tienda.
2. Pruebe recuperación de contraseña únicamente si el correo saliente está funcionando.
3. Solicite a otro administrador que revise la cuenta en **Clientes > Clientes** y sus grupos/permisos.
4. Si la tienda completa no responde, siga la sección [19. Solución de problemas](#19-solución-de-problemas).

### 2.3 Permisos

Los permisos se administran en **Configuración > Permisos** y se asignan por grupos de clientes. Aplique el principio de menor privilegio:

- Personal de catálogo: catálogo y contenido.
- Personal comercial: pedidos, clientes y descuentos.
- Logística: pedidos y envíos.
- Finanzas: pedidos, transacciones de pago e informes necesarios.
- Administradores técnicos: configuración, sistema, plugins y mantenimiento.

Revise los accesos al menos cada trimestre y retire inmediatamente las cuentas de personas que ya no requieran acceso.

---

## 3. Rutina de operación

### 3.1 Apertura diaria

1. Abra la portada y una ficha de producto desde computador y celular.
2. Compruebe que las imágenes cargan y que los precios aparecen en COP.
3. Realice una búsqueda de producto.
4. Revise **Ventas > Pedidos** para detectar pedidos nuevos o pendientes.
5. Revise **Ventas > Transacciones de pago** antes de considerar un pago confirmado.
6. Revise **Ventas > Envíos** y los compromisos de entrega.
7. Revise **Sistema > Correos en cola** para detectar mensajes fallidos.
8. Revise productos con poco inventario en **Informes > Informe de bajo inventario**.

### 3.2 Cierre diario

1. Confirme que cada pedido nuevo tenga responsable y siguiente acción.
2. Concilie pagos aprobados, rechazados, pendientes y reembolsados.
3. Actualice envíos, números de seguimiento y notas visibles al cliente.
4. Registre excepciones comerciales en las notas del pedido.
5. Escale errores técnicos con hora, URL, pedido afectado y captura sin datos sensibles.

### 3.3 Revisión semanal

- Probar un pedido completo en un entorno seguro o con un producto de prueba autorizado.
- Revisar inventario, productos sin precio, productos no publicados y productos nunca vendidos.
- Revisar descuentos activos y sus fechas de finalización.
- Revisar correos en cola, tareas programadas y espacio disponible.
- Confirmar que existe un backup reciente y recuperable.

---

## 4. Catálogo: modelo comercial BEH

La tienda combina cuatro modalidades:

| Modalidad | Uso |
|---|---|
| Compra inmediata | Referencia cerrada, precio publicado y entrega definida |
| Fabricación bajo pedido | Producto con precio base y plazo de fabricación explícito |
| Cotización por volumen | Varias unidades, configuración especial o negociación empresarial |
| Requiere visita técnica | Divisiones, recepciones, adecuaciones y proyectos integrales |

Cada ficha debe indicar claramente:

- Qué incluye y qué no incluye.
- Precio total en COP e IVA aplicable.
- Tiempo estimado de entrega o fabricación.
- Cobertura y costo de envío.
- Si incluye ensamble o instalación.
- Medidas, materiales, acabados y garantía.
- Modalidad comercial y siguiente paso.

> **Regla:** publique precio únicamente cuando exista una configuración base clara. Si el precio depende del espacio, volumen, acabados o instalación, dirija al cliente al cotizador empresarial.

### 4.1 Recorrido actual del cliente

La tienda ofrece tres recorridos comerciales:

1. **Compra directa:** el cliente configura una referencia, define cantidad y la agrega al carrito.
2. **Compra empresarial:** desde la ficha puede solicitar precio para diez o más unidades por WhatsApp.
3. **Proyecto completo:** el cliente continúa al cotizador o al Planeador IA de BEH.

En dispositivos móviles aparece una barra de compra persistente cuando el botón principal sale de la pantalla. Esta barra activa el mismo proceso nativo de GrandNode y respeta las opciones seleccionadas.

La tienda también conserva localmente hasta seis productos vistos recientemente. Esa información permanece únicamente en el navegador del cliente y no sustituye favoritos ni historial de pedidos.

### 4.2 Transferencia o anticipo coordinado

El método inicial de pago registra el pedido en estado pendiente. Operación comercial debe:

1. Revisar producto, cantidad, ciudad y datos de contacto.
2. Confirmar disponibilidad o plazo de fabricación.
3. Cotizar transporte, ensamble e instalación cuando correspondan.
4. Compartir instrucciones de pago únicamente desde canales oficiales.
5. Verificar el abono antes de cambiar manualmente el estado del pago.

Nunca marque un pedido como pagado basándose solamente en una captura enviada por el cliente. Confirme el movimiento con el área financiera.

---

## 5. Categorías

Ruta: **Catálogo > Categorías**.

Categorías principales recomendadas:

- Escritorios y puestos de trabajo.
- Sillas.
- Salas de reunión.
- Almacenamiento.
- Recepciones y zonas comunes.
- Divisiones y adecuación.
- Accesorios.

### 5.1 Crear una categoría

1. Ingrese a **Catálogo > Categorías**.
2. Seleccione **Agregar nuevo**.
3. Escriba un nombre corto y claro.
4. Seleccione la categoría padre si es una subcategoría.
5. Añada descripción e imagen representativa.
6. Configure el orden de visualización.
7. Complete los campos SEO con título y descripción únicos.
8. Mantenga la categoría no publicada mientras la prepara.
9. Guarde, revise en la tienda y luego publíquela.

### 5.2 Buenas prácticas

- No cree categorías para un solo producto salvo necesidad comercial permanente.
- Evite duplicados con nombres similares.
- Mantenga una profundidad máxima práctica de dos o tres niveles.
- Use nombres que un cliente buscaría, no códigos internos.
- Antes de borrar una categoría, reasigne sus productos.

---

## 6. Productos

Ruta: **Catálogo > Productos**.

### 6.1 Crear un producto

1. Ingrese a **Catálogo > Productos > Agregar nuevo**.
2. Mantenga desactivado **Publicado** durante la preparación.
3. Complete como mínimo:
   - Nombre comercial.
   - SKU único.
   - Descripción corta orientada a decisión de compra.
   - Descripción completa.
   - Categorías.
   - Precio en COP.
   - Categoría de impuesto.
   - Inventario o disponibilidad.
   - Peso y dimensiones cuando afecten el envío.
   - Imágenes.
   - Título y descripción SEO.
4. Añada atributos, especificaciones, documentos y productos relacionados cuando apliquen.
5. Revise la ficha con la lista de control de publicación.
6. Active **Publicado** únicamente después de aprobar la revisión.

### 6.2 Contenido recomendado de una ficha

Use esta estructura en la descripción:

1. Resumen del producto y uso recomendado.
2. Qué incluye.
3. Dimensiones.
4. Materiales y acabados.
5. Opciones configurables.
6. Tiempo de entrega o fabricación.
7. Condiciones de ensamble e instalación.
8. Garantía.
9. Condiciones especiales para productos personalizados.
10. Enlace al cotizador cuando corresponda.

### 6.3 Atributos y especificaciones

- **Atributos de producto**: opciones que el cliente selecciona y que pueden cambiar precio, SKU o inventario; por ejemplo acabado, medida o color.
- **Atributos de especificación**: información descriptiva o filtrable; por ejemplo material, número de puestos o soporte lumbar.

Rutas:

- **Catálogo > Atributos de productos**.
- **Catálogo > Atributos de especificación**.

No cree un atributo nuevo si ya existe uno equivalente. Use nombres y valores consistentes para que los filtros funcionen.

### 6.4 Precios e inventario

- Registre precios en COP sin separadores ambiguos.
- Verifique si el precio configurado incluye o excluye impuestos según la configuración vigente.
- Use precios escalonados para cantidades solo si la regla comercial está aprobada.
- Para productos sin inventario físico inmediato, configure la disponibilidad y el plazo real; no simule existencias.
- Revise combinaciones de atributos si cada acabado o medida tiene inventario propio.

### 6.5 Duplicar o editar en masa

Use **Catálogo > Edición masiva de productos** para cambios simples y repetitivos. Antes de aplicar cambios masivos:

1. Exporte o registre el estado actual.
2. Filtre cuidadosamente los productos.
3. Cambie un grupo pequeño primero.
4. Revise el resultado en la tienda.

### 6.6 Lista de control antes de publicar

- Nombre, SKU y categoría correctos.
- Precio, IVA y moneda correctos.
- Inventario o plazo correctos.
- Modalidad comercial clara.
- Al menos una imagen principal nítida.
- Descripción, medidas, materiales, garantía y entrega completas.
- Variantes y recargos probados.
- Envío e instalación explicados.
- URL y metadatos SEO revisados.
- Vista móvil y carrito probados.

---

## 7. Imágenes y documentos

Las imágenes forman parte crítica del catálogo. En producción se consideran datos persistentes y deben incluirse en los backups.

### 7.1 Preparación

- Use fotografías reales de BEH, con autorización de uso.
- Mantenga proporción y estilo visual consistentes.
- Use fondo limpio y luz suficiente.
- Evite texto incrustado que quede ilegible en móvil.
- Nombre los archivos de forma descriptiva, por ejemplo `escritorio-ejecutivo-nogal-frente.webp`.
- Optimice el peso sin perder detalle visible.

### 7.2 Cargar imágenes de producto

1. Abra **Catálogo > Productos** y edite el producto.
2. Vaya a la sección **Imágenes**.
3. Cargue primero la imagen principal.
4. Añada vistas laterales, detalles, escala y acabados.
5. Ordene las imágenes.
6. Complete texto alternativo o título cuando el formulario lo permita.
7. Guarde y revise la ficha pública.

### 7.3 Documentos

Adjunte fichas técnicas, manuales o garantías desde la sección **Documentos** del producto cuando sea apropiado. Antes de publicar un PDF:

- Compruebe versión, fecha y marca.
- Elimine datos internos o personales.
- Confirme que medidas, materiales y garantía coinciden con la ficha.

### 7.4 Precauciones

- No borre imágenes directamente del servidor.
- No ejecute conversiones masivas desde **Sistema > Mantenimiento** sin backup.
- La producción establece `BEH_DISABLE_IMAGE_RESIZE=1`; confirme el comportamiento visual después de cargar imágenes nuevas.

---

## 8. Pedidos

Rutas principales:

- **Ventas > Pedidos**.
- **Ventas > Envíos**.
- **Ventas > Transacciones de pago**.
- **Ventas > Devoluciones de mercancía**.

### 8.1 Estados que no deben confundirse

Un pedido tiene estados independientes:

- **Estado del pedido**: ciclo comercial general.
- **Estado del pago**: pendiente, pagado, reembolsado, etc.
- **Estado del envío**: no enviado, enviado, entregado, etc.

Nunca marque un pedido como pagado basándose únicamente en un correo o captura enviada por el cliente. Confirme la transacción con el proveedor de pago o la conciliación bancaria.

### 8.2 Procesar un pedido nuevo

1. Abra el pedido desde **Ventas > Pedidos**.
2. Confirme cliente, correo, teléfono y direcciones.
3. Revise productos, cantidades, atributos y notas.
4. Confirme subtotal, descuentos, envío, impuestos y total.
5. Verifique la transacción de pago.
6. Confirme disponibilidad y plazo con logística/producción.
7. Añada una nota interna con responsable y compromiso.
8. Si corresponde, cree el envío y registre seguimiento.
9. Actualice los estados conforme ocurran los hechos.
10. Compruebe las notificaciones enviadas al cliente.

### 8.3 Notas de pedido

Use notas para dejar trazabilidad de:

- Validación del pago.
- Acuerdos de entrega.
- Cambios solicitados y aprobados.
- Novedades logísticas.
- Contactos con el cliente.
- Motivo de cancelación o reembolso.

Marque una nota como visible al cliente solo cuando su redacción sea adecuada y no contenga información interna.

### 8.4 Modificar o cancelar

Antes de modificar un pedido pagado, confirme el impacto en inventario, factura, impuesto, pago y envío. Registre siempre el motivo.

Para cancelar:

1. Detenga preparación y envío.
2. Verifique si requiere anulación o reembolso.
3. Registre una nota con autorización y motivo.
4. Cambie el estado del pedido.
5. Confirme la comunicación al cliente.

### 8.5 Reembolsos y devoluciones

1. Valide la política aplicable, especialmente para productos personalizados.
2. Confirme monto, medio de pago y autorización.
3. Ejecute el reembolso desde el proveedor o la función autorizada.
4. Registre la devolución en **Ventas > Devoluciones de mercancía** cuando aplique.
5. Actualice inventario solo después de inspeccionar el producto.
6. Conserve evidencia y notas.

---

## 9. Clientes

Ruta: **Clientes > Clientes**.

### 9.1 Gestión básica

Desde la ficha del cliente puede revisar datos de contacto, direcciones, pedidos y grupos. Corrija datos solo con autorización o solicitud verificable.

Para clientes empresariales, confirme cuando aplique:

- Razón social.
- NIT.
- Correo de facturación.
- Persona de contacto.
- Dirección de facturación y entrega.

### 9.2 Grupos y etiquetas

- Use **Clientes > Grupos de clientes** para permisos o condiciones comerciales estables.
- Use **Clientes > Etiquetas de clientes** para clasificación operativa.
- No asigne grupos administrativos a clientes normales.

### 9.3 Protección de datos

- Consulte únicamente los datos necesarios para la tarea.
- No descargue ni comparta bases de clientes sin autorización.
- No escriba datos sensibles en notas visibles al cliente.
- Atienda correcciones, eliminación o exportación de datos según la política legal vigente.

---

## 10. Descuentos

Ruta: **Marketing > Descuentos**.

GrandNode permite descuentos porcentuales o fijos, fechas de vigencia, cupones, límites de uso, acumulación y restricciones por producto, categoría, colección, marca, tienda o reglas instaladas.

### 10.1 Crear un descuento

1. Defina por escrito objetivo, público, vigencia y presupuesto.
2. Abra **Marketing > Descuentos > Agregar nuevo**.
3. Asigne un nombre interno claro.
4. Seleccione el tipo de descuento.
5. Configure porcentaje o valor fijo y su moneda.
6. Defina inicio y fin con zona horaria verificada.
7. Decida si requiere cupón.
8. Configure límites de uso y cantidad máxima descontada.
9. Defina si puede acumularse.
10. Añada productos, categorías u otras restricciones.
11. Active el descuento.
12. Pruebe casos válidos e inválidos en el carrito.

### 10.2 Reglas de seguridad comercial

- Use códigos difíciles de adivinar para campañas privadas.
- Evite descuentos acumulables salvo aprobación expresa.
- Configure fecha de finalización.
- Pruebe el descuento con impuestos y envío.
- Desactive inmediatamente campañas terminadas o erróneas.
- Revise **Veces usado** y pedidos asociados.

---

## 11. Contenido y comunicaciones

Rutas:

- **Contenido > Páginas**.
- **Contenido > Plantillas de mensajes**.
- **Contenido > Noticias**.
- **Contenido > Blog**.
- **Sistema > Formulario de contacto**.
- **Sistema > Correos en cola**.

### 11.1 Editar páginas

1. Edite primero el contenido en borrador o durante una ventana de baja demanda.
2. Mantenga lenguaje claro, precios y condiciones consistentes con el catálogo.
3. Revise enlaces, ortografía, formato móvil y SEO.
4. Verifique políticas de entrega, garantía, retracto y productos personalizados.

### 11.2 Plantillas de correo

Antes de modificar una plantilla:

1. Identifique qué evento la envía.
2. Conserve los tokens o variables existentes.
3. Envíe una prueba.
4. Revise asunto, remitente, enlaces y visualización móvil.
5. Compruebe **Sistema > Correos en cola**.

No incluya contraseñas, credenciales ni datos de pago completos en correos.

### 11.3 Tema y contenido personalizado

El tema activo esperado es **BEH Office Marketplace** (`Theme.BehOffice`). No cambie el tema, CSS personalizado, JavaScript personalizado o archivos del tema desde producción sin revisión técnica y backup.

---

## 12. Cotizaciones y visitas técnicas

### 12.1 Funcionamiento actual

Esta implementación no incluye un módulo nativo de cotizaciones dentro de GrandNode. Los botones y enlaces de compra empresarial, cotización por volumen y proyecto completo dirigen a:

`https://behformas.com/#cotizador`

Por tanto:

- Una solicitud del cotizador no crea automáticamente un pedido en GrandNode.
- Las cotizaciones se gestionan en el proceso comercial externo definido por BEH.
- Cuando una cotización aprobada se convierta en venta de tienda, debe evitarse duplicar cobros o pedidos.

### 12.2 Cuándo enviar al cotizador

- Compra por volumen.
- Medidas o acabados especiales.
- Mobiliario configurable sin precio cerrado.
- Divisiones, recepciones y adecuaciones.
- Instalación compleja o fuera de cobertura estándar.
- Proyecto que requiere visita técnica.

### 12.3 Trazabilidad recomendada

Registre para cada oportunidad:

- Fecha y canal de entrada.
- Empresa, contacto y ciudad.
- Productos/cantidades.
- Necesidad de visita técnica.
- Responsable comercial.
- Estado y siguiente acción.
- Referencia cruzada al pedido GrandNode si termina en compra.

---

## 13. Moneda e impuestos

### 13.1 Moneda

Ruta: **Configuración > Monedas**.

La moneda principal esperada es **COP**. Antes de cambiar moneda, tipo de cambio o formato:

1. Obtenga aprobación financiera.
2. Confirme la moneda principal y de visualización.
3. Revise todos los precios y descuentos fijos.
4. Pruebe carrito, pago, correos y pedido.

No cambie la moneda principal con pedidos activos sin un plan de migración.

### 13.2 Impuestos

Rutas:

- **Configuración > Impuestos > Proveedores de impuestos**.
- **Configuración > Impuestos > Categorías de impuestos**.
- **Configuración > Impuestos > Configuración de impuestos**.

Cada producto debe tener la categoría tributaria correcta. Los cambios de IVA o reglas tributarias deben ser aprobados por contabilidad y probados antes de publicarse.

Prueba mínima:

1. Producto gravado.
2. Producto con tratamiento distinto, si existe.
3. Descuento.
4. Envío.
5. Vista de carrito y checkout.
6. Pedido administrativo y correo.

> Este manual no sustituye asesoría contable o tributaria. La configuración debe reflejar la política vigente aprobada por BEH.

---

## 14. Pagos

Rutas:

- **Configuración > Pagos > Métodos de pago**.
- **Configuración > Pagos > Configuración de pagos**.
- **Configuración > Pagos > Restricciones de métodos de pago**.
- **Ventas > Transacciones de pago**.

El código incluye plugins para **BrainTree**, **Stripe Checkout** y **pago contra entrega**. Que estén incluidos no significa que estén instalados, configurados o autorizados en producción.

### 14.1 Activar o cambiar un método

1. Obtenga aprobación financiera y técnica.
2. Confirme contrato, credenciales, moneda COP y países admitidos.
3. Configure secretos fuera del código y de este manual.
4. Pruebe pago aprobado, rechazado, cancelado y reembolso.
5. Revise notificaciones/webhooks y transacciones.
6. Active el método solo después de conciliación exitosa.

### 14.2 Conciliación

- Compare el pedido con **Ventas > Transacciones de pago** y el portal del proveedor.
- Investigue diferencias de monto, moneda, comisión o estado.
- No cambie manualmente a “Pagado” sin evidencia verificable.
- Registre reembolsos y contracargos.

---

## 15. Envíos, entrega e instalación

Rutas:

- **Configuración > Envíos > Proveedores de envío**.
- **Configuración > Envíos > Métodos de envío**.
- **Configuración > Envíos > Restricciones**.
- **Configuración > Envíos > Configuración de envío**.
- **Configuración > Envíos > Medidas**.
- **Configuración > Envíos > Fechas de entrega**.
- **Configuración > Envíos > Almacenes**.
- **Configuración > Envíos > Puntos de recogida**.

El código incluye proveedores por peso, tarifa fija y punto de envío. Valide cuáles están instalados y activos.

### 15.1 Política operativa BEH

Separe y comunique claramente:

- Transporte.
- Ensamble.
- Instalación.
- Subida por escaleras.
- Visita técnica.

La cobertura inicial recomendada es Bogotá y alrededores; otras ciudades requieren validación.

### 15.2 Crear y completar un envío

1. Confirme pago, inventario y dirección.
2. Prepare y verifique cantidades/variantes.
3. Abra el pedido y cree el envío.
4. Registre transportador, seguimiento y fecha estimada.
5. Marque enviado únicamente cuando haya salido físicamente.
6. Marque entregado con confirmación.
7. Registre novedades en notas.

Pruebe tarifas con productos livianos, pesados, voluminosos, varias unidades y destinos fuera de cobertura.

---

## 16. Mantenimiento funcional y técnico

### 16.1 Herramientas administrativas

Rutas relevantes:

- **Sistema > Información del sistema**.
- **Sistema > Correos en cola**.
- **Sistema > Mantenimiento**.
- **Sistema > Tareas programadas**.
- **Plugins > Plugins locales**.
- **Configuración > Nombres amigables para buscadores**.

En **Sistema > Mantenimiento** existen operaciones como eliminar invitados, limpiar productos más vistos, eliminar archivos exportados y convertir imágenes. Algunas son irreversibles o intensivas: ejecútelas solo con autorización y backup reciente.

### 16.2 Tareas programadas

Revise que las tareas necesarias estén habilitadas y ejecutándose. Si una tarea falla:

1. Registre nombre, última ejecución y error.
2. Corrija la causa antes de forzar múltiples ejecuciones.
3. Ejecútela manualmente una sola vez si es seguro.
4. Verifique el resultado.

### 16.3 Plugins

No instale, desinstale, actualice ni recargue plugins directamente en producción sin:

1. Backup.
2. Prueba en desarrollo.
3. Ventana de mantenimiento.
4. Plan de reversión.

### 16.4 Archivos y datos que deben persistir

- Base de datos activa.
- `App_Data/`.
- Imágenes y otros medios persistentes.
- Configuración de producción.
- Secretos gestionados fuera del repositorio.
- Registros necesarios para diagnóstico.

---

## 17. Backups y restauración

### 17.1 Verificar primero el proveedor de base de datos

Existe una diferencia que debe resolverse antes de cada backup o despliegue:

- La arquitectura documentada para producción indica **MongoDB administrado**.
- El archivo incluido `deploy/production.Settings.cfg` configura actualmente **LiteDB** con `Filename=App_Data/beh-marketplace.db` y `DbProvider=3`.

No asuma cuál está activo. Verifique el archivo real:

```bash
cd /home/behforma/tienda.behformas.com
cat App_Data/Settings.cfg
```

No publique el contenido del archivo si incluye credenciales.

### 17.2 Contenido mínimo de un backup

Un backup completo debe incluir:

1. Base de datos activa: MongoDB o archivo LiteDB.
2. `App_Data/`.
3. Imágenes/medios persistentes.
4. Configuración de producción y proxy, sin exponer secretos.
5. Versión desplegada o identificador del código.

Conserve copias fuera del mismo servidor y aplique cifrado, control de acceso y retención aprobada.

### 17.3 Backup de LiteDB

Para una copia consistente, detenga temporalmente la aplicación o use el procedimiento validado por el administrador técnico:

```bash
APP_ROOT=/home/behforma/tienda.behformas.com
BACKUP_ROOT=/ruta/segura/backups/beh-$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_ROOT"
pkill -x Grand.Web
cp -a "$APP_ROOT/App_Data" "$BACKUP_ROOT/"
cp -a "$APP_ROOT/wwwroot/assets/images" "$BACKUP_ROOT/images"
"$APP_ROOT/start-production.cgi" >/dev/null
```

La ruta real de imágenes y la disponibilidad de `start-production.cgi` en la raíz deben verificarse antes de ejecutar el procedimiento. El proyecto base de GrandNode usa `wwwroot/assets/images`, pero el almacenamiento puede estar configurado de otra forma.

### 17.4 Backup de MongoDB

Use las herramientas y credenciales del servicio administrado. Ejemplo conceptual:

```bash
mongodump --uri="$MONGODB_URI" --out="/ruta/segura/backups/beh-mongo-$(date +%Y%m%d-%H%M%S)"
```

No escriba la URI directamente en el historial del shell. Prefiera variables protegidas o el mecanismo del proveedor.

### 17.5 Restauración

La restauración debe probarse periódicamente en un entorno aislado.

Procedimiento general:

1. Identifique versión de código, proveedor de base de datos y fecha del backup.
2. Detenga la aplicación.
3. Respalde el estado dañado antes de reemplazarlo.
4. Restaure base de datos, `App_Data` e imágenes compatibles.
5. Revise permisos de archivos.
6. Inicie la aplicación.
7. Pruebe portada, administración, producto, carrito, pedido, imágenes y correo.
8. Documente resultado y tiempo de recuperación.

Nunca pruebe una restauración destructiva por primera vez sobre producción.

---

## 18. Despliegue

### 18.1 Arquitectura de producción incluida

- Raíz: `/home/behforma/tienda.behformas.com`.
- Ejecutable: `/home/behforma/tienda.behformas.com/Grand.Web`.
- Staging: `/home/behforma/tienda.behformas.com/.staging`.
- Log: `/home/behforma/tienda.behformas.com/App_Data/production.log`.
- Aplicación interna: `127.0.0.1:5080`.
- Proxy HTTPS: Apache mediante reglas equivalentes a `deploy/proxy.htaccess`.
- Vigilancia: `ensure-production.sh`, prevista cada 5 minutos.

`deploy/deploy-store.sh` crea un bloqueo `.deploying`, detiene `Grand.Web`, mueve archivos de `.staging` a la raíz y vuelve a iniciar la aplicación.

### 18.2 Preparar una versión

Requisitos de desarrollo:

- .NET SDK 9; `global.json` solicita `9.0.100` con avance a la última feature compatible.

Comandos base:

```bash
cd marketplace-grandnode
dotnet build src/Plugins/Theme.BehOffice/Theme.BehOffice.csproj -c Release
dotnet publish src/Web/Grand.Web/Grand.Web.csproj -c Release -o ./publish
```

Antes de desplegar:

1. Revise cambios y versión.
2. Ejecute build y pruebas aplicables.
3. Confirme que el tema `Theme.BehOffice` está incluido.
4. Tome backup completo.
5. Confirme proveedor de base de datos y configuración.
6. Asegure que instalador, migración y API estén deshabilitados si esa es la política de producción.
7. Prepare plan de reversión.
8. Anuncie ventana de mantenimiento.

### 18.3 Publicar

El flujo esperado es subir los archivos publicados a `.staging` y permitir que `deploy-store.sh` haga el reemplazo con la aplicación detenida. No reemplace manualmente archivos en uso.

Después de cargar `.staging`, ejecute por el mecanismo autorizado:

```bash
/home/behforma/tienda.behformas.com/deploy-store.sh
```

### 18.4 Validación posterior

1. Confirme proceso y respuesta interna:

```bash
pgrep -a Grand.Web
curl --fail --max-time 10 -H "Host: tienda.behformas.com" http://127.0.0.1:5080/
```

2. Revise el log:

```bash
tail -n 100 /home/behforma/tienda.behformas.com/App_Data/production.log
```

3. Pruebe públicamente:
   - Portada.
   - Categoría y producto.
   - Búsqueda.
   - Imágenes.
   - Carrito y checkout.
   - Acceso administrativo.
   - Correos.
   - Enlace al cotizador.

4. Vigile errores, memoria y proceso durante la ventana posterior.

### 18.5 Reversión

Si la validación falla:

1. Detenga la aplicación.
2. Restaure los binarios anteriores.
3. Restaure datos solo si el despliegue los modificó y existe compatibilidad confirmada.
4. Inicie la aplicación.
5. Repita la validación.
6. Documente causa y acciones.

No restaure una base de datos antigua únicamente para corregir un problema de interfaz.

---

## 19. Solución de problemas

### 19.1 La tienda pública no responde

1. Compruebe si el proceso existe:

```bash
pgrep -a Grand.Web
```

2. Pruebe la aplicación interna:

```bash
curl --fail --max-time 10 -H "Host: tienda.behformas.com" http://127.0.0.1:5080/
```

3. Revise:

```bash
tail -n 100 /home/behforma/tienda.behformas.com/App_Data/production.log
```

4. Si no hay despliegue en curso, ejecute el mecanismo autorizado `ensure-production.sh` o `deploy-store.sh`.
5. Si responde internamente pero no por HTTPS, revise DNS, certificado y proxy.

### 19.2 Error 500 o pantalla en blanco

- Registre hora y URL.
- Revise `App_Data/production.log`.
- Verifique configuración, permisos, espacio en disco y conexión a base de datos.
- Determine si comenzó después de un despliegue o cambio administrativo.
- Revierta la versión si el error coincide con el despliegue.
- No active trazas completas públicamente en producción.

### 19.3 No cargan imágenes

- Pruebe varias imágenes y productos.
- Confirme que los archivos persistentes existen y tienen permisos de lectura.
- Revise espacio en disco.
- Revise errores en el log y consola del navegador.
- Recuerde que producción usa `BEH_DISABLE_IMAGE_RESIZE=1`.
- No borre cachés o regenere imágenes masivamente sin backup.

### 19.4 Un producto no aparece

Revise:

- **Publicado** activado.
- Fechas de inicio/fin.
- Categoría publicada.
- Restricciones de tienda o grupo.
- Inventario y reglas para ocultar agotados.
- URL amigable.
- Caché y búsqueda.

### 19.5 Precio, IVA o descuento incorrecto

1. Desactive temporalmente la promoción errónea si está afectando ventas.
2. Revise precio y categoría tributaria del producto.
3. Revise moneda principal y formato.
4. Revise descuento, acumulación, vigencia y restricciones.
5. Pruebe con sesión limpia y un carrito nuevo.
6. Documente pedidos afectados para corrección financiera.

### 19.6 Pago aprobado pero pedido pendiente

- Compare pedido, transacción GrandNode y portal del proveedor.
- Revise webhook/notificación y logs.
- Confirme monto, moneda e identificador.
- Actualice manualmente solo con autorización y evidencia.
- Evite cobrar de nuevo antes de investigar.

### 19.7 No llegan correos

- Revise **Sistema > Correos en cola**.
- Revise **Configuración > Cuentas de correo**.
- Compruebe credenciales, remitente, DNS y límites del proveedor.
- Reintente un mensaje de prueba después de corregir la causa.
- No reenvíe en masa sin revisar duplicados.

### 19.8 Envío no disponible

- Confirme que el producto requiere envío.
- Revise peso, dimensiones y dirección.
- Revise proveedor/método activo, restricciones y cobertura.
- Pruebe con una dirección conocida.
- Verifique que el método soporte la combinación de productos.

### 19.9 El panel administrativo oculta una opción

- Revise permisos del grupo administrativo.
- Confirme que el módulo o plugin está habilitado.
- Cierre sesión y vuelva a ingresar después de cambiar permisos.
- No conceda acceso total como solución permanente.

### 19.10 Base de datos bloqueada o dañada

- Detenga la aplicación para evitar más escrituras.
- Determine si el proveedor activo es LiteDB o MongoDB.
- Preserve una copia del estado actual.
- Restaure en entorno aislado o siga el procedimiento del proveedor.
- No edite manualmente la base de datos de producción sin una operación validada.

---

## 20. Lista de control para cambios sensibles

Use esta lista antes de cambiar impuestos, pagos, envíos, plugins, configuración, datos masivos o desplegar:

- [ ] Cambio y responsable aprobados.
- [ ] Impacto comercial y técnico identificado.
- [ ] Backup reciente confirmado.
- [ ] Procedimiento de reversión preparado.
- [ ] Prueba realizada fuera de producción.
- [ ] Ventana y comunicación definidas.
- [ ] Cambio aplicado por persona autorizada.
- [ ] Portada, producto, carrito y administración verificados.
- [ ] Pago, envío, impuesto o correo verificado según corresponda.
- [ ] Resultado y evidencia documentados.

---

## 21. Registro de incidentes

Para facilitar el diagnóstico, cada incidente debe incluir:

- Fecha, hora y zona horaria.
- Persona que reporta.
- URL o sección afectada.
- Pasos exactos para reproducir.
- Resultado esperado y resultado observado.
- Pedidos/SKU afectados, sin exponer datos sensibles.
- Capturas seguras.
- Cambios recientes.
- Extracto relevante del log.
- Acción tomada y resultado.

No incluya contraseñas, tokens, cadenas de conexión, datos completos de tarjetas ni información personal innecesaria.

---

## 22. Referencias internas del repositorio

Estos archivos complementan el manual:

- `BEH_MARKETPLACE_SETUP.md`: arquitectura y configuración inicial.
- `BEH_CATALOG_BLUEPRINT.md`: modelo comercial y catálogo recomendado.
- `appsettings.Production.example.json`: referencia de configuración segura de producción.
- `deploy/deploy-store.sh`: reemplazo e inicio de la aplicación.
- `deploy/ensure-production.sh`: comprobación y reinicio de la aplicación.
- `deploy/production.Settings.cfg`: configuración de base de datos incluida; verificar antes de usar.
- `deploy/proxy.htaccess`: referencia del proxy hacia `127.0.0.1:5080`.

La configuración efectiva del servidor siempre prevalece sobre los ejemplos del repositorio y debe verificarse antes de una intervención.
