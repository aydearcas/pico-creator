# Creador de PICOs 1.0.1

## Uso inmediato

1. Descomprime el ZIP completo en una carpeta de tu equipo.
2. Abre **PICO-Creator.html** con Chrome, Edge, Firefox o Safari. En Windows puedes usar **Open-PICO-Creator.cmd**.
3. Selecciona **ES** en la esquina superior derecha si la interfaz aparece en inglés.
4. Crea una PICO, elige su tipo y completa la plantilla. El tema inicial es claro; el botón de luna cambia a oscuro.
5. Guarda el **JSON** como copia editable. Exporta a **Word, PDF o Markdown** para compartir el documento.

No es necesario instalar Node ni Python para este uso. La aplicación, sus fuentes PDF y los exportadores están incluidos en el HTML y no hacen llamadas de red. No uses el `index.html` de la raíz del código fuente como distribución: el archivo listo para usar es `PICO-Creator.html`.

## Novedades de la versión 1.0.1

- Categorías principales de intervención en negrita y subcategorías con sangría y peso normal; también en las exportaciones. Los grupos de población y comparadores se destacan cuando contienen subcategorías.
- «Cualquier tipo de estudio» está disponible en todas las plantillas, con n mínima opcional. «Excluir el resto» no introduce esta opción general ni crea exclusiones automáticas cuando ya se ha elegido.
- «Eliminar todos» en intervenciones, comparadores, desenlaces y diseños de estudio. En diseños puede vaciarse cada lista o ambas. La acción pide confirmación y puede deshacerse.
- Los JSON de la versión anterior siguen siendo válidos. Para abrir un JSON con la nueva opción de diseño, utiliza la versión 1.0.1 o posterior.

## Editor

- Once propiedades: número, sección, pregunta clínica, tipo, población, intervenciones/pruebas/factores, comparadores/referencia, desenlaces, tipos de estudio, tipos de publicación y notas para revisores.
- Subpoblaciones y subintervenciones/subcomparadores añadibles. Todos los elementos repetibles tienen botones de eliminar y ordenar.
- Arrastra el tirador de seis puntos para reordenar **dentro de la misma lista**. Las flechas ofrecen la alternativa con teclado. No se mezclan incluidos y excluidos por arrastre; conserva la intención de cada lista.
- Los diseños y comparadores disponibles dependen del tipo de pregunta. En intervención no aparecen diseños de exactitud diagnóstica, predicción o cualitativos. Un criterio existente ajeno a la nueva plantilla se conserva y se marca para revisar.
- Cada diseño tiene **n mínima** al lado derecho, excepto RS y metaanálisis. Vacío significa sin umbral; no es cero. En no incluidos, un umbral se presenta como exclusión para ese diseño con n ≥ valor; si quieres excluir n menor que un umbral, indícalo en condiciones o define el mínimo en incluidos.
- Los tipos de publicación están **debajo de tipos de estudio**. «Sólo estudios completos» y «Estudios completos y otros tipos de publicaciones» son opciones excluyentes. En la segunda se seleccionan expresamente abstracts, cartas, tesis u otros formatos. No se aceptan todos automáticamente.
- Los desenlaces separan nombre y descripción. Sus detalles opcionales incluyen importancia, puntuación, momentos, instrumentos y umbrales. No se infieren de la descripción.

## Formato como en un procesador de texto

Selecciona texto y pulsa negrita, cursiva, tachado, viñetas, color o resaltado. El botón de color aplica el **último color utilizado**; la flecha abre la paleta. Puedes elegir un color personalizado y quitar el resaltado o volver a color automático. La selección se conserva al abrir la paleta. Si no seleccionas texto, el formato se aplica a lo que escribas después.

La barra actúa sobre el último campo de texto enfocado. Los colores son presentación; tachar un criterio no lo convierte en excluido. El formato admite párrafos, saltos y viñetas, sin imágenes ni tablas dentro de los campos.

## Guardado y recuperación

**Guardar JSON** conserva textos, formato, jerarquía, orden, IDs, n mínima y metadatos. **Abrir** admite el JSON canónico `pico-document` versión 0.1.0. Un PDF o DOCX no se convierte automáticamente a PICO.

Al abrir el HTML directamente, Guardar descarga un JSON. Al usar el servidor local, Chrome/Edge pueden permitir elegir un destino y sobrescribir el mismo archivo mediante el selector nativo. En Firefox/Safari u otros contextos se usa la descarga. Un guardado por descarga no confirma dónde ha colocado el navegador el archivo.

Un borrador recuperable se guarda en IndexedDB, con alternativa a localStorage, cuando el navegador lo permite. La interfaz distingue borrador y archivo. La recuperación depende del navegador y su origen; abrir la app desde otra ubicación/modo puede no mostrar ese borrador. Conserva el JSON fuera del navegador como copia principal.

Los avisos de campos pendientes no impiden guardar un borrador. Los archivos con formato no admitido o estructura inválida se rechazan. Deshacer/rehacer incluye cambios de estructura y de texto; el historial de sesión no es un historial metodológico de versiones.

## Exportaciones

- **Word:** DOCX editable, texto y tablas reales, colores, sombreado de resaltado y viñetas. A4 horizontal por defecto, con alternativa vertical.
- **PDF:** descarga directa con texto seleccionable y fuentes incluidas. Tabla de cuatro columnas o apartados; cabecera repetida en tablas largas. No se captura la pantalla.
- **Markdown:** tabla GFM o apartados. El modo portable conserva texto, negrita/cursiva/tachado pero omite colores; el modo HTML conserva marcas visuales si el visor admite sus estilos. Las viñetas en celdas pueden verse como guiones y saltos, por las limitaciones de las tablas Markdown.
- **JSON para modelo RS actual:** proyección textual de los componentes usada por `proyecto-rs`, con n, condiciones, publicaciones y notas. No sustituye al JSON canónico y no conserva el formato rico/metadatos estructurados de outcomes. Confirma el `pico_id` y versión en destino antes de importar; nunca sobrescribas una pregunta existente sin resolver ese conflicto.

La disposición y el formato de las exportaciones no afectan al archivo canónico. El idioma de los rótulos de exportación sigue el de la interfaz; no se traducen los textos redactados. Word puede paginar de forma distinta según procesador y fuentes instaladas.

## Lanzador de escritorio y ejecutable

Puedes crear un acceso directo del HTML en el escritorio y abrirlo directamente en navegador, sin requisitos adicionales.

**Servidor local opcional:** con Python 3 instalado, usa `Start-local-server.cmd` en Windows o `Start-local-server.command` en macOS/Linux. Escucha solo en `127.0.0.1:8768`; abre el navegador y muestra una ventana con Abrir/Salir si Tk está disponible. Mantén el lanzador abierto mientras uses la app. Si el puerto ya está ocupado, cierra primero la instancia anterior. El servidor sirve únicamente el HTML; los documentos se editan y guardan desde el navegador.

**Un .exe autónomo es posible:** ejecuta `desktop/build-windows-exe.cmd` en Windows con Python 3 instalado. El script crea un entorno de compilación, descarga PyInstaller y genera `desktop-output/PICO-Creator.exe`, que incorpora Python y el HTML. Para abrir ese ejecutable final no se necesita instalar Python ni Node; sí un navegador. La compilación requiere internet para obtener PyInstaller. Debe hacerse en Windows: el paquete aquí entregado no incluye un .exe compilado ni probado en Windows. Para macOS se necesita una compilación específica en macOS.

Documentación técnica: [PyInstaller y sistemas operativos](https://pyinstaller.org/en/stable/operating-mode.html).

## Desarrollo y comprobación

El código fuente está en `src/`, el contrato en `pico-document.schema.json` y un ejemplo abreviado en `examples/`. El contenido del ejemplo procede de la PICO aportada; no es un protocolo validado y deja pendiente el tipo de publicación, que no figura en la fuente.

Requiere Node 22.12 o posterior para desarrollo; el usuario del HTML no lo necesita.

```bash
npm ci
npm test
npm run build
```

La compilación genera `dist/index.html`, autocontenido. Copia ese archivo como `PICO-Creator.html` para distribuirlo. El servidor de desarrollo es una herramienta opcional para desarrolladores, no necesaria para usar el HTML distribuido.

Se verifican esquema y modelo, catálogos, reordenación, formatos, JSON y documentos generados con pruebas automatizadas. La prueba visual en un navegador real y la compilación Windows deben realizarse en el equipo de destino; no se declaran verificadas por disponer únicamente de una compilación correcta.
