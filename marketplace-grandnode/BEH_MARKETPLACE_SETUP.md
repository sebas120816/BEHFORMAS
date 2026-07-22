# BEH Marketplace

GrandNode 2.3 adaptado como tienda independiente de mobiliario corporativo BEH.

## Arquitectura

- Sitio institucional: `https://behformas.com`
- Tienda: `https://tienda.behformas.com`
- Desarrollo local: LiteDB
- Produccion actual: LiteDB persistente, respaldos controlados y proxy HTTPS
- Tema propio: `src/Plugins/Theme.BehOffice`

La tienda no debe publicarse dentro de `public_html` ni compartir sesiones, archivos o base de datos con el sitio institucional.

## Integracion con behformas.com

- La web principal usa enlaces con `data-store-link`.
- En desarrollo abren `http://127.0.0.1:5080/`.
- En produccion apuntan a `https://tienda.behformas.com/`.
- Configura el DNS del subdominio `tienda` y el proxy HTTPS de GrandNode antes de publicar.
- El tema enlaza de regreso a la pagina principal, proyectos, Planeador IA y cotizacion empresarial.

## Ejecutar localmente

Requisitos:

- .NET SDK 9

Comandos:

```bash
dotnet build src/Plugins/Theme.BehOffice/Theme.BehOffice.csproj
dotnet run --project src/Web/Grand.Web/Grand.Web.csproj
```

Abrir la URL mostrada por ASP.NET y completar el instalador usando LiteDB. Instalar y seleccionar el tema `BEH Office Marketplace`.

## Configuracion inicial

1. Idioma principal: espanol de Colombia.
2. Moneda principal: COP.
3. Nombre: `BEH Oficinas`.
4. Categorias: escritorios, sillas, salas de reunion, almacenamiento, recepciones, divisiones y accesorios.
5. Diferenciar compra directa, fabricacion bajo pedido, visita tecnica y cotizacion por volumen.
6. Mostrar precios totales, IVA aplicable, entrega, instalacion, garantia y tiempos.

## Produccion

Usar `appsettings.Production.example.json` como referencia y suministrar secretos mediante variables de entorno o un gestor de secretos. Antes de publicar:

- Publicar `deploy/production.Settings.cfg` como `App_Data/Settings.cfg`; GrandNode usa este archivo para resolver la base instalada.
- Subir binarios a `.staging` y permitir que `deploy-store.sh` los sustituya con GrandNode detenido.
- Deshabilitar el instalador.
- Restringir hosts y acceso a `App_Data`.
- Activar HTTPS, cookies seguras y cabeceras de seguridad.
- Configurar backups de LiteDB, imágenes y `App_Data`.
- Probar carrito, pagos, correo, facturacion, entrega y restauracion.
