# PICO Creator 1.1.0

[Español](README_ES.md) · [English](README_EN.md)

Open **PICO-Creator.html** in your browser. Everything is bundled; no installation or internet connection is needed. On Windows you can also double-click **Open-PICO-Creator.cmd**.

Abre **PICO-Creator.html** en el navegador. Todo está incluido: no necesita instalación ni conexión a internet. En Windows también puedes hacer doble clic en **Open-PICO-Creator.cmd**.

For an optional desktop executable, see `desktop/build-windows-exe.cmd` and the language-specific guide. The package includes the build recipe, not a compiled Windows executable.

Para crear opcionalmente un ejecutable de escritorio, consulta `desktop/build-windows-exe.cmd` y la guía en tu idioma. Este paquete incluye el procedimiento de compilación, no un ejecutable Windows ya compilado.

## GitHub Pages

The `docs/` folder contains the standalone web version, ready to publish. In repository **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/docs**. No dependency installation or build step is needed.

La carpeta `docs/` contiene la versión web lista para publicar. En **Settings → Pages**, selecciona **Deploy from a branch**, rama **main**, carpeta **/docs**. No necesita instalar dependencias ni compilar.

## Preloaded variable catalogues

From the editor, use **Import catalogue** to open a bilingual .pico-catalog.json file. **Show preloaded variables** displays dropdowns for interventions, comparators and outcomes. Select a family or an individual option; selections become editable fields and remain when suggestions are hidden. Suggestions follow the interface language; previously selected text keeps its authored language.

**Try dermatomyositis** loads the built-in demonstration. Under **Clinical context and sources**, use **Use this clinical question** to copy the example question. **Download example JSON** saves its catalogue.

The catalogue registry and selection provenance are embedded in the editable PICO JSON (schema 0.2.0), including drafts and undo/redo. Existing 0.1.0 documents remain readable. Opening a 0.2.0 file in older app versions is unsupported. Word, PDF and Markdown export selected criteria, not the suggestion registry.

The package includes the reusable [generate-pico-catalog skill](skills/generate-pico-catalog/SKILL.md), its schema and an example. Share the entire skill folder with an assistant. Candidate catalogues are suggestions; check their clinical scope and source limitations before defining eligibility.
