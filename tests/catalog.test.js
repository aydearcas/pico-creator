import test from 'node:test';
import assert from 'node:assert/strict';
import {newDocument,rich,plain,copy,validateDocument,COMP_CATALOGS} from '../src/model.js';
import {validateCatalog,importCatalog,activeCatalog,addCatalogVariable,canAddCandidate,upgradeDocument} from '../src/catalog.js';
import {CATALOG_COMPARATORS} from '../src/catalog-schema.js';
import {toMarkdown} from '../src/exports.js';
import demo from '../examples/dermatomyositis.pico-catalog.json' with {type:'json'};
const setup=()=>{const d=newDocument();importCatalog(d.pico,demo);return d;};
test('Clinical example validates and controlled comparator codes match the application',()=>{
 assert.deepEqual(validateCatalog(demo),[]);
 for(const [type,codes] of Object.entries(CATALOG_COMPARATORS))assert.deepEqual(codes,COMP_CATALOGS[type]);
 const p=newDocument().pico;p.pregunta_clinica=rich('Existing text');importCatalog(p,demo);
 assert.equal(plain(p.pregunta_clinica),'Existing text');assert.equal(p.intervenciones.length,0);assert.equal(p.outcomes.length,0);
});
test('A child creates its family; adding the family fills missing children without duplicates or overwriting edits',()=>{
 const d=setup(),p=d.pico;
 assert(addCatalogVariable(p,'interventions','drug-methotrexate','en'));
 assert.equal(p.intervenciones.length,1);assert.equal(p.intervenciones[0].hijos.length,1);
 p.intervenciones[0].hijos[0].texto=rich('My edited name');
 addCatalogVariable(p,'interventions','family-conventional','es');
 assert.equal(p.intervenciones.length,1);assert.equal(p.intervenciones[0].hijos.length,6);
 assert.equal(plain(p.intervenciones[0].hijos[0].texto),'My edited name');
 assert.equal(canAddCandidate(p,'interventions','family-conventional'),false);
 assert.equal(addCatalogVariable(p,'interventions','drug-methotrexate','en'),false);
 assert.deepEqual(validateDocument(d),[]);
});
test('Selected options are independent editable copies, with language-independent identities',()=>{
 const a=setup(),b=setup();
 addCatalogVariable(a.pico,'outcomes','outcome-skin','es');
 addCatalogVariable(b.pico,'outcomes','outcome-skin','en');
 assert.equal(plain(a.pico.outcomes[0].nombre),'Actividad cutánea');assert.equal(plain(b.pico.outcomes[0].nombre),'Cutaneous disease activity');
 assert.notEqual(a.pico.outcomes[0].id,b.pico.outcomes[0].id);
 a.pico.outcomes[0].descripcion=rich('Edited');assert.notEqual(activeCatalog(a.pico).outcomes[2].description.es,'Edited');
 a.pico.catalogo_variables.visible=false;assert.equal(a.pico.outcomes.length,1);
 assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(a))),[]);
});
test('The catalogue registry and provenance survive replacement, switching, save/load and deletion',()=>{
 const d=setup();addCatalogVariable(d.pico,'comparators','comparison-placebo','es');
 const second=copy(demo);second.catalog_id='another-catalog';importCatalog(d.pico,second);
 assert.equal(d.pico.catalogo_variables.catalogos.length,2);
 assert.deepEqual(validateDocument(d),[]);
 d.pico.catalogo_variables.activo_id=demo.catalog_id;
 assert.equal(canAddCandidate(d.pico,'comparators','comparison-placebo'),false);
 d.pico.comparadores=[];assert.equal(canAddCandidate(d.pico,'comparators','comparison-placebo'),true);
 importCatalog(d.pico,copy(demo));assert.equal(d.pico.catalogo_variables.catalogos.length,2);
 assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(d))),[]);
});
test('Changing the template hides incompatible suggestions without losing selected content',()=>{
 const d=setup();addCatalogVariable(d.pico,'interventions','drug-tofacitinib','es');
 d.pico.tipo_pregunta.plantilla='diagnostico';d.pico.tipo_pregunta.codigo='DIAGNOSTICO';
 assert.equal(canAddCandidate(d.pico,'interventions','drug-brepocitinib'),false);
 assert.equal(addCatalogVariable(d.pico,'outcomes','outcome-skin'),false);
 assert.equal(d.pico.intervenciones[0].hijos.length,1);
 assert.deepEqual(validateDocument(d),[]);
});
test('Malformed, duplicated, unsafe and cross-referenced catalogues are rejected before import',()=>{
 for(const change of [
  c=>delete c.outcomes[0].label.en,
  c=>c.outcomes[0].id=c.interventions[0].id,
  c=>c.outcomes[0].source_ids=['missing'],
  c=>c.comparators[0].controlled_code='PATRON_REFERENCIA',
  c=>c.outcomes[0].label.en='<script>alert(1)</script>',
  c=>c.sources[0].url='javascript:alert(1)',
  c=>c.verification.checked_on='2026-02-30',
  c=>c.interventions[0].children[0].children=[],
  c=>{c.sources=[];c.verification.status='source_reviewed';}
 ]){
  const c=copy(demo);change(c);assert(validateCatalog(c).length>0);
  const p=newDocument().pico;assert.throws(()=>importCatalog(p,c));assert.equal(p.catalogo_variables,null);
 }
});
test('Embedded catalogue integrity and unknown active catalogues are checked',()=>{
 const d=setup();d.pico.catalogo_variables.catalogos[0].outcomes[0].source_ids=['absent'];assert(validateDocument(d).length>0);
 const e=setup();e.pico.catalogo_variables.activo_id='absent';assert(validateDocument(e).includes('CATALOG_ACTIVE'));
});
test('Old PICO JSON upgrades without losing content or identity; export contains selected content only',()=>{
 const old=newDocument();old.schema_version='0.1.0';delete old.pico.catalogo_variables;
 old.pico.pregunta_clinica=rich('Old question');assert.deepEqual(validateDocument(old),[]);
 const upgraded=upgradeDocument(old);assert.equal(upgraded.documento_id,old.documento_id);assert.equal(plain(upgraded.pico.pregunta_clinica),'Old question');assert.equal(upgraded.schema_version,'0.2.0');
 assert.deepEqual(validateDocument(upgraded),[]);assert.equal(old.schema_version,'0.1.0');
 importCatalog(upgraded.pico,demo);addCatalogVariable(upgraded.pico,'outcomes','outcome-skin','es');
 const md=toMarkdown(upgraded,'es');assert(md.includes('Actividad cutánea'));assert(!md.includes('Brepocitinib'));
});
