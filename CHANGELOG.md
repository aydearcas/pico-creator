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
