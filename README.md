# PICO Creator 1.0.1

[Español](README_ES.md) · [English](README_EN.md)

Open **PICO-Creator.html** in your browser. Everything is bundled; no installation or internet connection is needed. On Windows you can also double-click **Open-PICO-Creator.cmd**.

Abre **PICO-Creator.html** en el navegador. Todo está incluido: no necesita instalación ni conexión a internet. En Windows también puedes hacer doble clic en **Open-PICO-Creator.cmd**.

For an optional desktop executable, see `desktop/build-windows-exe.cmd` and the language-specific guide. The package includes the build recipe, not a compiled Windows executable.

Para crear opcionalmente un ejecutable de escritorio, consulta `desktop/build-windows-exe.cmd` y la guía en tu idioma. Este paquete incluye el procedimiento de compilación, no un ejecutable Windows ya compilado.

## GitHub Pages

The `docs/` folder contains the standalone web version, ready to publish. In repository **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/docs**. No dependency installation or build step is needed.

La carpeta `docs/` contiene la versión web lista para publicar. En **Settings → Pages**, selecciona **Deploy from a branch**, rama **main**, carpeta **/docs**. No necesita instalar dependencias ni compilar.

## Reusable catalogue-generation skill

The package includes [generate-pico-catalog](skills/generate-pico-catalog/SKILL.md), a reusable skill for an LLM to produce Spanish/English candidate variables from a preliminary clinical question. Its folder contains instructions, the draft JSON Schema and a fictional structural example; keep the folder together when sharing it with an assistant. The source ZIP includes this folder.

**Status:** this is the draft catalogue-generation contract. Version 1.0.1 of the application does not yet import these catalogues. The planned editor controls are an Import catalogue action and a visibility switch for per-component dropdowns. Selecting an option will add editable content; turning the switch off will preserve added content.

La skill está incluida en el paquete para generar catálogos bilingües. La importación y los desplegables se implementarán en una próxima versión; el ejemplo incluido solo ilustra la estructura y no contiene propuestas clínicas.
