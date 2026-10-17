import test from 'node:test';
import assert from 'node:assert/strict';
import {newDocument,rich,design,outcome,validateDocument,copy,reorder,remainder,DESIGN_CATALOGS,warnings,legacy,plain,uid} from '../src/model.js';
import {exampleDocument} from '../src/example.js';
import {dictionaries} from '../src/i18n.js';
test('All four templates can be saved as incomplete drafts',()=>{for(const t of Object.keys(DESIGN_CATALOGS))assert.deepEqual(validateDocument(newDocument(t)),[]);});
test('Intervention catalogue excludes accuracy, prediction and qualitative studies',()=>{for(const c of ['EXACTITUD_DIAGNOSTICA','MODELO_PREDICCION','CUALITATIVO'])assert.equal(DESIGN_CATALOGS.intervencion.includes(c),false);assert(DESIGN_CATALOGS.diagnostico.includes('EXACTITUD_DIAGNOSTICA'));assert(DESIGN_CATALOGS.pronostico.includes('MODELO_PREDICCION'));});
test('Abbreviated reference preserves conditional minimum n and notes through JSON round trip',()=>{const d=exampleDocument();const r=JSON.parse(JSON.stringify(d));assert.deepEqual(validateDocument(r),[]);assert.equal(r.pico.tipos_estudio.incluidos.at(-1).n_minima,10);assert(plain(r.pico.tipos_estudio.incluidos.at(-1).condiciones).includes('ECA'));assert.equal(r.pico.tipos_publicacion.modo,null);});
test('Question suffixes, rich marks, hierarchy and identity survive serialisation',()=>{const d=exampleDocument();d.pico.numero='3b';d.pico.poblacion.texto.content[0].content[0].marks=[{type:'bold'},{type:'highlight',attrs:{color:'#fff19c'}},{type:'textStyle',attrs:{color:'#255ca8'}}];assert.deepEqual(validateDocument(d),[]);const r=JSON.parse(JSON.stringify(d));assert.deepEqual(r,d);assert.equal(r.pico.numero,'3b');});
test('Minimum n cannot be zero, fractional, negative or applied to reviews',()=>{for(const n of [0,-1,1.5,'10']){const d=newDocument();d.pico.tipos_estudio.incluidos=[{...design('ECA'),n_minima:n}];assert(validateDocument(d).some(e=>e==='MIN_N'||e.startsWith('STRUCTURE:')));}const d=newDocument();d.pico.tipos_estudio.incluidos=[{...design('REVISION_SISTEMATICA'),n_minima:10}];assert(validateDocument(d).some(e=>e==='MIN_N_REVIEW'||e.startsWith('STRUCTURE:')));});
test('Invalid files are rejected rather than stripped',()=>{assert.deepEqual(validateDocument({}),['FORMAT']);const d=newDocument();d.schema_version='9';assert.deepEqual(validateDocument(d),['SCHEMA_VERSION']);const e=newDocument();e.pico.poblacion.texto={type:'doc',content:[{type:'script',text:'evil'}]};assert(validateDocument(e).some(x=>x.startsWith('RICHTEXT')||x.startsWith('STRUCTURE:')));});
test('Duplicate entity IDs and inactive publication criteria are rejected',()=>{const d=exampleDocument();d.pico.outcomes[1].id=d.pico.outcomes[0].id;assert(validateDocument(d).includes('ITEM_ID'));const e=newDocument();e.pico.tipos_publicacion.modo='SOLO_COMPLETOS';e.pico.tipos_publicacion.adicionales=[{id:uid(),codigo:'ABSTRACT',aclaracion:rich()}];assert(validateDocument(e).includes('INACTIVE_PUBLICATIONS'));});
test('Reordering preserves IDs and does not mutate source',()=>{const items=[{id:'a'},{id:'b'},{id:'c'}];assert.deepEqual(reorder(items,0,2).map(x=>x.id),['b','c','a']);assert.deepEqual(items.map(x=>x.id),['a','b','c']);});
test('Exclude remainder respects study family coverage and active template',()=>{const a=[design('OBSERVACIONAL_CUALQUIERA'),design('ECA')];const r=remainder('intervencion',a,[design('METAANALISIS')]);assert(!r.some(x=>['CASO','SERIE_CASOS','OBSERVACIONAL_COMPARATIVO','EXACTITUD_DIAGNOSTICA','MODELO_PREDICCION','OTRO','METAANALISIS','ECA'].includes(x.codigo)));assert(r.some(x=>x.codigo==='REVISION_SISTEMATICA'));});
test('Legacy projection preserves numeric threshold, publication criteria and subgroups',()=>{const d=exampleDocument();d.pico.numero='3a';d.pico.tipos_publicacion.modo='COMPLETOS_Y_OTROS';d.pico.tipos_publicacion.adicionales=[{id:uid(),codigo:'ABSTRACT',aclaracion:rich('Congresos anuales')}];const r=legacy(d,'es');assert.equal(r.pico_id,'PICO-3a');assert(r.componentes.disenos.includes('n ≥ 10'));assert(r.componentes.otros.includes('Abstracts'));assert(r.componentes.intervencion_exposicion_prueba.includes('Anti-CD20'));});
test('The two interface languages have identical translation keys',()=>assert.deepEqual(Object.keys(dictionaries.en).sort(),Object.keys(dictionaries.es).sort()));
test('Any study design is valid in every template and never expands into exclusions',()=>{
 for(const type of Object.keys(DESIGN_CATALOGS)){
  assert(DESIGN_CATALOGS[type].includes('CUALQUIER_ESTUDIO'));
  const d=newDocument(type);d.pico.tipos_estudio.incluidos=[{...design('CUALQUIER_ESTUDIO'),n_minima:10}];
  assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(d))),[]);
  assert(legacy(d,'es').componentes.disenos.includes('Cualquier tipo de estudio — n ≥ 10'));
  assert.deepEqual(remainder(type,d.pico.tipos_estudio.incluidos,[]),[]);
  assert(!remainder(type,[],[]).some(x=>x.codigo==='CUALQUIER_ESTUDIO'));
 }
});
