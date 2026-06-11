# BEH Design System

## Dirección

**BEH — Espacios construidos con precisión.**

La portada representa la identidad completa de BEH: oficinas, mobiliario corporativo y carpintería a medida. El marketplace se especializa en productos para oficina. La experiencia debe comunicar capacidad técnica, confianza, fabricación real e instalación profesional.

## Principios

- El recorrido principal debe ser corto, comprensible y orientado a cotización.
- Las oficinas terminadas y los proyectos reales son protagonistas.
- Los planos animados explican construcción; no son decoración constante.
- Marketplace significa catálogo para cotización asistida hasta tener compra directa.
- Cada pantalla debe tener una acción principal clara.
- Animaciones, tarjetas y controles deben existir solo cuando aporten comprensión o feedback.

## Identidad

- **Marca pública:** BEH
- **Descriptor:** Oficinas y mobiliario corporativo
- **Promesa:** Diseñamos, equipamos e instalamos oficinas listas para trabajar
- No usar públicamente nombres de herramientas, agentes, proveedores o tecnología interna.

## Paleta

- **Grafito BEH:** `#1D1D1B` — fondos oscuros, navegación y texto principal.
- **Marfil arquitectónico:** `#F4F1EA` — fondo principal.
- **Blanco catálogo:** `#FCFBF8` — tarjetas, marketplace y formularios.
- **Aluminio:** `#B9B8B2` — líneas, divisores y metadatos.
- **Texto secundario:** `#67645E` — descripciones y etiquetas.
- **Naranja industrial BEH:** `#A85D22` — acciones y estados comerciales.
- **Azul técnico:** `#34789F` — exclusivamente medidas, planos, IA y estados técnicos.
- **Nogal material:** `#6F4932` — muestras y representación de materialidad, nunca acciones.

No utilizar verde o bronce como colores estructurales. El naranja debe ocupar como máximo 10–15% de cada pantalla. Evitar nuevos colores de acento.

### Contraste Autorizado

- Botón comercial: naranja industrial con texto blanco.
- Texto sobre marfil o blanco: grafito o gris mineral.
- Azul y aluminio funcionan como líneas, fondos suaves o detalles; no como texto pequeño sobre fondos claros.
- Nogal se reserva para materiales y fotografía, no para botones o navegación.

## Tipografía

- **Instrument Sans:** navegación, botones, formularios, fichas, marketplace y procesos.
- **Fraunces:** únicamente titulares principales y frases de marca.
- Párrafos con ancho máximo aproximado de `65ch`.
- Usar `text-wrap: balance` en titulares y `text-wrap: pretty` en textos largos.

## Superficies

- Tarjetas rectas o con radio máximo de `6px`.
- Bordes finos inspirados en perfilería de aluminio.
- Píldoras únicamente para filtros y estados.
- Vidrio translúcido únicamente en navegación y overlays sobre fotografía.
- Cuadrícula azul únicamente en planos y procesos técnicos.
- No usar tarjetas dentro de tarjetas.

## Movimiento

- Intensidad recomendada: `5/10`.
- Animación protagonista: hero y Obra viva.
- Revelados secundarios: `opacity + translateY(8px)`, entre `240ms` y `420ms`.
- Interacciones pequeñas: máximo `180ms`, con `cubic-bezier(0.23, 1, 0.32, 1)`.
- Todo control presionable debe responder con `scale(0.97)`.
- Animar solo `transform` y `opacity`.
- Pausar canvas y animaciones fuera del viewport.
- Respetar `prefers-reduced-motion` y Modo fluido.
- No usar cursor personalizado.

## Arquitectura Del Inicio

1. Hero
2. Confianza
3. Soluciones
4. Oficinas
5. Proyectos destacados
6. Galería de trabajos
7. Antes y después
8. Obra viva
9. Materiales y marcas
10. Planeador con IA
11. Marketplace
12. Cotizador
13. Preguntas frecuentes
14. Contacto

Experiencias secundarias deben vivir fuera del recorrido principal o integrarse en páginas específicas.

El planeador con IA es un diferenciador central de BEH y debe conservar una posición visible dentro del recorrido principal. La versión pública orienta y convierte sin entregar despieces, cortes, costos internos ni instrucciones de fabricación. La versión privada conserva simulaciones, cotizaciones y conocimiento técnico para el equipo BEH.

## Marketplace

- Presentarlo como catálogo para cotización asistida.
- Mostrar referencia, configuración, variantes y tipo de entrega.
- Mantener búsqueda y filtros accesibles.
- La siguiente evolución debe permitir agregar productos a una solicitud de cotización.

## Accesibilidad

- Mantener enlace “Saltar al contenido principal”.
- Todos los controles requieren foco visible.
- Objetivos táctiles mínimos de `44px`.
- Formularios con etiquetas, autocomplete, validación y mensajes claros.
- Controles seleccionables deben anunciar `aria-pressed`.
- Diálogos deben gestionar y devolver el foco.
- El contenido nunca puede depender de JavaScript para ser visible.

## Rendimiento

- No añadir canvas continuos adicionales.
- Imágenes nuevas deben incluir dimensiones y preferiblemente WebP/AVIF.
- No añadir listeners continuos de puntero sin protegerlos para puntero preciso.
- Evitar blur sobre contenedores que se desplazan.
- No guardar respaldos, bases de datos, credenciales o archivos comprimidos en `public_html`.

## Evitar

- Secciones repetidas explicando la misma idea.
- Múltiples formularios con la misma intención.
- Proyectos residenciales dentro del recorrido corporativo.
- Métricas no verificables.
- Copy genérico o tecnológico.
- Tres CTAs compitiendo en el mismo bloque.
- Animación por apariencia sin propósito.
- Exceso de eyebrows, numeración decorativa y cuadrículas de tres tarjetas.
