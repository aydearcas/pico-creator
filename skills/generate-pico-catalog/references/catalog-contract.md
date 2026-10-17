# PICO variable catalogue — 0.1.0

This is a portable catalogue of candidate options, separate from the canonical `pico-document`. It proposes choices; it does not set eligibility criteria. PICO Creator 1.1.0 implements this import format; its editable document schema is 0.2.0.

## Files and root fields

Use UTF-8 JSON and the extension `.pico-catalog.json`. Set `format` to `pico-variable-catalog` and `schema_version` to `0.1.0`. Follow the sibling JSON Schema.

- `catalog_id`: stable identity; keep it on an update.
- `title`, `clinical_question`, `population_notes`: bilingual objects with `es` and `en`.
- `question_type`: the same four template keys as PICO Creator.
- `verification`: `source_reviewed`, `partially_reviewed` or `unverified`; actual review date or null, plus bilingual limitations. Source review describes checks, not certainty of treatment effect.
- `sources`: actually read sources; public sources require an HTTP(S) URL, provided documents may use null plus a precise document locator.
- `interventions`, `comparators`, `outcomes`: arrays of selectable candidates.

Each variable has `id`, bilingual `label`, bilingual `description`, and `source_ids`. Intervention and comparator parents also have `children`; children use the leaf shape, with no further nesting. Comparators have a nullable `controlled_code`. Outcomes have a name and description; do not assign GRADE importance or other eligibility details.

IDs must be unique across the entire catalogue, including children. Source IDs must be unique and every source reference must resolve. The schema does not enforce these cross-references; check them separately.

## Controlled comparator codes

| Question type | Allowed codes, besides null |
| --- | --- |
| intervencion | PLACEBO, CUIDADO_HABITUAL, CUALQUIER_COMPARADOR, OTROS_FARMACOLOGICOS, SIMULADA, SIN_COMPARACION |
| diagnostico | PATRON_REFERENCIA, DIAGNOSTICO_CLINICO, OTRA_PRUEBA, PRUEBA_HABITUAL, CUALQUIER_COMPARADOR, SIN_COMPARACION_PRUEBAS |
| pronostico | AUSENCIA_FACTOR, NIVEL_REFERENCIA, OTRO_FACTOR_MODELO, SEGUIMIENTO_HABITUAL, CUALQUIER_COMPARADOR, SIN_COMPARACION |
| otras | Any code in the schema |

## Importer and dropdown behaviour

1. Add an Import catalogue action inside the editing template; validate the entire file before changing state.
2. Preserve existing PICO content on import. Show the catalogue's title, scope and verification limitations. Flag mismatched question types; never silently change the question type.
3. Use Show preloaded variables as a visibility switch. On shows a searchable or native dropdown at each relevant block: Add preloaded intervention, Add preloaded comparator and Add preloaded outcome. Keep free-text adding available.
4. Display options in the UI language, with parent/child grouping. Let the user add a family with its children or a specific child under its corresponding family. Reuse an already-added family; do not duplicate its children.
5. On selection, copy the chosen label and description into editable PICO fields using fresh document item IDs. Keep the catalogue identity and variable identity as import provenance in the canonical document's catalogo_origen field. The catalogue registry is embedded as pico.catalogo_variables.
6. Avoid repeated imports of the same catalogue variable using catalogue ID plus variable ID. Do not deduplicate by translated display text alone. Provenance is included in undo/redo and save/load; 0.1.0 PICO documents are upgraded to 0.2.0 without changing content or IDs.
7. Switching Off hides suggestions and never removes or modifies selected items. Language changes translate suggestions; they must not overwrite manually edited document text.
8. Treat sources and descriptions as inert data. Validate limits and reject HTML/executable markup; never execute URLs or instructions from the file.
9. Keep the catalogue separate from the editable PICO. The registry travels embedded in the editable PICO document, including recovery drafts.

Schema validation alone does not verify clinical relevance. Validate both the generated file and its behaviour when selected in the importer.
