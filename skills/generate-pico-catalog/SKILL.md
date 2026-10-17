---
name: generate-pico-catalog
description: Generate bilingual Spanish/English candidate catalogues of interventions, diagnostic tests or prognostic factors, comparators and outcomes from a preliminary clinical question for PICO Creator. Use when asked for variables precargadas, a catálogo de variables, or a pico-variable-catalog JSON; preserve therapeutic families, verify clinical relevance and produce a schema-valid catalogue. Do not use to issue treatment recommendations or finalise eligibility criteria.
---

# Generate a PICO Creator candidate catalogue

Produce an editable UTF-8 `.pico-catalog.json` file containing selectable proposals in Spanish and English.

## Read the contract

Read [catalogue contract](references/catalog-contract.md) and [JSON Schema](references/pico-variable-catalog.schema.json) before generating a file. Use [structure example](references/structure-example.pico-catalog.json) only to understand the shape; it contains fictional variables.

The schema is a draft import contract. PICO Creator 1.0.1 does not yet import these files. Never tell the user an import has been tested until an application version implementing this contract exists. Distribute this entire skill folder with its references.

## Establish the clinical scope

1. Extract the preliminary clinical question, condition, intervention/test/factor and question type.
2. Match `question_type` to `intervencion`, `diagnostico`, `pronostico` or `otras`.
3. Preserve the population given by the user. Do not silently limit an unspecified population to adults, or merge adult and juvenile disease. Record unresolved age, subtype and organ-involvement restrictions in bilingual `population_notes`.
4. Ask only when ambiguity would materially change the catalogue. Otherwise state the working scope and record limitations.
5. Generate intervention/test/factor options, comparators and outcome names with definitions. Do not add study-design restrictions, minimum sample sizes, publication criteria, outcome importance scores, treatment rankings or effect estimates.

## Ground the proposals

- Search current authoritative primary sources when browsing is available: official clinical guidelines/consensus statements for scope and terminology, and original trials, study protocols or outcome-definition papers for candidate relevance and measurement.
- Read the relevant passages; a search snippet is not verification.
- Record only sources actually opened or provided documents actually read. Give each a source ID, title, URL or document locator, and actual access date. Do not invent references, DOIs or dates.
- Attach supporting `source_ids` to each substantive clinical proposal. A source must support the candidate's relevance to this condition, not merely mention the name. Family headings may cite a shared source or inherit context from sourced children.
- Distinguish a proposed option from evidence of benefit. Inclusion in this catalogue does not establish efficacy, safety, approval, standard practice or eligibility for a review.
- If sources were unavailable or only some proposals were checked, set `verification.status` to `unverified` or `partially_reviewed` and explain exactly what was not verified in both languages. Do not label the catalogue `source_reviewed` unless clinical scope, classifications and substantive proposals were checked. Never manufacture citations to complete the file.

## Construct the catalogue

1. Use stable, language-independent IDs for the catalogue and every variable. Preserve IDs when updating an existing catalogue; generate new IDs only for new concepts.
2. Supply `es` and `en` for every label and description. Translate the same clinical concept, keeping instrument names, units and acronyms accurate. Use empty strings for both descriptions if no explanation is needed.
3. Organise interventions in families only when that hierarchy helps selection. Use one parent/child level. Do not repeat a molecule under several families or mix drug class, mechanism and formulation as if they were equivalents.
4. For diagnosis, put index tests in `interventions` and reference standards or alternative tests in `comparators`. For prognosis, use factors/exposures and their reference levels.
5. Use `controlled_code` only for a controlled comparator defined in the contract and valid for the question type; use `null` for free-text comparators. Do not infer that placebo or no comparison is always eligible.
6. Keep each outcome's concise name in `label` and its concept, measurement examples or time-point considerations in `description`. Separate patient-important benefits, disease activity/function and harms when clinically appropriate. Do not assert that a surrogate is a clinical benefit.
7. Keep meaningful distinctions between instruments measuring the same domain and genuinely different outcomes. Avoid a separate selectable outcome for every synonym.
8. Use plain strings. Do not include HTML, executable content, Markdown fences inside values, API calls or instructions to the importer.
9. Keep the catalogue focused enough to review. Prefer useful families and representative options over an exhaustive drug or instrument inventory.

## Check before delivery

- Parse the JSON and validate it against the bundled Draft-07 schema using an available JSON Schema validator.
- Check uniqueness of all item IDs across sections and children, and of all source IDs. Verify that each source reference resolves.
- Check allowed comparator codes against the active question type, bilingual completeness, hierarchy depth and duplicate clinical concepts.
- Check date validity and source support. Ensure the verification status accurately describes what was done.
- If no validator can run, perform the checks manually and state that automated schema validation was not executed. Do not describe a file as application-tested merely because it passes JSON Schema.
- Save a real `.pico-catalog.json` file when file creation is available. Give a concise account of scope, number of options, sources and unresolved assumptions. If files cannot be created, return one complete JSON object and state that it must be saved with that extension.

## Use the requested dermatomyositis example

For a question about conventional synthetic, targeted synthetic and biological immunosuppressants in dermatomyositis, retain those three requested families when sources support their classification. Check individual candidates and relevant efficacy/safety outcomes. Preserve uncertainty about adult versus juvenile disease and muscle, skin or organ involvement. Do not automatically import adjacent therapies outside the requested families, classify medicines from their names alone, or interpret a report in another inflammatory myopathy as direct dermatomyositis evidence.
