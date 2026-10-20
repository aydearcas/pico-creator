# PICO Creator 1.6.0

## Quick start

Unzip the complete package and open **PICO-Creator.html** in your browser. Windows users can also double-click **Open-PICO-Creator.cmd**. No installation, Node, Python or internet connection is required for the HTML app. All code, PDF fonts and exporters are bundled locally.

The default theme is light. Use the moon/sun button at the top right for dark/light mode, and **EN/ES** to switch language. Changing interface language does not translate your own text.

Create a question, choose its type and complete the template. **Save JSON** preserves an editable document. **Export** creates Word, PDF, Markdown or a text-based JSON for the current RS model. The source-root `index.html` is a development entry; use the bundled `PICO-Creator.html` for normal use.

## Editing

The template contains twelve properties: number, section, clinical question, question type, population, interventions/tests/factors, comparators/reference, outcomes, study designs, publication types, languages and reviewer notes. Languages, below publication types, are either unrestricted or limited to the selected ISO 639-2/B codes (as the MEDLINE language field: `eng`, `spa`, `fre`…), chosen from 23 common languages or typed as any other three-letter code.

- Add subpopulations, interventions and subinterventions, free-text or controlled comparators, outcomes and designs.
- Drag the six-dot handle to reorder **within the same list**. Up/down buttons provide a keyboard alternative. Dragging does not move items between included and excluded lists.
- Study-design and comparator catalogues adapt to the question type. Intervention questions do not offer diagnostic accuracy, prediction or qualitative designs. Existing incompatible selections are retained and flagged for review.
- Minimum n appears beside design selectors, except for systematic reviews and meta-analyses. Empty means no threshold. A minimum in the excluded list restricts that exclusion to n ≥ the stated value; specify n below a cutoff in conditions or set the minimum on the included design.
- Publication types appear below designs. Choose full reports only or full reports plus explicitly selected additional formats. Abstracts, letters, theses and other formats are not automatically included.
- Outcomes have separate names and definitions. Optional details include importance, score, instruments, time points, thresholds and minimal important difference.

## Word-style formatting

Select text and use bold, italic, strikethrough, bullets, colour or highlight. The main colour button applies the last colour; its arrow opens a palette with custom colours and clear/automatic options. Opening a palette preserves the active field's selection. With no selection, formatting applies to subsequent typing.

The toolbar targets the last focused rich-text field. Strikethrough and colour are visual formatting, not eligibility decisions. Content supports paragraphs, breaks and bullets, without embedded images or nested tables.

## Files and recovery

The canonical `.pico.json` file uses `format: pico-document`, schema 1.2.0 (English keys and codes), and preserves structure, IDs, order, rich formatting, thresholds and metadata. Open accepts this JSON. A Word or PDF file is not converted by the app: **Import from Word or PDF** (home screen) gives the prompt for revsis-app's `importar-pico` skill, which returns a `.pico.json` draft. When it opens, the editor shows the **import review**: each doubtful or missing field has a badge with the reason, quote and page, and a panel at the top lists what is pending and the text not placed. Each mark is cleared with Mark as reviewed; there is no bulk review. **Create from a question** (home screen) takes a question in plain words or as a clinical question, with an optional number and notes, and gives the prompt for revsis-app's `proponer-pico` skill (the question goes last). Its `.pico.json` draft opens with a **proposal review**: the question it came from, an **Assumed** badge on what the assistant proposed and **Not completed** on what it left for the group to decide. Files with schema 0.1.0 or 0.2.0 (Spanish keys and codes), 1.0.0 (no languages) or 1.1.0 are migrated on open without changing content or IDs. Unknown schemas and invalid structures are rejected rather than silently stripped.

Opening the HTML directly uses download-based saving. On localhost, browsers supporting File System Access can use a native file picker and save back to the same file; other browsers download the JSON. A download does not confirm the file's final directory.

A browser recovery draft uses IndexedDB, falling back to localStorage when available. It is separate from a saved JSON file and can disappear if browser data is cleared. Drafts belong to the browser and origin; moving the HTML or switching to localhost may change which draft is visible. Keep an external JSON copy.

Save permits incomplete drafts. Pending-field and coherence warnings are shown without inventing criteria. Undo/redo covers document edits and structural changes; session undo history is not a methodological version history.

## Export

- **Word:** real editable DOCX tables, paragraphs and lists; colour and highlight shading. Landscape or portrait A4. Pagination can vary between word processors.
- **PDF:** direct download with selectable text and embedded fonts. Four-column table or sections, repeated table headers and multiple pages for long content.
- **Markdown:** GFM table or sections. Portable mode drops colour/highlight formatting; HTML mode retains styled spans/marks if the viewer supports them. Lists in table cells are represented with line breaks because Markdown tables have limited formatting support.
- **Current RS JSON:** text projection for `proyecto-rs`, preserving minimum n, conditions, publication scope and notes. Confirm question identity and criteria version in the destination before importing. Rich formatting and structured outcome details remain in the canonical JSON; the projection is not a replacement for it.

Export label language follows the interface language; drafted text is not translated. Reviewer notes are included by default and can be omitted from presentation exports.

## Desktop launcher and executable

The HTML itself can be opened from a desktop shortcut without any runtime installation.

With Python 3 installed, **Start-local-server.cmd** (Windows) or **Start-local-server.command** (macOS/Linux) starts a local server on `127.0.0.1:8768` and opens the browser. A small Open/Quit window is shown when Tk is available. Keep the launcher running while using the app. If the port is busy, close the previous instance first. The server exposes only the app HTML, not your documents.

A standalone Windows executable can be built by running **desktop/build-windows-exe.cmd on Windows** with Python installed. It creates an isolated build environment, downloads PyInstaller and produces `desktop-output/PICO-Creator.exe`, containing Python and the app. Users of that final executable need a browser but do not need Python or Node. Internet is needed only to obtain the build tool. This ZIP contains the recipe, **not a compiled or Windows-tested .exe**. A macOS executable requires a separate macOS build.

See [PyInstaller operating mode](https://pyinstaller.org/en/stable/operating-mode.html).

## Source and checks

`src/` contains the application, `pico-document.schema.json` the exchange contract (an exact copy of the revsis-app schema, its source of truth), and `examples/` an abbreviated reference example. Its clinical content is illustrative, not a validated protocol. Publication scope is left unset because it was not specified in the source.

Development requires Node 22.12 or later; HTML users do not need it.

```bash
npm ci
npm test
npm run build
```

The build produces a self-contained `dist/index.html`; copy it to `PICO-Creator.html` to distribute it. Development tooling is not required for normal use.

Automated checks cover the data model, catalogues, reordering, rich-text formatting, serialization and generated documents. Visual checks in a real browser and Windows executable compilation remain to be performed on the target platform; successful compilation alone is not presented as proof of them.

## Changes in 1.0.1

Main intervention categories are bold and subitems indented, including exports. Population and comparator groups are bold when they contain subcategories. Any study design is available in every template, with an optional minimum n. Exclude remaining designs never inserts the catch-all option or infers exclusions from it. Remove all clears each main list, either design list, or both design lists with confirmation and undo. Older JSON documents remain valid; documents using the new design option require version 1.0.1 or later.

## Skill for preloaded variable catalogues

The source package includes [generate-pico-catalog](skills/generate-pico-catalog/SKILL.md). Share the complete folder with an assistant supporting skills, or provide its instructions and references as context. It generates a `.pico-catalog.json` file with Spanish/English labels and descriptions, family/child hierarchy and actually consulted sources.

Catalogue import is available in version 1.1.0. The editor has Import catalogue and a visibility switch for intervention, comparator and outcome dropdowns. Selected suggestions become editable document content and remain when the switch is off. The bundled example is fictional and illustrates structure only.


## Preloaded variables — version 1.1.0

Inside the editor, import a bilingual .pico-catalog.json file and turn on Show preloaded variables. Dropdowns add whole families or individual candidates as editable fields. Hiding suggestions preserves selections; changing language translates the options and leaves previously authored content intact.

Try dermatomyositis loads a non-exhaustive built-in example. Clinical context and sources provides the example question, scope and source limitations; Download example JSON saves its catalogue. PICO schema 1.1.0 embeds the catalogue registry and selection provenance, including drafts and undo. Older 0.1.0, 0.2.0 and 1.0.0 documents, and 0.1.0 catalogues, are migrated on open. Exports contain selected criteria only.

## Use the editor in another application

The editor is the React component `PicoEditor` (revsis-app ADR 0036). Install the repository pinned to a tag and import the compiled library:

```js
import {PicoEditor} from 'pico-creator/editor';
import 'pico-creator/editor.css';
<PicoEditor document={doc} onChange={setDoc} lang="es" theme="light"/>
```

`onChange` receives the whole document after every change; undo and redo stay inside the component. Render it with a new `key` to start a new session. Load `pico-creator/exports` (PDF, Word, Markdown, current-RS JSON) only when exporting. React 19 is a peer dependency. Set `--pico-sticky-top` to the height of your own sticky header.
