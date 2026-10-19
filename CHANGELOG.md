# 1.3.0 — 2026-10-19

- PICO document schema 1.1.0. The schema now belongs to revsis-app (`schemas/pico-document/1.1.0.schema.json`, ADR 0035); `pico-document.schema.json` is an exact copy and is not edited here.
- New **Languages** section below publication types: no restriction, or only the selected languages (ISO 639-2/B codes, as the MEDLINE language field: `eng`, `spa`, `fre`…), with a list of 23 common languages, any other three-letter code and a conditions field. Stored in `pico.languages` (`mode`, `included`, `conditions`); a completeness warning shows while it is not stated.
- Languages appear after publication types in the preview, Markdown, Word and PDF, and in the current-RS JSON projection (`components.others`), exactly as revsis-app derives it.
- Optional `import_review` block for drafts imported from Word or PDF (provenance, review marks and unplaced fragments). This version validates and keeps it; showing the marks comes later.
- Documents with schema 1.0.0 are migrated on open by adding an unstated languages block; 0.1.0 and 0.2.0 documents are still migrated too. Drafts saved by earlier versions are migrated before they are offered for recovery.

# 1.2.0 — 2026-10-17

- PICO document schema 1.0.0: JSON keys and codes in English (for example `clinical_question`, `study_designs`, `RCT`, `USUAL_CARE`). The interface and exports stay bilingual.
- Candidate catalogue schema 0.2.0: question types `intervention`, `diagnostic`, `prognosis`, `other` and English comparator codes.
- Documents with schema 0.1.0 or 0.2.0 and catalogues with schema 0.1.0 are migrated when opened or imported, without changing content or IDs (`src/migrate.js`). Drafts saved by earlier versions are migrated too.
- The current-RS JSON projection uses the English keys of `proyecto-rs` (`label`, `question_type`, `text`, `components`, `criteria_version`, `source`, `version_history`).
- Old-format examples kept as test fixtures in `tests/fixtures/`.

# 1.0.1 — 2026-10-15

- Main intervention and factor categories are bold; nested items remain indented and regular weight.
- Apply the same hierarchy to comparator/population groups, preview, Markdown, Word and PDF.
- Add Any study design / Cualquier tipo de estudio to all templates and JSON validation.
- Exclude remaining designs never inserts the catch-all option; no automatic exclusions when it is selected.
- Add Remove all to interventions, comparators, outcomes, and each study-design list, plus both design lists together. Confirm once; undo restores the complete list.

# 1.0.0 · 2026-10-14

- Local, self-contained HTML application; all libraries and PDF fonts bundled.
- Light theme on first launch, dark-mode switch, English/Spanish interface and guides.
- Rich-text fields with Word-style split colour/highlight buttons, selectable palettes, custom colours, clearing and formatting for subsequent typing.
- Drag handles and accessible up/down ordering for interventions, subitems, comparators, outcomes, designs, subpopulations and publication types.
- Separate design/comparator catalogues for intervention, diagnosis, prognosis and other questions; retained selections are flagged after a template change.
- Minimum n beside non-review design selectors, conditional-design fields, included/excluded lists and explicit remainder exclusion.
- Publication scope below study designs, with explicitly selectable additional formats.
- JSON Schema validation, stable IDs, browser draft recovery and global undo/redo.
- JSON save/open; direct PDF, editable DOCX, Markdown and current-RS text projection exports.
- Optional Python localhost launcher and Windows executable build recipe.

The abbreviated example is illustrative. Real-browser visual QA and Windows executable compilation are not included in the automated validation claim.
