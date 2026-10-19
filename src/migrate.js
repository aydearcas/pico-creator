// Migration of older pico-document files: 0.1.0/0.2.0 (Spanish keys and codes) to 1.0.0,
// then 1.0.0 to 1.1.0 (adds the empty languages block; revsis-app ADR 0035).
// Older files are converted on open; the original file is never modified.
const copy=o=>JSON.parse(JSON.stringify(o));
export const SCHEMA_VERSION='1.1.0';
export const CATALOG_SCHEMA_VERSION='0.2.0';
export const LEGACY_SCHEMA_VERSIONS=['0.1.0','0.2.0','1.0.0'];
export const LEGACY_CATALOG_VERSIONS=['0.1.0'];
export const LEGACY_KEYS={documento_id:'document_id',revision_documento:'document_revision',vinculacion_rs:'review_link',numero:'number',seccion:'section',pregunta_clinica:'clinical_question',tipo_pregunta:'question_type',codigo:'code',plantilla:'template',plantilla_version:'template_version',version_criterios:'criteria_version',poblacion:'population',texto:'text',subpoblaciones:'subpopulations',intervenciones:'interventions',comparadores:'comparators',hijos:'children',modo:'mode',papel:'role',especificacion:'specification',nombre:'name',descripcion:'description',detalles:'details',importancia:'importance',puntuacion:'score',momentos:'timepoints',instrumentos:'instruments',umbrales:'thresholds',diferencia_minima_importante:'minimal_important_difference',tipos_estudio:'study_designs',catalogo_version:'catalog_version',incluidos:'included',excluidos:'excluded',resto_excluido_aplicado:'remainder_excluded',n_minima:'min_n',condiciones:'conditions',tipos_publicacion:'publication_types',adicionales:'additional',aclaracion:'clarification',notas_revisores:'reviewer_notes',catalogo_variables:'variable_catalogs',catalogos:'catalogs',activo_id:'active_id',catalogo_origen:'catalog_origin'};
export const LEGACY_TEMPLATES={intervencion:'intervention',diagnostico:'diagnostic',pronostico:'prognosis',otras:'other'};
export const LEGACY_CODES={INTERVENCION:'INTERVENTION',SEGURIDAD:'SAFETY',DIAGNOSTICO:'DIAGNOSTIC',PRONOSTICO:'PROGNOSIS',PREDICCION:'PREDICTION',ETIOLOGIA:'ETIOLOGY',EXPOSICION:'EXPOSURE',PREVALENCIA:'PREVALENCE',CUALITATIVA:'QUALITATIVE',OTRA:'OTHER',CUALQUIER_ESTUDIO:'ANY_DESIGN',REVISION_SISTEMATICA:'SYSTEMATIC_REVIEW',METAANALISIS:'META_ANALYSIS',ECA:'RCT',ENSAYO_NO_ALEATORIZADO:'NON_RANDOMIZED_TRIAL',OBSERVACIONAL_CUALQUIERA:'OBSERVATIONAL_ANY',OBSERVACIONAL_COMPARATIVO:'OBSERVATIONAL_COMPARATIVE',OBSERVACIONAL_NO_COMPARATIVO:'OBSERVATIONAL_NON_COMPARATIVE',SERIE_CASOS:'CASE_SERIES',CASO:'CASE_REPORT',EXACTITUD_DIAGNOSTICA:'DIAGNOSTIC_ACCURACY',MODELO_PREDICCION:'PREDICTION_MODEL',CUALITATIVO:'QUALITATIVE_STUDY',OTRO:'OTHER',CUIDADO_HABITUAL:'USUAL_CARE',CUALQUIER_COMPARADOR:'ANY_COMPARATOR',OTROS_FARMACOLOGICOS:'OTHER_PHARMACOLOGICAL',SIMULADA:'SHAM',SIN_COMPARACION:'NO_COMPARISON',PATRON_REFERENCIA:'REFERENCE_STANDARD',DIAGNOSTICO_CLINICO:'CLINICAL_DIAGNOSIS',OTRA_PRUEBA:'OTHER_TEST',PRUEBA_HABITUAL:'USUAL_TEST',SIN_COMPARACION_PRUEBAS:'NO_TEST_COMPARISON',AUSENCIA_FACTOR:'FACTOR_ABSENT',NIVEL_REFERENCIA:'REFERENCE_LEVEL',OTRO_FACTOR_MODELO:'OTHER_FACTOR_OR_MODEL',SEGUIMIENTO_HABITUAL:'USUAL_FOLLOW_UP',COMPARADOR:'COMPARATOR',LIBRE:'FREE',CONTROLADO:'CONTROLLED',CRITICO:'CRITICAL',IMPORTANTE:'IMPORTANT',NO_IMPORTANTE:'NOT_IMPORTANT',CARTA:'LETTER',TESIS:'THESIS',INFORME:'REPORT',CUALQUIERA:'ANY',SOLO_COMPLETOS:'FULL_REPORTS_ONLY',COMPLETOS_Y_OTROS:'FULL_REPORTS_AND_OTHERS'};
const code=v=>typeof v==='string'&&Object.hasOwn(LEGACY_CODES,v)?LEGACY_CODES[v]:v;
const template=v=>typeof v==='string'&&Object.hasOwn(LEGACY_TEMPLATES,v)?LEGACY_TEMPLATES[v]:v;
function renameKeys(value){
 if(Array.isArray(value))return value.map(renameKeys);
 if(!value||typeof value!=='object')return value;
 const out={};for(const [k,v] of Object.entries(value))out[Object.hasOwn(LEGACY_KEYS,k)?LEGACY_KEYS[k]:k]=renameKeys(v);return out;
}
export const isLegacyCatalog=c=>c?.format==='pico-variable-catalog'&&LEGACY_CATALOG_VERSIONS.includes(c.schema_version);
export function migrateCatalog(value){
 if(!isLegacyCatalog(value))return value;
 const c=copy(value);c.schema_version=CATALOG_SCHEMA_VERSION;c.question_type=template(c.question_type);
 for(const x of c.comparators||[])if(x.controlled_code)x.controlled_code=code(x.controlled_code);
 return c;
}
export const isLegacyDocument=d=>d?.format==='pico-document'&&LEGACY_SCHEMA_VERSIONS.includes(d.schema_version);
// 1.0.0 -> 1.1.0: languages block, not stated, right after publication_types (same key order as new documents).
function addLanguages(d){
 const p=d.pico;if(!p||typeof p!=='object'||'languages' in p)return d;
 const out={};for(const [k,v] of Object.entries(p)){out[k]=v;if(k==='publication_types')out.languages={mode:null,included:[],conditions:{type:'doc',content:[{type:'paragraph'}]}};}
 if(!('languages' in out))out.languages={mode:null,included:[],conditions:{type:'doc',content:[{type:'paragraph'}]}};
 d.pico=out;return d;
}
export function migrateDocument(value){
 if(!isLegacyDocument(value))return value;
 if(value.schema_version==='1.0.0'){const d=addLanguages(copy(value));d.schema_version=SCHEMA_VERSION;return d;}
 const d=renameKeys(value);d.schema_version=SCHEMA_VERSION;addLanguages(d);const p=d.pico;if(!p||typeof p!=='object')return d;
 if(p.question_type){p.question_type.code=code(p.question_type.code);p.question_type.template=template(p.question_type.template);}
 for(const x of p.comparators||[]){x.mode=code(x.mode);x.role=code(x.role);if('code' in x)x.code=code(x.code);}
 for(const x of p.outcomes||[])if(x?.details)x.details.importance=code(x.details.importance);
 for(const k of ['included','excluded'])for(const x of p.study_designs?.[k]||[])x.code=code(x.code);
 if(p.publication_types){p.publication_types.mode=code(p.publication_types.mode);for(const x of p.publication_types.additional||[])x.code=code(x.code);}
 if(p.variable_catalogs===undefined)p.variable_catalogs=null;
 if(p.variable_catalogs?.catalogs)p.variable_catalogs.catalogs=p.variable_catalogs.catalogs.map(migrateCatalog);
 return d;
}
