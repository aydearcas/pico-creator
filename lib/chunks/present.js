import Ajv from "ajv";
const $schema$1 = "http://json-schema.org/draft-07/schema#";
const $id = "https://revsis.local/schemas/pico-document-1.1.0.json";
const title$1 = "PICO document 1.1.0";
const description = "Portable, rich clinical question. UTF-8; one question per file. Source of truth: revsis-app schemas/pico-document/ (ADR 0035); PICO Creator keeps an exact copy.";
const type$1 = "object";
const properties$1 = { "format": { "const": "pico-document" }, "schema_version": { "const": "1.1.0" }, "text_format": { "const": "richtext-v1" }, "document_id": { "type": "string", "minLength": 1 }, "document_revision": { "type": "integer", "minimum": 0 }, "created_at": { "type": "string" }, "updated_at": { "type": "string" }, "review_link": { "type": ["object", "null"] }, "pico": { "type": "object", "properties": { "number": { "type": "string" }, "section": { "$ref": "#/$defs/rich" }, "clinical_question": { "$ref": "#/$defs/rich" }, "question_type": { "type": "object", "properties": { "code": { "enum": ["INTERVENTION", "SAFETY", "DIAGNOSTIC", "PROGNOSIS", "PREDICTION", "ETIOLOGY", "EXPOSURE", "PREVALENCE", "QUALITATIVE", "OTHER"] }, "template": { "enum": ["intervention", "diagnostic", "prognosis", "other"] }, "template_version": { "type": "string" } }, "required": ["code", "template", "template_version"] }, "criteria_version": { "type": "string" }, "population": { "type": "object", "properties": { "text": { "$ref": "#/$defs/rich" }, "subpopulations": { "type": "array", "maxItems": 1e3, "items": { "type": "object", "properties": { "id": { "type": "string", "minLength": 1 }, "text": { "$ref": "#/$defs/rich" } }, "required": ["id", "text"] } } }, "required": ["text", "subpopulations"] }, "interventions": { "type": "array", "maxItems": 1e3, "items": { "$ref": "#/$defs/free" } }, "comparators": { "type": "array", "maxItems": 1e3, "items": { "$ref": "#/$defs/comparator" } }, "outcomes": { "type": "array", "maxItems": 1e3, "items": { "$ref": "#/$defs/outcome" } }, "study_designs": { "type": "object", "properties": { "catalog_version": { "type": "string" }, "included": { "type": "array", "maxItems": 1e3, "items": { "$ref": "#/$defs/design" } }, "excluded": { "type": "array", "maxItems": 1e3, "items": { "$ref": "#/$defs/design" } }, "remainder_excluded": { "type": "boolean" } }, "required": ["catalog_version", "included", "excluded", "remainder_excluded"] }, "publication_types": { "type": "object", "properties": { "mode": { "enum": [null, "FULL_REPORTS_ONLY", "FULL_REPORTS_AND_OTHERS"] }, "additional": { "type": "array", "maxItems": 1e3, "items": { "$ref": "#/$defs/publication" } }, "conditions": { "$ref": "#/$defs/rich" } }, "required": ["mode", "additional", "conditions"] }, "reviewer_notes": { "$ref": "#/$defs/rich" }, "variable_catalogs": { "anyOf": [{ "type": "null" }, { "type": "object", "additionalProperties": false, "required": ["catalogs", "active_id", "visible"], "properties": { "catalogs": { "type": "array", "maxItems": 20, "items": { "$ref": "#/$defs/variableCatalog" } }, "active_id": { "type": ["string", "null"] }, "visible": { "type": "boolean" } } }] }, "languages": { "$ref": "#/$defs/languages" } }, "required": ["number", "section", "clinical_question", "question_type", "criteria_version", "population", "interventions", "comparators", "outcomes", "study_designs", "publication_types", "languages", "reviewer_notes"] }, "import_review": { "anyOf": [{ "type": "null" }, { "$ref": "#/$defs/importReview" }] } };
const required$1 = ["format", "schema_version", "text_format", "document_id", "document_revision", "created_at", "updated_at", "review_link", "pico"];
const $defs$1 = /* @__PURE__ */ JSON.parse('{"node":{"type":"object","properties":{"type":{"enum":["doc","paragraph","text","hardBreak","bulletList","listItem"]},"text":{"type":"string","minLength":1},"content":{"type":"array","maxItems":1000,"items":{"$ref":"#/$defs/node"}},"marks":{"type":"array","maxItems":1000,"items":{"$ref":"#/$defs/mark"}}},"required":["type"]},"mark":{"type":"object","properties":{"type":{"enum":["bold","italic","strike","highlight","textStyle"]},"attrs":{"type":"object","properties":{"color":{"type":["string","null"],"pattern":"^#[0-9a-fA-F]{6}$"}},"required":[]}},"required":["type"]},"rich":{"allOf":[{"$ref":"#/$defs/node"},{"properties":{"type":{"const":"doc"}},"required":["type","content"]}]},"child":{"type":"object","properties":{"id":{"type":"string","minLength":1},"text":{"$ref":"#/$defs/rich"},"children":{"type":"array","maxItems":0},"catalog_origin":{"$ref":"#/$defs/catalogProvenance"}},"required":["id","text","children"]},"free":{"type":"object","properties":{"id":{"type":"string","minLength":1},"text":{"$ref":"#/$defs/rich"},"children":{"type":"array","maxItems":1000,"items":{"$ref":"#/$defs/child"}},"catalog_origin":{"$ref":"#/$defs/catalogProvenance"}},"required":["id","text","children"]},"design":{"type":"object","properties":{"id":{"type":"string","minLength":1},"code":{"enum":["ANY_DESIGN","SYSTEMATIC_REVIEW","META_ANALYSIS","RCT","NON_RANDOMIZED_TRIAL","OBSERVATIONAL_ANY","OBSERVATIONAL_COMPARATIVE","OBSERVATIONAL_NON_COMPARATIVE","CASE_SERIES","CASE_REPORT","DIAGNOSTIC_ACCURACY","PREDICTION_MODEL","QUALITATIVE_STUDY","OTHER",""]},"min_n":{"type":["integer","null"],"minimum":1},"conditions":{"$ref":"#/$defs/rich"}},"required":["id","code","min_n","conditions"],"allOf":[{"if":{"properties":{"code":{"enum":["SYSTEMATIC_REVIEW","META_ANALYSIS"]}}},"then":{"properties":{"min_n":{"type":"null"}}}}]},"comparator":{"oneOf":[{"type":"object","properties":{"id":{"type":"string","minLength":1},"mode":{"const":"FREE"},"role":{"enum":["COMPARATOR","REFERENCE_STANDARD","OTHER"]},"text":{"$ref":"#/$defs/rich"},"children":{"type":"array","maxItems":1000,"items":{"$ref":"#/$defs/child"}},"catalog_origin":{"$ref":"#/$defs/catalogProvenance"}},"required":["id","mode","role","text","children"]},{"type":"object","properties":{"id":{"type":"string","minLength":1},"mode":{"const":"CONTROLLED"},"role":{"enum":["COMPARATOR","REFERENCE_STANDARD","OTHER"]},"code":{"enum":["PLACEBO","USUAL_CARE","ANY_COMPARATOR","OTHER_PHARMACOLOGICAL","SHAM","NO_COMPARISON","REFERENCE_STANDARD","CLINICAL_DIAGNOSIS","OTHER_TEST","USUAL_TEST","NO_TEST_COMPARISON","FACTOR_ABSENT","REFERENCE_LEVEL","OTHER_FACTOR_OR_MODEL","USUAL_FOLLOW_UP",""]},"specification":{"$ref":"#/$defs/rich"},"children":{"type":"array","maxItems":1000,"items":{"$ref":"#/$defs/child"}},"catalog_origin":{"$ref":"#/$defs/catalogProvenance"}},"required":["id","mode","role","code","specification","children"]}]},"outcome":{"type":"object","properties":{"id":{"type":"string","minLength":1},"name":{"$ref":"#/$defs/rich"},"description":{"$ref":"#/$defs/rich"},"details":{"type":"object","properties":{"importance":{"enum":[null,"CRITICAL","IMPORTANT","NOT_IMPORTANT"]},"score":{"type":["integer","null"],"minimum":1,"maximum":9},"timepoints":{"type":"array","maxItems":1000,"items":{"type":"string"}},"instruments":{"type":"array","maxItems":1000,"items":{"type":"string"}},"thresholds":{"type":"array","maxItems":1000,"items":{"type":"string"}},"minimal_important_difference":{"type":["string","null"]}},"required":["importance","score","timepoints","instruments","thresholds","minimal_important_difference"]},"catalog_origin":{"$ref":"#/$defs/catalogProvenance"}},"required":["id","name","description","details"]},"publication":{"type":"object","properties":{"id":{"type":"string","minLength":1},"code":{"enum":["","ABSTRACT","LETTER","THESIS","REPORT","PREPRINT","OTHER","ANY"]},"clarification":{"$ref":"#/$defs/rich"}},"required":["id","code","clarification"]},"variableCatalog":{"title":"PICO Creator candidate variable catalogue 0.2.0","type":"object","additionalProperties":false,"required":["format","schema_version","catalog_id","title","question_type","clinical_question","population_notes","verification","sources","interventions","comparators","outcomes"],"properties":{"format":{"const":"pico-variable-catalog"},"schema_version":{"const":"0.2.0"},"catalog_id":{"$ref":"#/$defs/variableCatalog/$defs/id"},"title":{"$ref":"#/$defs/variableCatalog/$defs/bilingual"},"question_type":{"enum":["intervention","diagnostic","prognosis","other"]},"clinical_question":{"$ref":"#/$defs/variableCatalog/$defs/bilingual"},"population_notes":{"$ref":"#/$defs/variableCatalog/$defs/note"},"verification":{"type":"object","additionalProperties":false,"required":["status","checked_on","limitations"],"properties":{"status":{"enum":["source_reviewed","partially_reviewed","unverified"]},"checked_on":{"type":["string","null"],"pattern":"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"},"limitations":{"$ref":"#/$defs/variableCatalog/$defs/note"}}},"sources":{"type":"array","maxItems":100,"items":{"$ref":"#/$defs/variableCatalog/$defs/source"}},"interventions":{"type":"array","maxItems":100,"items":{"$ref":"#/$defs/variableCatalog/$defs/intervention"}},"comparators":{"type":"array","maxItems":100,"items":{"$ref":"#/$defs/variableCatalog/$defs/comparator"}},"outcomes":{"type":"array","maxItems":100,"items":{"$ref":"#/$defs/variableCatalog/$defs/outcome"}}},"$defs":{"id":{"type":"string","minLength":1,"maxLength":160,"pattern":"^[a-zA-Z0-9][a-zA-Z0-9._:-]*$"},"bilingual":{"type":"object","additionalProperties":false,"required":["es","en"],"properties":{"es":{"type":"string","minLength":1,"maxLength":6000},"en":{"type":"string","minLength":1,"maxLength":6000}}},"note":{"type":"object","additionalProperties":false,"required":["es","en"],"properties":{"es":{"type":"string","minLength":0,"maxLength":6000},"en":{"type":"string","minLength":0,"maxLength":6000}}},"leaf":{"type":"object","additionalProperties":false,"required":["id","label","description","source_ids"],"properties":{"id":{"$ref":"#/$defs/variableCatalog/$defs/id"},"label":{"$ref":"#/$defs/variableCatalog/$defs/bilingual"},"description":{"$ref":"#/$defs/variableCatalog/$defs/note"},"source_ids":{"type":"array","maxItems":50,"uniqueItems":true,"items":{"$ref":"#/$defs/variableCatalog/$defs/id"}}}},"intervention":{"type":"object","additionalProperties":false,"required":["id","label","description","source_ids","children"],"properties":{"id":{"$ref":"#/$defs/variableCatalog/$defs/id"},"label":{"$ref":"#/$defs/variableCatalog/$defs/bilingual"},"description":{"$ref":"#/$defs/variableCatalog/$defs/note"},"source_ids":{"type":"array","maxItems":50,"uniqueItems":true,"items":{"$ref":"#/$defs/variableCatalog/$defs/id"}},"children":{"type":"array","maxItems":100,"items":{"$ref":"#/$defs/variableCatalog/$defs/leaf"}}}},"comparator":{"type":"object","additionalProperties":false,"required":["id","label","description","source_ids","controlled_code","children"],"properties":{"id":{"$ref":"#/$defs/variableCatalog/$defs/id"},"label":{"$ref":"#/$defs/variableCatalog/$defs/bilingual"},"description":{"$ref":"#/$defs/variableCatalog/$defs/note"},"source_ids":{"type":"array","maxItems":50,"uniqueItems":true,"items":{"$ref":"#/$defs/variableCatalog/$defs/id"}},"controlled_code":{"type":["string","null"],"enum":[null,"PLACEBO","USUAL_CARE","ANY_COMPARATOR","OTHER_PHARMACOLOGICAL","SHAM","NO_COMPARISON","REFERENCE_STANDARD","CLINICAL_DIAGNOSIS","OTHER_TEST","USUAL_TEST","NO_TEST_COMPARISON","FACTOR_ABSENT","REFERENCE_LEVEL","OTHER_FACTOR_OR_MODEL","USUAL_FOLLOW_UP"]},"children":{"type":"array","maxItems":100,"items":{"$ref":"#/$defs/variableCatalog/$defs/leaf"}}}},"outcome":{"type":"object","additionalProperties":false,"required":["id","label","description","source_ids"],"properties":{"id":{"$ref":"#/$defs/variableCatalog/$defs/id"},"label":{"$ref":"#/$defs/variableCatalog/$defs/bilingual"},"description":{"$ref":"#/$defs/variableCatalog/$defs/note"},"source_ids":{"type":"array","maxItems":50,"uniqueItems":true,"items":{"$ref":"#/$defs/variableCatalog/$defs/id"}}}},"source":{"type":"object","additionalProperties":false,"required":["id","source_type","title","url","locator","accessed_on"],"properties":{"id":{"$ref":"#/$defs/variableCatalog/$defs/id"},"source_type":{"enum":["public_source","provided_document"]},"title":{"type":"string","minLength":1,"maxLength":1000},"url":{"type":["string","null"],"pattern":"^https?://"},"locator":{"type":["string","null"],"maxLength":1500},"accessed_on":{"type":"string","pattern":"^[0-9]{4}-[0-9]{2}-[0-9]{2}$"}},"allOf":[{"if":{"properties":{"source_type":{"const":"public_source"}}},"then":{"properties":{"url":{"type":"string"}}}}]}},"allOf":[{"if":{"properties":{"verification":{"properties":{"status":{"const":"source_reviewed"}}}}},"then":{"properties":{"sources":{"minItems":1},"verification":{"properties":{"checked_on":{"type":"string"}}}}}}]},"catalogProvenance":{"type":"object","additionalProperties":false,"required":["catalog_id","variable_id"],"properties":{"catalog_id":{"type":"string","minLength":1,"maxLength":160},"variable_id":{"type":"string","minLength":1,"maxLength":160}}},"languages":{"type":"object","additionalProperties":false,"required":["mode","included","conditions"],"properties":{"mode":{"enum":[null,"ANY","RESTRICTED"]},"included":{"type":"array","maxItems":200,"uniqueItems":true,"items":{"type":"string","pattern":"^[a-z]{3}$"}},"conditions":{"$ref":"#/$defs/rich"}},"if":{"not":{"properties":{"mode":{"const":"RESTRICTED"}}}},"then":{"properties":{"included":{"maxItems":0}}},"description":"Eligible languages. mode null: not stated; ANY: no restriction; RESTRICTED: only the ISO 639-2/B codes in included (as MEDLINE LA: eng, spa, fre, ger...)."},"importReview":{"type":"object","additionalProperties":false,"required":["source","marks","unplaced"],"description":"Provenance of a draft imported from a Word or PDF file by the importar-pico skill, and its pending review marks.","properties":{"source":{"type":"object","additionalProperties":false,"required":["file_name","sha256","file_format","imported_at","skill","skill_version"],"properties":{"file_name":{"type":"string","minLength":1},"sha256":{"type":"string","pattern":"^[0-9a-f]{64}$"},"file_format":{"enum":["DOCX","PDF"]},"imported_at":{"type":"string","minLength":1},"skill":{"type":"string","minLength":1},"skill_version":{"type":"string","minLength":1}}},"marks":{"type":"array","maxItems":2000,"items":{"$ref":"#/$defs/importMark"}},"unplaced":{"type":"array","maxItems":2000,"items":{"$ref":"#/$defs/unplacedFragment"}}}},"importMark":{"type":"object","additionalProperties":false,"required":["id","field","item_id","status","reason","quote","page"],"properties":{"id":{"type":"string","minLength":1},"field":{"enum":["number","section","clinical_question","question_type","criteria_version","population","interventions","comparators","outcomes","study_designs","publication_types","languages","reviewer_notes"]},"item_id":{"type":["string","null"],"minLength":1},"status":{"enum":["IMPORTED","REVIEW","NOT_IMPORTED"]},"reason":{"type":"string","maxLength":500},"quote":{"type":"string","maxLength":500},"page":{"type":["integer","null"],"minimum":1}}},"unplacedFragment":{"type":"object","additionalProperties":false,"required":["id","text","page"],"properties":{"id":{"type":"string","minLength":1},"text":{"type":"string","minLength":1,"maxLength":5000},"page":{"type":["integer","null"],"minimum":1}}}}');
const schema$1 = {
  $schema: $schema$1,
  $id,
  title: title$1,
  description,
  type: type$1,
  properties: properties$1,
  required: required$1,
  $defs: $defs$1
};
const $schema = "http://json-schema.org/draft-07/schema#";
const title = "PICO Creator candidate variable catalogue 0.2.0";
const type = "object";
const additionalProperties = false;
const required = ["format", "schema_version", "catalog_id", "title", "question_type", "clinical_question", "population_notes", "verification", "sources", "interventions", "comparators", "outcomes"];
const properties = { "format": { "const": "pico-variable-catalog" }, "schema_version": { "const": "0.2.0" }, "catalog_id": { "$ref": "#/$defs/id" }, "title": { "$ref": "#/$defs/bilingual" }, "question_type": { "enum": ["intervention", "diagnostic", "prognosis", "other"] }, "clinical_question": { "$ref": "#/$defs/bilingual" }, "population_notes": { "$ref": "#/$defs/note" }, "verification": { "type": "object", "additionalProperties": false, "required": ["status", "checked_on", "limitations"], "properties": { "status": { "enum": ["source_reviewed", "partially_reviewed", "unverified"] }, "checked_on": { "type": ["string", "null"], "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" }, "limitations": { "$ref": "#/$defs/note" } } }, "sources": { "type": "array", "maxItems": 100, "items": { "$ref": "#/$defs/source" } }, "interventions": { "type": "array", "maxItems": 100, "items": { "$ref": "#/$defs/intervention" } }, "comparators": { "type": "array", "maxItems": 100, "items": { "$ref": "#/$defs/comparator" } }, "outcomes": { "type": "array", "maxItems": 100, "items": { "$ref": "#/$defs/outcome" } } };
const $defs = { "id": { "type": "string", "minLength": 1, "maxLength": 160, "pattern": "^[a-zA-Z0-9][a-zA-Z0-9._:-]*$" }, "bilingual": { "type": "object", "additionalProperties": false, "required": ["es", "en"], "properties": { "es": { "type": "string", "minLength": 1, "maxLength": 6e3 }, "en": { "type": "string", "minLength": 1, "maxLength": 6e3 } } }, "note": { "type": "object", "additionalProperties": false, "required": ["es", "en"], "properties": { "es": { "type": "string", "minLength": 0, "maxLength": 6e3 }, "en": { "type": "string", "minLength": 0, "maxLength": 6e3 } } }, "leaf": { "type": "object", "additionalProperties": false, "required": ["id", "label", "description", "source_ids"], "properties": { "id": { "$ref": "#/$defs/id" }, "label": { "$ref": "#/$defs/bilingual" }, "description": { "$ref": "#/$defs/note" }, "source_ids": { "type": "array", "maxItems": 50, "uniqueItems": true, "items": { "$ref": "#/$defs/id" } } } }, "intervention": { "type": "object", "additionalProperties": false, "required": ["id", "label", "description", "source_ids", "children"], "properties": { "id": { "$ref": "#/$defs/id" }, "label": { "$ref": "#/$defs/bilingual" }, "description": { "$ref": "#/$defs/note" }, "source_ids": { "type": "array", "maxItems": 50, "uniqueItems": true, "items": { "$ref": "#/$defs/id" } }, "children": { "type": "array", "maxItems": 100, "items": { "$ref": "#/$defs/leaf" } } } }, "comparator": { "type": "object", "additionalProperties": false, "required": ["id", "label", "description", "source_ids", "controlled_code", "children"], "properties": { "id": { "$ref": "#/$defs/id" }, "label": { "$ref": "#/$defs/bilingual" }, "description": { "$ref": "#/$defs/note" }, "source_ids": { "type": "array", "maxItems": 50, "uniqueItems": true, "items": { "$ref": "#/$defs/id" } }, "controlled_code": { "type": ["string", "null"], "enum": [null, "PLACEBO", "USUAL_CARE", "ANY_COMPARATOR", "OTHER_PHARMACOLOGICAL", "SHAM", "NO_COMPARISON", "REFERENCE_STANDARD", "CLINICAL_DIAGNOSIS", "OTHER_TEST", "USUAL_TEST", "NO_TEST_COMPARISON", "FACTOR_ABSENT", "REFERENCE_LEVEL", "OTHER_FACTOR_OR_MODEL", "USUAL_FOLLOW_UP"] }, "children": { "type": "array", "maxItems": 100, "items": { "$ref": "#/$defs/leaf" } } } }, "outcome": { "type": "object", "additionalProperties": false, "required": ["id", "label", "description", "source_ids"], "properties": { "id": { "$ref": "#/$defs/id" }, "label": { "$ref": "#/$defs/bilingual" }, "description": { "$ref": "#/$defs/note" }, "source_ids": { "type": "array", "maxItems": 50, "uniqueItems": true, "items": { "$ref": "#/$defs/id" } } } }, "source": { "type": "object", "additionalProperties": false, "required": ["id", "source_type", "title", "url", "locator", "accessed_on"], "properties": { "id": { "$ref": "#/$defs/id" }, "source_type": { "enum": ["public_source", "provided_document"] }, "title": { "type": "string", "minLength": 1, "maxLength": 1e3 }, "url": { "type": ["string", "null"], "pattern": "^https?://" }, "locator": { "type": ["string", "null"], "maxLength": 1500 }, "accessed_on": { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" } }, "allOf": [{ "if": { "properties": { "source_type": { "const": "public_source" } } }, "then": { "properties": { "url": { "type": "string" } } } }] } };
const allOf = [{ "if": { "properties": { "verification": { "properties": { "status": { "const": "source_reviewed" } } } } }, "then": { "properties": { "sources": { "minItems": 1 }, "verification": { "properties": { "checked_on": { "type": "string" } } } } } }];
const schema = {
  $schema,
  title,
  type,
  additionalProperties,
  required,
  properties,
  $defs,
  allOf
};
const check = new Ajv({ strict: false, allErrors: true }).compile(schema);
const CATALOG_COMPARATORS = {
  intervention: ["PLACEBO", "USUAL_CARE", "ANY_COMPARATOR", "OTHER_PHARMACOLOGICAL", "SHAM", "NO_COMPARISON"],
  diagnostic: ["REFERENCE_STANDARD", "CLINICAL_DIAGNOSIS", "OTHER_TEST", "USUAL_TEST", "ANY_COMPARATOR", "NO_TEST_COMPARISON"],
  prognosis: ["FACTOR_ABSENT", "REFERENCE_LEVEL", "OTHER_FACTOR_OR_MODEL", "USUAL_FOLLOW_UP", "ANY_COMPARATOR", "NO_COMPARISON"]
};
const validDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
function validateCatalog(value) {
  const errors = [];
  try {
    if (!check(value)) return ["CATALOG_STRUCTURE:" + check.errors.map((e) => (e.instancePath || "/") + " " + e.keyword).slice(0, 8).join(", ")];
    const ids = /* @__PURE__ */ new Set(), sources = /* @__PURE__ */ new Set();
    for (const source of value.sources) {
      if (sources.has(source.id)) errors.push("CATALOG_DUPLICATE_SOURCE");
      sources.add(source.id);
      if (!validDate(source.accessed_on)) errors.push("CATALOG_DATE");
      if (source.url) {
        try {
          const u = new URL(source.url);
          if (!["https:", "http:"].includes(u.protocol) || !u.hostname) errors.push("CATALOG_URL");
        } catch {
          errors.push("CATALOG_URL");
        }
      }
    }
    let count = 0;
    const item = (x) => {
      count++;
      if (value.verification.status === "source_reviewed" && !x.children?.length && !x.source_ids.length) errors.push("CATALOG_UNSOURCED_ITEM");
      if (ids.has(x.id)) errors.push("CATALOG_DUPLICATE_ID");
      ids.add(x.id);
      for (const id of x.source_ids) if (!sources.has(id)) errors.push("CATALOG_SOURCE_REFERENCE");
      for (const child of x.children || []) item(child);
    };
    for (const list of [value.interventions, value.comparators, value.outcomes]) list.forEach(item);
    if (count > 1e3 || count === 0) errors.push("CATALOG_ITEM_COUNT");
    for (const x of value.comparators) if (x.controlled_code && CATALOG_COMPARATORS[value.question_type] && !CATALOG_COMPARATORS[value.question_type].includes(x.controlled_code)) errors.push("CATALOG_COMPARATOR_TYPE");
    if (value.verification.checked_on !== null && !validDate(value.verification.checked_on)) errors.push("CATALOG_DATE");
    const inspect = (x) => {
      if (typeof x === "string" && /<\/?[a-z][^>]*>/i.test(x)) errors.push("CATALOG_MARKUP");
      else if (Array.isArray(x)) x.forEach(inspect);
      else if (x && typeof x === "object") for (const [key, v] of Object.entries(x)) {
        if (["__proto__", "constructor", "prototype"].includes(key)) errors.push("CATALOG_KEY");
        inspect(v);
      }
    };
    inspect(value);
  } catch {
    return ["CATALOG_INVALID"];
  }
  return [...new Set(errors)];
}
const copy$1 = (o) => JSON.parse(JSON.stringify(o));
const SCHEMA_VERSION = "1.1.0";
const CATALOG_SCHEMA_VERSION = "0.2.0";
const LEGACY_SCHEMA_VERSIONS = ["0.1.0", "0.2.0", "1.0.0"];
const LEGACY_CATALOG_VERSIONS = ["0.1.0"];
const LEGACY_KEYS = { documento_id: "document_id", revision_documento: "document_revision", vinculacion_rs: "review_link", numero: "number", seccion: "section", pregunta_clinica: "clinical_question", tipo_pregunta: "question_type", codigo: "code", plantilla: "template", plantilla_version: "template_version", version_criterios: "criteria_version", poblacion: "population", texto: "text", subpoblaciones: "subpopulations", intervenciones: "interventions", comparadores: "comparators", hijos: "children", modo: "mode", papel: "role", especificacion: "specification", nombre: "name", descripcion: "description", detalles: "details", importancia: "importance", puntuacion: "score", momentos: "timepoints", instrumentos: "instruments", umbrales: "thresholds", diferencia_minima_importante: "minimal_important_difference", tipos_estudio: "study_designs", catalogo_version: "catalog_version", incluidos: "included", excluidos: "excluded", resto_excluido_aplicado: "remainder_excluded", n_minima: "min_n", condiciones: "conditions", tipos_publicacion: "publication_types", adicionales: "additional", aclaracion: "clarification", notas_revisores: "reviewer_notes", catalogo_variables: "variable_catalogs", catalogos: "catalogs", activo_id: "active_id", catalogo_origen: "catalog_origin" };
const LEGACY_TEMPLATES = { intervencion: "intervention", diagnostico: "diagnostic", pronostico: "prognosis", otras: "other" };
const LEGACY_CODES = { INTERVENCION: "INTERVENTION", SEGURIDAD: "SAFETY", DIAGNOSTICO: "DIAGNOSTIC", PRONOSTICO: "PROGNOSIS", PREDICCION: "PREDICTION", ETIOLOGIA: "ETIOLOGY", EXPOSICION: "EXPOSURE", PREVALENCIA: "PREVALENCE", CUALITATIVA: "QUALITATIVE", OTRA: "OTHER", CUALQUIER_ESTUDIO: "ANY_DESIGN", REVISION_SISTEMATICA: "SYSTEMATIC_REVIEW", METAANALISIS: "META_ANALYSIS", ECA: "RCT", ENSAYO_NO_ALEATORIZADO: "NON_RANDOMIZED_TRIAL", OBSERVACIONAL_CUALQUIERA: "OBSERVATIONAL_ANY", OBSERVACIONAL_COMPARATIVO: "OBSERVATIONAL_COMPARATIVE", OBSERVACIONAL_NO_COMPARATIVO: "OBSERVATIONAL_NON_COMPARATIVE", SERIE_CASOS: "CASE_SERIES", CASO: "CASE_REPORT", EXACTITUD_DIAGNOSTICA: "DIAGNOSTIC_ACCURACY", MODELO_PREDICCION: "PREDICTION_MODEL", CUALITATIVO: "QUALITATIVE_STUDY", OTRO: "OTHER", CUIDADO_HABITUAL: "USUAL_CARE", CUALQUIER_COMPARADOR: "ANY_COMPARATOR", OTROS_FARMACOLOGICOS: "OTHER_PHARMACOLOGICAL", SIMULADA: "SHAM", SIN_COMPARACION: "NO_COMPARISON", PATRON_REFERENCIA: "REFERENCE_STANDARD", DIAGNOSTICO_CLINICO: "CLINICAL_DIAGNOSIS", OTRA_PRUEBA: "OTHER_TEST", PRUEBA_HABITUAL: "USUAL_TEST", SIN_COMPARACION_PRUEBAS: "NO_TEST_COMPARISON", AUSENCIA_FACTOR: "FACTOR_ABSENT", NIVEL_REFERENCIA: "REFERENCE_LEVEL", OTRO_FACTOR_MODELO: "OTHER_FACTOR_OR_MODEL", SEGUIMIENTO_HABITUAL: "USUAL_FOLLOW_UP", COMPARADOR: "COMPARATOR", LIBRE: "FREE", CONTROLADO: "CONTROLLED", CRITICO: "CRITICAL", IMPORTANTE: "IMPORTANT", NO_IMPORTANTE: "NOT_IMPORTANT", CARTA: "LETTER", TESIS: "THESIS", INFORME: "REPORT", CUALQUIERA: "ANY", SOLO_COMPLETOS: "FULL_REPORTS_ONLY", COMPLETOS_Y_OTROS: "FULL_REPORTS_AND_OTHERS" };
const code = (v) => typeof v === "string" && Object.hasOwn(LEGACY_CODES, v) ? LEGACY_CODES[v] : v;
const template = (v) => typeof v === "string" && Object.hasOwn(LEGACY_TEMPLATES, v) ? LEGACY_TEMPLATES[v] : v;
function renameKeys(value) {
  if (Array.isArray(value)) return value.map(renameKeys);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [k, v] of Object.entries(value)) out[Object.hasOwn(LEGACY_KEYS, k) ? LEGACY_KEYS[k] : k] = renameKeys(v);
  return out;
}
const isLegacyCatalog = (c) => c?.format === "pico-variable-catalog" && LEGACY_CATALOG_VERSIONS.includes(c.schema_version);
function migrateCatalog(value) {
  if (!isLegacyCatalog(value)) return value;
  const c = copy$1(value);
  c.schema_version = CATALOG_SCHEMA_VERSION;
  c.question_type = template(c.question_type);
  for (const x of c.comparators || []) if (x.controlled_code) x.controlled_code = code(x.controlled_code);
  return c;
}
const isLegacyDocument = (d) => d?.format === "pico-document" && LEGACY_SCHEMA_VERSIONS.includes(d.schema_version);
function addLanguages(d) {
  const p = d.pico;
  if (!p || typeof p !== "object" || "languages" in p) return d;
  const out = {};
  for (const [k, v] of Object.entries(p)) {
    out[k] = v;
    if (k === "publication_types") out.languages = { mode: null, included: [], conditions: { type: "doc", content: [{ type: "paragraph" }] } };
  }
  if (!("languages" in out)) out.languages = { mode: null, included: [], conditions: { type: "doc", content: [{ type: "paragraph" }] } };
  d.pico = out;
  return d;
}
function migrateDocument(value) {
  if (!isLegacyDocument(value)) return value;
  if (value.schema_version === "1.0.0") {
    const d2 = addLanguages(copy$1(value));
    d2.schema_version = SCHEMA_VERSION;
    return d2;
  }
  const d = renameKeys(value);
  d.schema_version = SCHEMA_VERSION;
  addLanguages(d);
  const p = d.pico;
  if (!p || typeof p !== "object") return d;
  if (p.question_type) {
    p.question_type.code = code(p.question_type.code);
    p.question_type.template = template(p.question_type.template);
  }
  for (const x of p.comparators || []) {
    x.mode = code(x.mode);
    x.role = code(x.role);
    if ("code" in x) x.code = code(x.code);
  }
  for (const x of p.outcomes || []) if (x?.details) x.details.importance = code(x.details.importance);
  for (const k of ["included", "excluded"]) for (const x of p.study_designs?.[k] || []) x.code = code(x.code);
  if (p.publication_types) {
    p.publication_types.mode = code(p.publication_types.mode);
    for (const x of p.publication_types.additional || []) x.code = code(x.code);
  }
  if (p.variable_catalogs === void 0) p.variable_catalogs = null;
  if (p.variable_catalogs?.catalogs) p.variable_catalogs.catalogs = p.variable_catalogs.catalogs.map(migrateCatalog);
  return d;
}
const schemaCheck = new Ajv({ strict: false }).compile(schema$1);
const VERSION = "1.4.1";
const uid = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const rich = (text = "") => ({ type: "doc", content: [{ type: "paragraph", ...text ? { content: [{ type: "text", text }] } : {} }] });
const copy = (o) => JSON.parse(JSON.stringify(o));
function normalizeColor(value) {
  if (typeof value !== "string") return null;
  const s = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(s)) return s;
  if (/^#[0-9a-f]{3}$/.test(s)) return "#" + s.slice(1).split("").map((c) => c + c).join("");
  const rgb = s.match(/^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?\s*\)$/);
  if (rgb && (!rgb[4] || Number(rgb[4]) === 1)) {
    const nums = rgb.slice(1, 4).map(Number);
    if (nums.every((n) => n >= 0 && n <= 255)) return "#" + nums.map((n) => Math.round(n).toString(16).padStart(2, "0")).join("");
  }
  return { black: "#000000", white: "#ffffff", red: "#ff0000", blue: "#0000ff", green: "#008000", yellow: "#ffff00", gray: "#808080", grey: "#808080", orange: "#ffa500", purple: "#800080" }[s] || null;
}
function normalizeRich(value) {
  const n = copy(value);
  const walk = (node) => {
    if (node.marks) {
      node.marks = node.marks.flatMap((m) => {
        if (m.type === "textStyle" && !m.attrs?.color) return [];
        if (m.attrs?.color) {
          const color = normalizeColor(m.attrs.color);
          if (!color && ["highlight", "textStyle"].includes(m.type)) return [];
          m.attrs = { ...m.attrs, color };
        }
        return [m];
      });
      if (!node.marks.length) delete node.marks;
    }
    for (const child of node.content || []) walk(child);
  };
  walk(n);
  return n;
}
function plain(node) {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (node.type === "hardBreak") return "\n";
  const c = node.content || [];
  if (node.type === "bulletList") return c.map((x) => "• " + plain(x)).join("\n");
  return c.map(plain).join(node.type === "doc" || node.type === "listItem" ? "\n" : "");
}
const emptyRich = (node) => !plain(node).trim();
const DESIGN_LABELS = {
  ANY_DESIGN: ["Any study design", "Cualquier tipo de estudio"],
  SYSTEMATIC_REVIEW: ["Systematic reviews", "Revisiones sistemáticas"],
  META_ANALYSIS: ["Meta-analyses", "Metaanálisis"],
  RCT: ["Randomised controlled trials (RCTs)", "Ensayos clínicos aleatorizados (ECA)"],
  NON_RANDOMIZED_TRIAL: ["Non-randomised trials", "Ensayos no aleatorizados"],
  OBSERVATIONAL_ANY: ["Observational studies (any)", "Estudios observacionales (cualquiera)"],
  OBSERVATIONAL_COMPARATIVE: ["Comparative observational studies", "Estudios observacionales comparativos"],
  OBSERVATIONAL_NON_COMPARATIVE: ["Non-comparative observational studies", "Estudios observacionales no comparativos"],
  CASE_SERIES: ["Case series", "Series de casos"],
  CASE_REPORT: ["Individual cases", "Casos individuales"],
  DIAGNOSTIC_ACCURACY: ["Diagnostic accuracy studies", "Estudios de exactitud diagnóstica"],
  PREDICTION_MODEL: ["Prediction model studies", "Estudios de modelos de predicción"],
  QUALITATIVE_STUDY: ["Qualitative studies", "Estudios cualitativos"],
  OTHER: ["Other design (specify)", "Otro diseño (especificar)"]
};
const base = ["ANY_DESIGN", "SYSTEMATIC_REVIEW", "META_ANALYSIS"];
const obs = ["OBSERVATIONAL_ANY", "OBSERVATIONAL_COMPARATIVE", "OBSERVATIONAL_NON_COMPARATIVE", "CASE_SERIES", "CASE_REPORT"];
const DESIGN_CATALOGS = { intervention: [...base, "RCT", "NON_RANDOMIZED_TRIAL", ...obs, "OTHER"], diagnostic: [...base, "DIAGNOSTIC_ACCURACY", "RCT", ...obs, "OTHER"], prognosis: [...base, ...obs, "PREDICTION_MODEL", "OTHER"], other: Object.keys(DESIGN_LABELS) };
const COMP_LABELS = { PLACEBO: ["Placebo", "Placebo"], USUAL_CARE: ["Usual care", "Cuidado habitual"], ANY_COMPARATOR: ["Any comparator", "Cualquier comparador"], OTHER_PHARMACOLOGICAL: ["Other pharmacological treatments", "Otros tratamientos farmacológicos"], SHAM: ["Sham intervention", "Intervención simulada"], NO_COMPARISON: ["No comparison", "Sin comparación"], REFERENCE_STANDARD: ["Reference standard (specify)", "Patrón de referencia (especificar)"], CLINICAL_DIAGNOSIS: ["Clinical diagnosis (specify)", "Diagnóstico clínico (especificar)"], OTHER_TEST: ["Another diagnostic test", "Otra prueba diagnóstica"], USUAL_TEST: ["Standard / usual test", "Prueba habitual / estándar"], NO_TEST_COMPARISON: ["No comparison between tests", "Sin comparación entre pruebas"], FACTOR_ABSENT: ["Absence of the factor", "Ausencia del factor"], REFERENCE_LEVEL: ["Reference level of the factor", "Nivel de referencia del factor"], OTHER_FACTOR_OR_MODEL: ["Another prognostic factor or model", "Otro factor o modelo pronóstico"], USUAL_FOLLOW_UP: ["Usual care / follow-up", "Cuidado / seguimiento habitual"] };
const COMP_CATALOGS = { intervention: ["PLACEBO", "USUAL_CARE", "ANY_COMPARATOR", "OTHER_PHARMACOLOGICAL", "SHAM", "NO_COMPARISON"], diagnostic: ["REFERENCE_STANDARD", "CLINICAL_DIAGNOSIS", "OTHER_TEST", "USUAL_TEST", "ANY_COMPARATOR", "NO_TEST_COMPARISON"], prognosis: ["FACTOR_ABSENT", "REFERENCE_LEVEL", "OTHER_FACTOR_OR_MODEL", "USUAL_FOLLOW_UP", "ANY_COMPARATOR", "NO_COMPARISON"], other: Object.keys(COMP_LABELS) };
const PUB_LABELS = { ABSTRACT: ["Conference abstracts", "Abstracts / resúmenes de congresos"], LETTER: ["Letters to the editor", "Cartas al editor"], THESIS: ["Doctoral theses", "Tesis doctorales"], REPORT: ["Other full reports", "Otros informes completos"], PREPRINT: ["Preprints", "Preprints"], OTHER: ["Other publication (specify)", "Otra publicación (especificar)"], ANY: ["Any other publication type", "Cualquier otro tipo de publicación"] };
const LANG_LABELS = { "eng": ["English", "Inglés"], "spa": ["Spanish", "Español"], "fre": ["French", "Francés"], "ger": ["German", "Alemán"], "ita": ["Italian", "Italiano"], "por": ["Portuguese", "Portugués"], "cat": ["Catalan", "Catalán"], "dut": ["Dutch", "Neerlandés"], "chi": ["Chinese", "Chino"], "jpn": ["Japanese", "Japonés"], "kor": ["Korean", "Coreano"], "rus": ["Russian", "Ruso"], "pol": ["Polish", "Polaco"], "tur": ["Turkish", "Turco"], "ara": ["Arabic", "Árabe"], "swe": ["Swedish", "Sueco"], "dan": ["Danish", "Danés"], "nor": ["Norwegian", "Noruego"], "gre": ["Greek", "Griego"], "heb": ["Hebrew", "Hebreo"], "cze": ["Czech", "Checo"], "hun": ["Hungarian", "Húngaro"], "per": ["Persian", "Persa"] };
const LANGUAGE_CODE = /^[a-z]{3}$/;
const label = (table, code2, lang = "en") => table[code2]?.[lang === "es" ? 1 : 0] || code2 || "";
const noN = (code2) => ["SYSTEMATIC_REVIEW", "META_ANALYSIS"].includes(code2);
const typeCode = (type2) => ({ intervention: "INTERVENTION", diagnostic: "DIAGNOSTIC", prognosis: "PROGNOSIS", other: "OTHER" })[type2];
function newDocument(type2 = "intervention") {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return { format: "pico-document", schema_version: SCHEMA_VERSION, text_format: "richtext-v1", document_id: uid(), document_revision: 0, created_at: now, updated_at: now, review_link: null, pico: { number: "", section: rich(), clinical_question: rich(), question_type: { code: typeCode(type2), template: type2, template_version: "1.0" }, criteria_version: "1.0", population: { text: rich(), subpopulations: [] }, interventions: [], comparators: [], outcomes: [], study_designs: { catalog_version: "1.1", included: [], excluded: [], remainder_excluded: false }, publication_types: { mode: null, additional: [], conditions: rich() }, languages: { mode: null, included: [], conditions: rich() }, reviewer_notes: rich(), variable_catalogs: null } };
}
const freeItem = () => ({ id: uid(), text: rich(), children: [] });
const comparator = (mode = "FREE", code2 = "") => mode === "FREE" ? { ...freeItem(), mode, role: "COMPARATOR" } : { id: uid(), mode, code: code2, role: code2 === "REFERENCE_STANDARD" ? "REFERENCE_STANDARD" : "COMPARATOR", specification: rich(), children: [] };
const outcome = () => ({ id: uid(), name: rich(), description: rich(), details: { importance: null, score: null, timepoints: [], instruments: [], thresholds: [], minimal_important_difference: null } });
const design = (code2 = "") => ({ id: uid(), code: code2, min_n: null, conditions: rich() });
const publication = () => ({ id: uid(), code: "", clarification: rich() });
function reorder(list, from, to) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const a = [...list];
  const [item] = a.splice(from, 1);
  a.splice(to, 0, item);
  return a;
}
function remainder(type2, included, excluded) {
  const have = new Set([...included, ...excluded].map((x) => x.code));
  if (have.has("ANY_DESIGN")) return [];
  if (have.has("OBSERVATIONAL_ANY")) {
    for (const x of obs) have.add(x);
    have.add("DIAGNOSTIC_ACCURACY");
    have.add("PREDICTION_MODEL");
  }
  return DESIGN_CATALOGS[type2].filter((x) => !["OTHER", "ANY_DESIGN"].includes(x) && !have.has(x)).map(design);
}
const nodes = /* @__PURE__ */ new Set(["doc", "paragraph", "text", "hardBreak", "bulletList", "listItem"]);
const marks = /* @__PURE__ */ new Set(["bold", "italic", "strike", "highlight", "textStyle"]);
const hex = /^#[0-9a-f]{6}$/i;
function validRich(node, depth = 0) {
  if (!node || typeof node !== "object" || !nodes.has(node.type) || depth > 20) return false;
  if (node.type === "text" && (typeof node.text !== "string" || !node.text)) return false;
  if (node.content && !Array.isArray(node.content)) return false;
  if (node.marks && !Array.isArray(node.marks)) return false;
  if (node.marks?.some((m) => !m || !marks.has(m.type) || m.attrs?.color != null && !hex.test(m.attrs.color))) return false;
  return (node.content || []).every((n) => validRich(n, depth + 1));
}
function validateDocument(d) {
  const errors = [];
  const add = (s) => errors.push(s);
  if (!d || typeof d !== "object" || d.format !== "pico-document") return ["FORMAT"];
  if (d.schema_version !== SCHEMA_VERSION) return ["SCHEMA_VERSION"];
  if (!schemaCheck(d)) return ["STRUCTURE:" + schemaCheck.errors.map((e) => (e.instancePath || "/") + " " + e.keyword).join(", ")];
  if (d.text_format !== "richtext-v1") add("TEXT_FORMAT");
  if (typeof d.document_id !== "string" || !d.document_id) add("DOCUMENT_ID");
  if (!Number.isInteger(d.document_revision) || d.document_revision < 0) add("REVISION");
  for (const k of ["created_at", "updated_at"]) if (typeof d[k] !== "string" || !Number.isFinite(Date.parse(d[k]))) add(k.toUpperCase());
  const p = d.pico;
  if (!p || typeof p !== "object") return [...errors, "PICO"];
  if (typeof p.number !== "string") add("NUMBER");
  if (typeof p.criteria_version !== "string") add("CRITERIA_VERSION");
  if (!Object.keys(DESIGN_CATALOGS).includes(p.question_type?.template) || !["INTERVENTION", "SAFETY", "DIAGNOSTIC", "PROGNOSIS", "PREDICTION", "ETIOLOGY", "EXPOSURE", "PREVALENCE", "QUALITATIVE", "OTHER"].includes(p.question_type?.code)) add("TYPE");
  const ids = /* @__PURE__ */ new Set();
  const id = (x) => {
    if (typeof x?.id !== "string" || !x.id || ids.has(x.id)) add("ITEM_ID");
    else ids.add(x.id);
  };
  const rt = (x, name) => {
    if (x?.type !== "doc" || !validRich(x)) add("RICHTEXT:" + name);
  };
  rt(p.section, "section");
  rt(p.clinical_question, "question");
  rt(p.reviewer_notes, "notes");
  rt(p.population?.text, "population");
  const list = (a, name, fn) => {
    if (!Array.isArray(a)) {
      add("ARRAY:" + name);
      return;
    }
    if (a.length > 1e3) {
      add("SIZE:" + name);
      return;
    }
    a.forEach(fn);
  };
  const fi = (x, depth = 0) => {
    id(x);
    rt(x?.text, "item");
    if (depth > 1) add("ITEM_DEPTH");
    list(x?.children, "children", (y) => fi(y, depth + 1));
  };
  list(p.population?.subpopulations, "subpopulations", (x) => {
    id(x);
    rt(x?.text, "subpopulation");
  });
  list(p.interventions, "interventions", (x) => fi(x));
  list(p.comparators, "comparators", (x) => {
    id(x);
    if (x?.mode === "FREE") rt(x.text, "comparator");
    else if (x?.mode === "CONTROLLED") {
      if (x.code && !COMP_LABELS[x.code]) add("COMPARATOR_CODE");
      rt(x.specification, "comparator");
    } else add("COMPARATOR_MODE");
    list(x?.children, "comparator_children", (y) => fi(y, 1));
  });
  list(p.outcomes, "outcomes", (x) => {
    id(x);
    rt(x?.name, "outcome_name");
    rt(x?.description, "outcome_description");
    if (!x?.details || typeof x.details !== "object") add("OUTCOME_DETAILS");
    const imp = x?.details?.importance;
    if (imp != null && !["CRITICAL", "IMPORTANT", "NOT_IMPORTANT"].includes(imp)) add("OUTCOME_IMPORTANCE");
    const n = x?.details?.score;
    if (n != null && (!Number.isInteger(n) || n < 1 || n > 9)) add("OUTCOME_SCORE");
    for (const field of ["timepoints", "instruments", "thresholds"]) if (!Array.isArray(x?.details?.[field]) || x.details[field].some((v) => typeof v !== "string")) add("OUTCOME_DETAIL_ARRAY");
    if (x?.details?.minimal_important_difference != null && typeof x.details.minimal_important_difference !== "string") add("OUTCOME_MID");
  });
  for (const k of ["included", "excluded"]) list(p.study_designs?.[k], k, (x) => {
    id(x);
    if (typeof x?.code !== "string" || x.code && !DESIGN_LABELS[x.code]) add("DESIGN_CODE");
    if (x?.min_n !== null && (!Number.isInteger(x?.min_n) || x.min_n < 1)) add("MIN_N");
    if (noN(x?.code) && x?.min_n !== null) add("MIN_N_REVIEW");
    rt(x?.conditions, "conditions");
  });
  if (!p.study_designs || typeof p.study_designs.catalog_version !== "string" || typeof p.study_designs.remainder_excluded !== "boolean") add("DESIGN_METADATA");
  const pub = p.publication_types;
  if (!pub || ![null, "FULL_REPORTS_ONLY", "FULL_REPORTS_AND_OTHERS"].includes(pub.mode)) add("PUBLICATION_MODE");
  rt(pub?.conditions, "publication_conditions");
  list(pub?.additional, "publications", (x) => {
    id(x);
    if (typeof x?.code !== "string" || x.code && !PUB_LABELS[x.code]) add("PUBLICATION_CODE");
    rt(x?.clarification, "publication_note");
  });
  if (pub?.mode !== "FULL_REPORTS_AND_OTHERS" && pub?.additional?.length) add("INACTIVE_PUBLICATIONS");
  rt(p.languages?.conditions, "language_conditions");
  const catalogs = p.variable_catalogs;
  if (catalogs) {
    const seenCatalogs = /* @__PURE__ */ new Set();
    for (const c of catalogs.catalogs) {
      if (seenCatalogs.has(c.catalog_id)) add("CATALOG_DUPLICATE");
      seenCatalogs.add(c.catalog_id);
      for (const e of validateCatalog(c)) add(e);
    }
    if (catalogs.active_id !== null && !seenCatalogs.has(catalogs.active_id)) add("CATALOG_ACTIVE");
  }
  const checkOrigin = (x) => {
    if (x.catalog_origin && !catalogs?.catalogs.some((c) => c.catalog_id === x.catalog_origin.catalog_id)) add("CATALOG_ORIGIN");
    for (const child of x.children || []) checkOrigin(child);
  };
  for (const item of [...p.interventions, ...p.comparators, ...p.outcomes]) checkOrigin(item);
  return [...new Set(errors)];
}
function warnings(d) {
  const p = d.pico;
  const w = [];
  if (!/^[1-9][0-9]*[a-z]?$/.test(p.number)) w.push("numberWarning");
  if (emptyRich(p.clinical_question)) w.push("questionWarning");
  if (emptyRich(p.population.text)) w.push("populationWarning");
  if (!p.outcomes.length || p.outcomes.some((x) => emptyRich(x.name))) w.push("outcomeWarning");
  if (!p.study_designs.included.length || [...p.study_designs.included, ...p.study_designs.excluded].some((x) => !x.code || x.code === "OTHER" && emptyRich(x.conditions))) w.push("designWarning");
  if (p.publication_types.mode == null || p.publication_types.mode === "FULL_REPORTS_AND_OTHERS" && (!p.publication_types.additional.length || p.publication_types.additional.some((x) => !x.code))) w.push("publicationWarning");
  if (p.languages.mode == null || p.languages.mode === "RESTRICTED" && !p.languages.included.length) w.push("languageWarning");
  const type2 = p.question_type.template;
  if ([...p.study_designs.included, ...p.study_designs.excluded].some((x) => x.code && !DESIGN_CATALOGS[type2].includes(x.code)) || p.comparators.some((x) => x.mode === "CONTROLLED" && x.code && !COMP_CATALOGS[type2].includes(x.code))) w.push("catalogWarning");
  if (p.study_designs.included.some((x) => p.study_designs.excluded.some((y) => y.code === x.code || x.code === "ANY_DESIGN" || y.code === "ANY_DESIGN"))) w.push("overlapWarning");
  if (p.comparators.some((x) => ["NO_COMPARISON", "NO_TEST_COMPARISON"].includes(x.code)) && p.comparators.length > 1) w.push("comparisonWarning");
  return w;
}
function languageNames(languages, lang = "en") {
  return languages.mode === "ANY" ? lang === "es" ? "Sin restricción de idioma" : "No language restriction" : languages.included.map((c) => label(LANG_LABELS, c, lang)).join(", ");
}
const languagesText = (languages, lang) => languages ? (lang === "es" ? "Idiomas: " : "Languages: ") + languageNames(languages, lang) + "\n" + plain(languages.conditions) + "\n\n" : "";
function legacy(d, lang = "en") {
  const p = d.pico;
  const fi = (x, level = 0) => "  ".repeat(level) + plain(x.text) + (x.children.length ? "\n" + x.children.map((y) => fi(y, level + 1)).join("\n") : "");
  const ds = (arr) => arr.map((x) => `${label(DESIGN_LABELS, x.code, lang)}${x.min_n ? " — n ≥ " + x.min_n : ""}${plain(x.conditions) ? ": " + plain(x.conditions) : ""}`).join("\n");
  const pub = p.publication_types;
  return { pico_id: `PICO-${p.number || "draft"}`, label: `${p.number} ${plain(p.section)}`.trim(), question_type: p.question_type.code, text: plain(p.clinical_question), components: { population: [plain(p.population.text), ...p.population.subpopulations.map((x) => plain(x.text))].join("\n"), intervention_exposure_test: p.interventions.map((x) => fi(x)).join("\n"), comparator: p.comparators.map((x) => (x.mode === "FREE" ? plain(x.text) : label(COMP_LABELS, x.code, lang) + " " + plain(x.specification)) + (x.children.length ? "\n" + x.children.map((y) => fi(y, 1)).join("\n") : "")).join("\n"), outcomes: p.outcomes.map((x, i) => `${i + 1}. ${plain(x.name)}
${plain(x.description)}`).join("\n\n"), designs: (lang === "es" ? "Incluidos:\n" : "Included:\n") + ds(p.study_designs.included) + "\n\n" + (lang === "es" ? "No incluidos:\n" : "Excluded:\n") + ds(p.study_designs.excluded), others: (lang === "es" ? "Tipos de publicación: " : "Publication types: ") + (pub.mode === "FULL_REPORTS_ONLY" ? lang === "es" ? "Sólo estudios completos" : "Full reports only" : pub.mode === "FULL_REPORTS_AND_OTHERS" ? lang === "es" ? "Estudios completos y otros tipos de publicaciones" : "Full reports and other publication types" : "") + "\n" + pub.additional.map((x) => label(PUB_LABELS, x.code, lang) + ": " + plain(x.clarification)).join("\n") + "\n" + plain(pub.conditions) + "\n\n" + languagesText(p.languages, lang) + (lang === "es" ? "Notas para revisores:\n" : "Reviewer notes:\n") + plain(p.reviewer_notes) }, criteria_version: p.criteria_version, source: `PICO Creator ${VERSION}; document ${d.document_id}`, version_history: [] };
}
const en = {
  languages: "Languages",
  languageScope: "Language restriction",
  anyLanguage: "No language restriction",
  restrictedLanguages: "Only the selected languages",
  languageHelp: "Codes follow ISO 639-2/B, as the MEDLINE language field (eng, spa, fre…).",
  otherLanguage: "Other language (ISO 639-2/B code)",
  addLanguage: "Add language",
  languageCodeInvalid: "Use a three-letter ISO 639-2/B code, such as swe.",
  languageConditions: "Language conditions / exceptions…",
  languageDiscard: "This removes the selected languages. Continue?",
  languageWarning: "Specify the language restriction and, if restricted, the languages.",
  catalogDocumentLimit: "This catalogue would make the PICO too large to reopen. Import a smaller catalogue.",
  preloadedVariables: "Preloaded variables",
  importCatalog: "Import catalogue",
  showPreloaded: "Show preloaded variables",
  tryDermatomyositis: "Try dermatomyositis",
  downloadCatalogExample: "Download example JSON",
  activeCatalog: "Active catalogue",
  catalogStatus_source_reviewed: "Sources consulted",
  catalogStatus_partially_reviewed: "Partly checked",
  catalogStatus_unverified: "Sources not checked",
  catalogTypeMismatch: "This catalogue belongs to a different question type. Its suggestions are hidden; your selected content is retained.",
  catalogContextSources: "Clinical context and sources",
  catalogSuggestionsOnly: "These are candidate options. Listing a treatment does not establish efficacy or eligibility.",
  catalogReviewedOn: "Sources checked on",
  catalogImportHint: "Import a bilingual catalogue or try the dermatomyositis example. Then choose options from the dropdowns.",
  pickIntervention: "Add preloaded intervention / test / factor",
  pickComparator: "Add preloaded comparator",
  pickOutcome: "Add preloaded outcome",
  catalogAdded: "Added",
  addWholeFamily: "Add whole family",
  catalogInvalid: "Invalid variable catalogue.",
  catalogTooLarge: "Maximum catalogue size: 2 MB.",
  catalogImported: "Catalogue imported. Select variables from the dropdowns.",
  catalogWrongType: "The catalogue question type must match the current template.",
  catalogOpenFromEditor: "Create or open a PICO before importing a variable catalogue.",
  useCatalogQuestion: "Use this clinical question",
  catalogReplaceQuestion: "Replace the current clinical question with the catalogue question?",
  catalogQuestionChanged: "The question changed while the file was being read. Import it again.",
  brand: "PICO Creator",
  tagline: "Clinical questions, clearly structured.",
  new: "New PICO",
  open: "Open",
  save: "Save JSON",
  saveAs: "Save as",
  export: "Export",
  home: "Home",
  light: "Switch to light mode",
  dark: "Switch to dark mode",
  language: "Interface language",
  welcome: "A clear question. A solid starting point.",
  welcomeText: "Write eligibility criteria in a fixed, flexible template. Keep your questions as JSON and share them as Markdown, Word or PDF.",
  create: "Create a new PICO",
  openPico: "Open a PICO",
  openHint: "Choose or drop a .pico.json file",
  continue: "Continue draft",
  example: "Explore an example",
  local: "Local · Offline · Your files stay on your device",
  questionType: "Question type",
  diagnostic: "Diagnosis",
  prognosis: "Prognosis",
  other: "Other",
  typeHelp: "Labels, comparator choices and study designs adapt to this type.",
  number: "Question no.",
  section: "Section / document title",
  clinicalQuestion: "Clinical question",
  sectionPlaceholder: "Section of the guideline or recommendations…",
  questionPlaceholder: "Write the clinical question…",
  population: "Population",
  populationPlaceholder: "Describe the eligible population…",
  subpopulation: "Subpopulation",
  addSubpopulation: "Add subpopulation",
  interventions: "Interventions",
  tests: "Index tests",
  factors: "Prognostic factors",
  otherIntervention: "Intervention / exposure / phenomenon",
  intervention: "Intervention",
  test: "Test",
  factor: "Factor",
  element: "Element",
  subintervention: "Subintervention",
  subtest: "Subtest",
  subfactor: "Subfactor",
  subelement: "Subelement",
  comparators: "Comparators",
  reference: "Reference / comparison",
  comparator: "Comparator",
  subcomparator: "Subcomparator",
  controlled: "Controlled comparator",
  freeComparator: "Free-text comparator",
  referenceRole: "Role",
  referenceStandard: "Reference standard",
  comparatorTest: "Comparator test",
  otherRole: "Other",
  select: "Select…",
  specification: "Optional specification…",
  outcomes: "Outcomes",
  diagnosticOutcomes: "Diagnostic outcomes",
  prognosticOutcomes: "Prognostic outcomes",
  outcome: "Outcome",
  outcomeName: "Outcome name…",
  description: "Description / definition",
  descriptionPlaceholder: "Measures, instruments, thresholds, time points…",
  addOutcome: "Add outcome",
  optionalDetails: "Optional outcome details",
  importance: "Importance",
  notAssessed: "Not assessed",
  critical: "Critical",
  important: "Important",
  notImportant: "Not important",
  score: "Score (1–9)",
  moments: "Time points (one per line)",
  instruments: "Instruments (one per line)",
  thresholds: "Thresholds (one per line)",
  mid: "Minimal important difference",
  studyTypes: "Study designs",
  included: "Included",
  excluded: "Not included",
  addDesign: "Add study design",
  excludeRest: "Exclude remaining designs",
  minimumN: "Minimum n",
  conditions: "Conditions / clarifications…",
  nHelp: "Minimum participants. Empty means no threshold. Not applicable to systematic reviews or meta-analyses.",
  publications: "Publication types",
  pubScope: "Eligible publication types",
  fullOnly: "Full reports only",
  fullOthers: "Full reports and other publication types",
  addPublication: "Add publication type",
  pubHelp: "Publication format is separate from study design. Select the additional eligible formats explicitly.",
  pubConditions: "Publication conditions / clarifications…",
  reviewerNotes: "Reviewer notes",
  notesPlaceholder: "Clarifications for reviewers…",
  bold: "Bold",
  italic: "Italic",
  strike: "Strikethrough",
  highlight: "Highlight",
  textColor: "Text colour",
  automatic: "Automatic colour",
  noHighlight: "No highlight",
  customColor: "Custom colour",
  apply: "Apply",
  clearFormat: "Clear formatting",
  bullets: "Bullets",
  undo: "Undo",
  redo: "Redo",
  up: "Move up",
  down: "Move down",
  drag: "Drag to reorder",
  remove: "Remove",
  clearAll: "Remove all",
  clearAllConfirm: "Remove all items in this list, including their contents and subitems?",
  clearStudiesConfirm: "Remove all included and excluded study designs?",
  add: "Add",
  edit: "Edit",
  preview: "Preview",
  dirty: "Unsaved file changes",
  saved: "JSON saved",
  draftSaved: "Recovery draft saved",
  draftUnavailable: "Recovery unavailable; save your JSON",
  savedDownload: "JSON downloaded",
  fileMode: "Direct file mode: Save downloads a JSON file.",
  exportTitle: "Export document",
  format: "Format",
  markdown: "Markdown",
  word: "Word (.docx)",
  pdf: "PDF",
  legacy: "JSON for current RS model",
  layout: "Layout",
  table: "Four-column table",
  sections: "By sections",
  paper: "Paper orientation",
  landscape: "A4 landscape",
  portrait: "A4 portrait",
  mdStyles: "Markdown styling",
  clean: "Portable Markdown",
  htmlStyles: "Markdown with HTML styles",
  mdHelp: "Portable Markdown omits colour/highlight. HTML styles depend on the viewer.",
  notesInclude: "Include reviewer notes",
  cancel: "Cancel",
  download: "Download",
  exporting: "Generating document…",
  exportSuccess: "Export ready",
  error: "Something went wrong",
  fileInvalid: "This file could not be opened. Invalid or unsupported PICO JSON.",
  tooLarge: "The file is too large (maximum 10 MB).",
  discardTitle: "Unsaved changes",
  discardText: "Save the current document before continuing?",
  saveContinue: "Save and continue",
  discard: "Discard changes",
  confirmDelete: "Remove this item and its contents?",
  confirmRemove: "Remove",
  typeChange: "Changing the question type keeps your text. Review retained designs and comparator codes marked below.",
  reviewType: "Review for this question type",
  nDiscard: "The selected design does not use minimum n. Remove the threshold?",
  pubDiscard: "Switching to full reports only removes the additional publication criteria. Continue?",
  restConfirm: "Add these designs to the excluded list?",
  restNone: "No remaining designs to add.",
  help: "Help",
  helpTitle: "Using PICO Creator",
  helpText: "Create a question, edit the template and save the JSON to keep an editable copy. Exported Word/PDF/Markdown files are presentation copies. Drag the six-dot handles or use the arrow buttons to reorder list items. The colour buttons apply the last colour; their arrows open a palette. With no selection, formatting applies to what you type next. Use the theme and EN/ES buttons at the top right.",
  helpStorage: "A recovery draft is kept in this browser when available. It is not a substitute for a saved JSON file. The app makes no network calls and runs offline.",
  helpDesktop: "Open PICO-Creator.html directly, or use the included local-server launcher. See README for the optional Windows executable build.",
  close: "Close",
  draftLabel: "Draft",
  versionCriteria: "Criteria version",
  blank: "Not specified",
  completeWarnings: "Review pending fields",
  numberWarning: "Enter a question number such as 1, 3a or 3b.",
  questionWarning: "The clinical question is empty.",
  populationWarning: "The population is empty.",
  outcomeWarning: "Add outcomes and complete their names.",
  designWarning: "Specify included designs and any “Other” design.",
  publicationWarning: "Specify publication scope and additional formats.",
  catalogWarning: "Review designs or comparators retained from another template.",
  overlapWarning: "Included and excluded designs overlap; clarify any exceptions or conditions.",
  comparisonWarning: "“No comparison” coexists with other comparators; clarify the intended scope.",
  exportWarn: "The document has pending fields or coherence warnings. Export as a draft?",
  exampleNotice: "Illustrative, abbreviated example. Not a validated protocol.",
  shortcuts: "Formatting: Ctrl/Cmd+B / I · Save: Ctrl/Cmd+S",
  selectText: "Click a text field to format it.",
  newChoose: "Choose a template",
  criterionConflict: "Review criteria",
  legacyHelp: "Text projection for proyecto-rs. Confirm identity and version in the destination; rich formatting and outcome metadata remain in the canonical JSON.",
  fileDropped: "Drop a PICO JSON to open it",
  resetColor: "Clear / automatic",
  noN: "Not applicable",
  incompatible: "Retained from a different template",
  untitled: "Untitled question"
};
const es = {
  languages: "Idiomas",
  languageScope: "Restricción de idioma",
  anyLanguage: "Sin restricción de idioma",
  restrictedLanguages: "Sólo los idiomas seleccionados",
  languageHelp: "Los códigos siguen la norma ISO 639-2/B, como el campo de idioma de MEDLINE (eng, spa, fre…).",
  otherLanguage: "Otro idioma (código ISO 639-2/B)",
  addLanguage: "Añadir idioma",
  languageCodeInvalid: "Usa un código ISO 639-2/B de tres letras, como swe.",
  languageConditions: "Condiciones / excepciones de idioma…",
  languageDiscard: "Se retirarán los idiomas seleccionados. ¿Continuar?",
  languageWarning: "Indica la restricción de idioma y, si la hay, los idiomas.",
  catalogDocumentLimit: "Este catálogo haría que la PICO fuese demasiado grande para reabrirla. Importa un catálogo más pequeño.",
  preloadedVariables: "Variables precargadas",
  importCatalog: "Importar catálogo",
  showPreloaded: "Mostrar variables precargadas",
  tryDermatomyositis: "Probar dermatomiositis",
  downloadCatalogExample: "Descargar JSON de ejemplo",
  activeCatalog: "Catálogo activo",
  catalogStatus_source_reviewed: "Fuentes consultadas",
  catalogStatus_partially_reviewed: "Comprobación parcial",
  catalogStatus_unverified: "Sin comprobar fuentes",
  catalogTypeMismatch: "Este catálogo corresponde a otro tipo de pregunta. Sus sugerencias están ocultas; el contenido que ya añadiste se conserva.",
  catalogContextSources: "Contexto clínico y fuentes",
  catalogSuggestionsOnly: "Son opciones para valorar. Incluir un tratamiento no presupone eficacia ni elegibilidad.",
  catalogReviewedOn: "Fuentes comprobadas el",
  catalogImportHint: "Importa un catálogo bilingüe o prueba el ejemplo de dermatomiositis. Después elige opciones en los desplegables.",
  pickIntervention: "Añadir intervención / prueba / factor precargado",
  pickComparator: "Añadir comparador precargado",
  pickOutcome: "Añadir desenlace precargado",
  catalogAdded: "Añadido",
  addWholeFamily: "Añadir familia completa",
  catalogInvalid: "Catálogo de variables no válido.",
  catalogTooLarge: "Tamaño máximo del catálogo: 2 MB.",
  catalogImported: "Catálogo importado. Selecciona variables en los desplegables.",
  catalogWrongType: "El tipo de pregunta del catálogo debe coincidir con la plantilla actual.",
  catalogOpenFromEditor: "Crea o abre una PICO antes de importar un catálogo.",
  useCatalogQuestion: "Usar esta pregunta clínica",
  catalogReplaceQuestion: "¿Sustituir la pregunta clínica actual por la del catálogo?",
  catalogQuestionChanged: "La pregunta cambió mientras se leía el archivo. Vuelve a importarlo.",
  brand: "Creador de PICOs",
  tagline: "Preguntas clínicas, bien estructuradas.",
  new: "Nueva PICO",
  open: "Abrir",
  save: "Guardar JSON",
  saveAs: "Guardar como",
  export: "Exportar",
  home: "Inicio",
  light: "Activar modo claro",
  dark: "Activar modo oscuro",
  language: "Idioma de la interfaz",
  welcome: "Una pregunta clara. Un buen punto de partida.",
  welcomeText: "Redacta los criterios de selección en una plantilla fija y flexible. Conserva tus preguntas en JSON y compártelas en Markdown, Word o PDF.",
  create: "Crear una nueva PICO",
  openPico: "Abrir una PICO",
  openHint: "Selecciona o arrastra un archivo .pico.json",
  continue: "Continuar borrador",
  example: "Explorar un ejemplo",
  local: "Local · Sin conexión · Tus archivos permanecen en tu equipo",
  questionType: "Tipo de pregunta",
  diagnostic: "Diagnóstico",
  prognosis: "Pronóstico",
  other: "Otras",
  typeHelp: "Los rótulos, comparadores y diseños se adaptan al tipo de pregunta.",
  number: "N.º de pregunta",
  section: "Sección / título del documento",
  clinicalQuestion: "Pregunta clínica",
  sectionPlaceholder: "Sección de las recomendaciones o guía…",
  questionPlaceholder: "Redacta la pregunta clínica…",
  population: "Población",
  populationPlaceholder: "Describe la población elegible…",
  subpopulation: "Subpoblación",
  addSubpopulation: "Añadir subpoblación",
  interventions: "Intervenciones",
  tests: "Pruebas índice",
  factors: "Factores pronósticos",
  otherIntervention: "Intervención / exposición / fenómeno",
  intervention: "Intervención",
  test: "Prueba",
  factor: "Factor",
  element: "Elemento",
  subintervention: "Subintervención",
  subtest: "Subprueba",
  subfactor: "Subfactor",
  subelement: "Subelemento",
  comparators: "Comparadores",
  reference: "Referencia / comparación",
  comparator: "Comparador",
  subcomparator: "Subcomparador",
  controlled: "Comparador controlado",
  freeComparator: "Comparador de texto libre",
  referenceRole: "Papel",
  referenceStandard: "Patrón de referencia",
  comparatorTest: "Prueba comparadora",
  otherRole: "Otro",
  select: "Seleccionar…",
  specification: "Especificación opcional…",
  outcomes: "Desenlaces (Outcomes)",
  diagnosticOutcomes: "Desenlaces diagnósticos",
  prognosticOutcomes: "Desenlaces pronósticos",
  outcome: "Desenlace",
  outcomeName: "Nombre del desenlace…",
  description: "Descripción / definición",
  descriptionPlaceholder: "Medidas, instrumentos, umbrales, momentos…",
  addOutcome: "Añadir desenlace",
  optionalDetails: "Detalles opcionales del desenlace",
  importance: "Importancia",
  notAssessed: "Sin valorar",
  critical: "Crítico",
  important: "Importante",
  notImportant: "No importante",
  score: "Puntuación (1–9)",
  moments: "Momentos (uno por línea)",
  instruments: "Instrumentos (uno por línea)",
  thresholds: "Umbrales (uno por línea)",
  mid: "Diferencia mínima importante",
  studyTypes: "Tipos de estudio",
  included: "Incluidos",
  excluded: "No incluidos",
  addDesign: "Añadir tipo de estudio",
  excludeRest: "Excluir el resto de diseños",
  minimumN: "n mínima",
  conditions: "Condiciones / aclaraciones…",
  nHelp: "Mínimo de participantes. Vacío significa sin umbral. No se aplica a RS ni metaanálisis.",
  publications: "Tipos de publicación",
  pubScope: "Publicaciones admitidas",
  fullOnly: "Sólo estudios completos",
  fullOthers: "Estudios completos y otros tipos de publicaciones",
  addPublication: "Añadir tipo de publicación",
  pubHelp: "El formato de publicación es distinto del diseño. Selecciona expresamente los formatos adicionales admitidos.",
  pubConditions: "Condiciones / aclaraciones sobre publicaciones…",
  reviewerNotes: "Notas para revisores",
  notesPlaceholder: "Aclaraciones para la selección y revisión…",
  bold: "Negrita",
  italic: "Cursiva",
  strike: "Tachado",
  highlight: "Resaltado",
  textColor: "Color de texto",
  automatic: "Color automático",
  noHighlight: "Sin resaltado",
  customColor: "Color personalizado",
  apply: "Aplicar",
  clearFormat: "Quitar formato",
  bullets: "Viñetas",
  undo: "Deshacer",
  redo: "Rehacer",
  up: "Mover arriba",
  down: "Mover abajo",
  drag: "Arrastrar para reordenar",
  remove: "Eliminar",
  clearAll: "Eliminar todos",
  clearAllConfirm: "¿Eliminar todos los elementos de esta lista, incluidos su contenido y subelementos?",
  clearStudiesConfirm: "¿Eliminar todos los diseños de estudio incluidos y no incluidos?",
  add: "Añadir",
  edit: "Editar",
  preview: "Vista previa",
  dirty: "Cambios sin guardar en archivo",
  saved: "JSON guardado",
  draftSaved: "Borrador recuperable guardado",
  draftUnavailable: "Recuperación no disponible; guarda el JSON",
  savedDownload: "JSON descargado",
  fileMode: "Archivo local directo: Guardar descarga un JSON.",
  exportTitle: "Exportar documento",
  format: "Formato",
  markdown: "Markdown",
  word: "Word (.docx)",
  pdf: "PDF",
  legacy: "JSON para modelo RS actual",
  layout: "Distribución",
  table: "Tabla de cuatro columnas",
  sections: "Por apartados",
  paper: "Orientación del papel",
  landscape: "A4 horizontal",
  portrait: "A4 vertical",
  mdStyles: "Formato Markdown",
  clean: "Markdown portable",
  htmlStyles: "Markdown con estilos HTML",
  mdHelp: "El Markdown portable omite color/resaltado. Los estilos HTML dependen del visor.",
  notesInclude: "Incluir notas para revisores",
  cancel: "Cancelar",
  download: "Descargar",
  exporting: "Generando documento…",
  exportSuccess: "Exportación lista",
  error: "Se ha producido un error",
  fileInvalid: "No se pudo abrir este archivo. JSON de PICO inválido o no compatible.",
  tooLarge: "El archivo es demasiado grande (máximo 10 MB).",
  discardTitle: "Cambios sin guardar",
  discardText: "¿Quieres guardar el documento antes de continuar?",
  saveContinue: "Guardar y continuar",
  discard: "Descartar cambios",
  confirmDelete: "¿Eliminar este elemento y su contenido?",
  confirmRemove: "Eliminar",
  typeChange: "Cambiar el tipo conserva los textos. Revisa los diseños y comparadores señalados.",
  reviewType: "Revisar para este tipo de pregunta",
  nDiscard: "Este diseño no utiliza n mínima. ¿Quieres retirar el umbral?",
  pubDiscard: "Pasar a sólo estudios completos retira los criterios de publicaciones adicionales. ¿Continuar?",
  restConfirm: "¿Añadir estos diseños a la lista de no incluidos?",
  restNone: "No hay otros diseños que añadir.",
  help: "Ayuda",
  helpTitle: "Cómo usar el Creador de PICOs",
  helpText: "Crea una pregunta, edita la plantilla y guarda el JSON para conservar una copia editable. Word, PDF y Markdown son copias de presentación. Arrastra los tiradores de seis puntos o utiliza las flechas para reordenar elementos. Los botones de color aplican el último color; sus flechas abren la paleta. Sin selección, el formato se aplica a lo que escribas después. Cambia tema e idioma arriba a la derecha.",
  helpStorage: "Se conserva un borrador recuperable en este navegador cuando es posible. No sustituye a un JSON guardado. La aplicación no realiza llamadas de red y funciona sin conexión.",
  helpDesktop: "Abre directamente PICO-Creator.html o usa el lanzador de servidor local incluido. Consulta el README para generar opcionalmente un ejecutable de Windows.",
  close: "Cerrar",
  draftLabel: "Borrador",
  versionCriteria: "Versión de criterios",
  blank: "No especificado",
  completeWarnings: "Revisar campos pendientes",
  numberWarning: "Introduce un número como 1, 3a o 3b.",
  questionWarning: "La pregunta clínica está vacía.",
  populationWarning: "La población está vacía.",
  outcomeWarning: "Añade desenlaces y completa sus nombres.",
  designWarning: "Indica diseños incluidos y especifica los de tipo «Otro».",
  publicationWarning: "Indica el alcance de publicaciones y los formatos adicionales.",
  catalogWarning: "Revisa diseños o comparadores conservados de otra plantilla.",
  overlapWarning: "Los diseños incluidos y no incluidos se solapan; aclara sus excepciones o condiciones.",
  comparisonWarning: "«Sin comparación» coexiste con otros comparadores; aclara su alcance.",
  exportWarn: "Hay campos pendientes o avisos de coherencia. ¿Exportar como borrador?",
  exampleNotice: "Ejemplo ilustrativo y abreviado. No es un protocolo validado.",
  shortcuts: "Formato: Ctrl/Cmd+B / I · Guardar: Ctrl/Cmd+S",
  selectText: "Haz clic en un campo de texto para darle formato.",
  newChoose: "Elige una plantilla",
  criterionConflict: "Revisar criterios",
  legacyHelp: "Proyección de texto para proyecto-rs. Confirma identidad y versión en destino; el formato rico y los metadatos permanecen en el JSON canónico.",
  fileDropped: "Suelta un JSON de PICO para abrirlo",
  resetColor: "Quitar / automático",
  noN: "No se aplica",
  incompatible: "Conservado de otra plantilla",
  untitled: "Pregunta sin título"
};
const dictionaries = { en, es };
const translate = (lang, key) => dictionaries[lang]?.[key] || en[key] || key;
const labelsFor = (type2, t) => ({ population: t("population"), intervention: t({ intervention: "interventions", diagnostic: "tests", prognosis: "factors", other: "otherIntervention" }[type2]), comparator: t(type2 === "intervention" ? "comparators" : "reference"), outcome: t(type2 === "diagnostic" ? "diagnosticOutcomes" : type2 === "prognosis" ? "prognosticOutcomes" : "outcomes"), item: t({ intervention: "intervention", diagnostic: "test", prognosis: "factor", other: "element" }[type2]), sub: t({ intervention: "subintervention", diagnostic: "subtest", prognosis: "subfactor", other: "subelement" }[type2]) });
function download(blob, name) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3e4);
}
const fileName = (d, extension) => `PICO-${(d.pico.number || "draft").replace(/[^a-zA-Z0-9_-]/g, "_")}${extension}`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function markHtml(text, marks2 = []) {
  let s = esc(text);
  for (const m of marks2) {
    if (m.type === "bold") s = `<strong>${s}</strong>`;
    if (m.type === "italic") s = `<em>${s}</em>`;
    if (m.type === "strike") s = `<s>${s}</s>`;
    if (m.type === "highlight") s = `<mark style="background-color:${esc(m.attrs?.color || "#ffff00")};color:#172033">${s}</mark>`;
    if (m.type === "textStyle" && m.attrs?.color) s = `<span style="color:${esc(m.attrs.color)}">${s}</span>`;
  }
  return s;
}
function richHtml(node) {
  if (!node) return "";
  if (node.type === "text") return markHtml(node.text, node.marks);
  if (node.type === "hardBreak") return "<br>";
  const s = (node.content || []).map(richHtml).join("");
  return { doc: s, paragraph: `<p>${s || "<br>"}</p>`, bulletList: `<ul>${s}</ul>`, listItem: `<li>${s}</li>` }[node.type] || s;
}
const mdEscape = (s) => s.replace(/([\\`*_\[\]<>|])/g, "\\$1");
function richMarkdown(node, html = false, depth = 0) {
  if (!node) return "";
  if (node.type === "hardBreak") return "\n";
  if (node.type === "text") {
    let s = mdEscape(node.text || "");
    for (const m of node.marks || []) {
      if (m.type === "bold") s = `**${s}**`;
      if (m.type === "italic") s = `*${s}*`;
      if (m.type === "strike") s = `~~${s}~~`;
      if (html && m.type === "highlight") s = `<mark style="background-color:${m.attrs?.color || "#ffff00"}">${s}</mark>`;
      if (html && m.type === "textStyle" && m.attrs?.color) s = `<span style="color:${m.attrs.color}">${s}</span>`;
    }
    return s;
  }
  if (node.type === "bulletList") return (node.content || []).map((x) => "  ".repeat(depth) + "- " + richMarkdown(x, html, depth + 1)).join("\n");
  return (node.content || []).map((x) => richMarkdown(x, html, depth)).join(node.type === "doc" ? "\n\n" : node.type === "listItem" ? "\n" : "");
}
function outcomeDetails(o, lang) {
  const t = (k) => translate(lang, k);
  const det = o.details || {};
  const arr = [];
  if (det.importance) arr.push(t("importance") + ": " + { CRITICAL: t("critical"), IMPORTANT: t("important"), NOT_IMPORTANT: t("notImportant") }[det.importance]);
  if (det.score != null) arr.push(t("score") + ": " + det.score);
  for (const [k, title2] of [["timepoints", "moments"], ["instruments", "instruments"], ["thresholds", "thresholds"]]) if (det[k]?.filter((s) => s.trim()).length) arr.push(t(title2).replace(/\s*\([^)]*\)/g, "") + ": " + det[k].filter((s) => s.trim()).join("; "));
  if (det.minimal_important_difference) arr.push(t("mid") + ": " + det.minimal_important_difference);
  return arr;
}
function presentation(d, lang = "en", includeNotes = true) {
  const p = d.pico;
  const t = (k) => translate(lang, k);
  const lbl = labelsFor(p.question_type.template, t);
  const fi = (x, level = 0) => [{ node: x.text, level, strong: level === 0 }, ...(x.children || []).flatMap((y) => fi(y, level + 1))];
  const comps = p.comparators.flatMap((x) => [{ node: x.mode === "FREE" ? x.text : rich(label(COMP_LABELS, x.code, lang)), level: 0, strong: !!x.children?.length }, ...x.mode === "CONTROLLED" && !!plain(x.specification).trim() ? [{ node: x.specification, level: 1 }] : [], ...(x.children || []).flatMap((y) => fi(y, 1))]);
  const outs = p.outcomes.flatMap((x, i) => [{ node: rich(`${i + 1}. ${plain(x.name) || t("blank")}`), level: 0, strong: true, source: x.name, prefix: `${i + 1}. ` }, { node: x.description, level: 0 }, ...outcomeDetails(x, lang).map((s) => ({ node: rich(s), level: 0 }))]);
  const ds = (arr) => arr.flatMap((x) => [{ node: rich(label(DESIGN_LABELS, x.code, lang) + (x.min_n != null ? ` — n ≥ ${x.min_n}` : "")), level: 0, strong: true }, { node: x.conditions, level: 0 }]);
  const pub = p.publication_types;
  return { title: p.section, number: p.number, type: t(p.question_type.template), question: p.clinical_question, criteriaVersion: p.criteria_version, columns: [{ title: lbl.population, items: [{ node: p.population.text, level: 0, strong: !!p.population.subpopulations.length }, ...p.population.subpopulations.map((x) => ({ node: x.text, level: 1 }))] }, { title: lbl.intervention, items: p.interventions.flatMap((x) => fi(x)) }, { title: lbl.comparator, items: comps }, { title: lbl.outcome, items: outs }], included: ds(p.study_designs.included), excluded: ds(p.study_designs.excluded), publications: [{ node: rich(pub.mode === "FULL_REPORTS_ONLY" ? t("fullOnly") : pub.mode === "FULL_REPORTS_AND_OTHERS" ? t("fullOthers") : t("blank")), level: 0, strong: true }, ...pub.additional.flatMap((x) => [{ node: rich(label(PUB_LABELS, x.code, lang)), level: 0, strong: true }, { node: x.clarification, level: 1 }]), { node: pub.conditions, level: 0 }], languages: p.languages ? [{ node: rich(languageNames(p.languages, lang) || t("blank")), level: 0, strong: true }, { node: p.languages.conditions, level: 0 }] : null, notes: includeNotes ? p.reviewer_notes : null };
}
function itemNode(item) {
  if (item.source) {
    const n = JSON.parse(JSON.stringify(item.source));
    const first = n.content.find((x) => x.type === "paragraph");
    if (first) {
      first.content = [{ type: "text", text: item.prefix }, ...first.content || []];
      return n;
    }
  }
  return item.node;
}
function itemHtml(x) {
  return `<div class="export-item" style="padding-left:${x.level * 14}px;${x.strong ? "font-weight:600" : ""}">${richHtml(itemNode(x))}</div>`;
}
function previewHtml(d, lang = "en", includeNotes = true, layout = "table") {
  const v = presentation(d, lang, includeNotes);
  const t = (k) => translate(lang, k);
  const items = (a) => a.map(itemHtml).join("");
  return `<div class="print-title">${plain(v.title).trim() ? richHtml(v.title) : esc(t("untitled"))}</div><div class="print-meta">${esc(t("number"))} ${esc(v.number || "—")} · ${esc(v.type)} · ${esc(t("versionCriteria"))} ${esc(v.criteriaVersion)}</div><div class="print-question">${richHtml(v.question)}</div>${layout === "table" ? `<table class="print-table"><colgroup><col style="width:23%"><col style="width:25%"><col style="width:19%"><col style="width:33%"></colgroup><thead><tr>${v.columns.map((c) => `<th>${esc(c.title)}</th>`).join("")}</tr></thead><tbody><tr>${v.columns.map((c) => `<td>${items(c.items)}</td>`).join("")}</tr></tbody></table>` : v.columns.map((c) => `<h3>${esc(c.title)}</h3>${items(c.items)}`).join("")}<h3>${esc(t("studyTypes"))}</h3><div class="print-designs"><section><h4>${esc(t("included"))}</h4>${items(v.included)}</section><section><h4>${esc(t("excluded"))}</h4>${items(v.excluded)}</section></div><h3>${esc(t("publications"))}</h3>${items(v.publications)}${v.languages ? `<h3>${esc(t("languages"))}</h3>${items(v.languages)}` : ""}${v.notes ? `<h3>${esc(t("reviewerNotes"))}</h3>${richHtml(v.notes)}` : ""}`;
}
function toMarkdown(d, lang = "en", options = {}) {
  const v = presentation(d, lang, options.notes !== false);
  const t = (k) => translate(lang, k);
  const html = options.styles === "html";
  const items = (a) => a.map((x) => "  ".repeat(x.level) + (x.strong ? "**" : "") + richMarkdown(itemNode(x), html) + (x.strong ? "**" : "")).join("\n\n");
  let s = `# ${plain(v.title) || t("untitled")}

${t("number")}: ${v.number || "—"} · ${v.type}

${t("versionCriteria")}: ${v.criteriaVersion}

## ${t("clinicalQuestion")}

${richMarkdown(v.question, html)}

`;
  if (options.layout !== "sections") {
    const cell = (a) => items(a).replace(/\n/g, "<br>").replace(/\|/g, "\\|");
    s += "| " + v.columns.map((c) => c.title).join(" | ") + " |\n| " + v.columns.map(() => "---").join(" | ") + " |\n| " + v.columns.map((c) => cell(c.items)).join(" | ") + " |\n\n";
  } else s += v.columns.map((c) => `## ${c.title}

${items(c.items)}

`).join("");
  s += `## ${t("studyTypes")}

### ${t("included")}

${items(v.included)}

### ${t("excluded")}

${items(v.excluded)}

## ${t("publications")}

${items(v.publications)}

`;
  if (v.languages) s += `## ${t("languages")}

${items(v.languages)}

`;
  if (v.notes) s += `## ${t("reviewerNotes")}

${richMarkdown(v.notes, html)}
`;
  return s;
}
export {
  isLegacyDocument as A,
  legacy as B,
  COMP_CATALOGS as C,
  DESIGN_CATALOGS as D,
  newDocument as E,
  toMarkdown as F,
  validateDocument as G,
  presentation as H,
  itemNode as I,
  fileName as J,
  LANGUAGE_CODE as L,
  PUB_LABELS as P,
  SCHEMA_VERSION as S,
  VERSION as V,
  comparator as a,
  reorder as b,
  copy as c,
  migrateDocument as d,
  download as e,
  freeItem as f,
  label as g,
  COMP_LABELS as h,
  remainder as i,
  DESIGN_LABELS as j,
  LANG_LABELS as k,
  labelsFor as l,
  migrateCatalog as m,
  normalizeRich as n,
  outcome as o,
  previewHtml as p,
  plain as q,
  rich as r,
  noN as s,
  translate as t,
  design as u,
  validateCatalog as v,
  warnings as w,
  typeCode as x,
  uid as y,
  publication as z
};
