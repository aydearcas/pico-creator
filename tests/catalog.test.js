import test from 'node:test';
import assert from 'node:assert/strict';
import {newDocument,rich,plain,copy,validateDocument,COMP_CATALOGS} from '../src/model.js';
import fs from 'node:fs';
import {validateCatalog,importCatalog,activeCatalog,addCatalogVariable,canAddCandidate} from '../src/catalog.js';
import {migrateDocument,migrateCatalog,isLegacyDocument} from '../src/migrate.js';
import exampleFile from '../examples/dermatomyositis-abbreviated.pico.json' with {type:'json'};
import {CATALOG_COMPARATORS} from '../src/catalog-schema.js';
import {toMarkdown} from '../src/exports.js';
import demo from '../examples/dermatomyositis.pico-catalog.json' with {type:'json'};
const setup=()=>{const d=newDocument();importCatalog(d.pico,demo);return d;};
test('Clinical example validates and controlled comparator codes match the application',()=>{
 assert.deepEqual(validateCatalog(demo),[]);
 for(const [type,codes] of Object.entries(CATALOG_COMPARATORS))assert.deepEqual(codes,COMP_CATALOGS[type]);
 const p=newDocument().pico;p.clinical_question=rich('Existing text');importCatalog(p,demo);
 assert.equal(plain(p.clinical_question),'Existing text');assert.equal(p.interventions.length,0);assert.equal(p.outcomes.length,0);
});
test('A child creates its family; adding the family fills missing children without duplicates or overwriting edits',()=>{
 const d=setup(),p=d.pico;
 assert(addCatalogVariable(p,'interventions','drug-methotrexate','en'));
 assert.equal(p.interventions.length,1);assert.equal(p.interventions[0].children.length,1);
 p.interventions[0].children[0].text=rich('My edited name');
 addCatalogVariable(p,'interventions','family-conventional','es');
 assert.equal(p.interventions.length,1);assert.equal(p.interventions[0].children.length,6);
 assert.equal(plain(p.interventions[0].children[0].text),'My edited name');
 assert.equal(canAddCandidate(p,'interventions','family-conventional'),false);
 assert.equal(addCatalogVariable(p,'interventions','drug-methotrexate','en'),false);
 assert.deepEqual(validateDocument(d),[]);
});
test('Selected options are independent editable copies, with language-independent identities',()=>{
 const a=setup(),b=setup();
 addCatalogVariable(a.pico,'outcomes','outcome-skin','es');
 addCatalogVariable(b.pico,'outcomes','outcome-skin','en');
 assert.equal(plain(a.pico.outcomes[0].name),'Actividad cutánea');assert.equal(plain(b.pico.outcomes[0].name),'Cutaneous disease activity');
 assert.notEqual(a.pico.outcomes[0].id,b.pico.outcomes[0].id);
 a.pico.outcomes[0].description=rich('Edited');assert.notEqual(activeCatalog(a.pico).outcomes[2].description.es,'Edited');
 a.pico.variable_catalogs.visible=false;assert.equal(a.pico.outcomes.length,1);
 assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(a))),[]);
});
test('The catalogue registry and provenance survive replacement, switching, save/load and deletion',()=>{
 const d=setup();addCatalogVariable(d.pico,'comparators','comparison-placebo','es');
 const second=copy(demo);second.catalog_id='another-catalog';importCatalog(d.pico,second);
 assert.equal(d.pico.variable_catalogs.catalogs.length,2);
 assert.deepEqual(validateDocument(d),[]);
 d.pico.variable_catalogs.active_id=demo.catalog_id;
 assert.equal(canAddCandidate(d.pico,'comparators','comparison-placebo'),false);
 d.pico.comparators=[];assert.equal(canAddCandidate(d.pico,'comparators','comparison-placebo'),true);
 importCatalog(d.pico,copy(demo));assert.equal(d.pico.variable_catalogs.catalogs.length,2);
 assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(d))),[]);
});
test('Changing the template hides incompatible suggestions without losing selected content',()=>{
 const d=setup();addCatalogVariable(d.pico,'interventions','drug-tofacitinib','es');
 d.pico.question_type.template='diagnostic';d.pico.question_type.code='DIAGNOSTIC';
 assert.equal(canAddCandidate(d.pico,'interventions','drug-brepocitinib'),false);
 assert.equal(addCatalogVariable(d.pico,'outcomes','outcome-skin'),false);
 assert.equal(d.pico.interventions[0].children.length,1);
 assert.deepEqual(validateDocument(d),[]);
});
test('Malformed, duplicated, unsafe and cross-referenced catalogues are rejected before import',()=>{
 for(const change of [
  c=>delete c.outcomes[0].label.en,
  c=>c.outcomes[0].id=c.interventions[0].id,
  c=>c.outcomes[0].source_ids=['missing'],
  c=>c.comparators[0].controlled_code='REFERENCE_STANDARD',
  c=>c.outcomes[0].label.en='<script>alert(1)</script>',
  c=>c.sources[0].url='javascript:alert(1)',
  c=>c.verification.checked_on='2026-02-30',
  c=>c.interventions[0].children[0].children=[],
  c=>{c.sources=[];c.verification.status='source_reviewed';}
 ]){
  const c=copy(demo);change(c);assert(validateCatalog(c).length>0);
  const p=newDocument().pico;assert.throws(()=>importCatalog(p,c));assert.equal(p.variable_catalogs,null);
 }
});
test('Embedded catalogue integrity and unknown active catalogues are checked',()=>{
 const d=setup();d.pico.variable_catalogs.catalogs[0].outcomes[0].source_ids=['absent'];assert(validateDocument(d).length>0);
 const e=setup();e.pico.variable_catalogs.active_id='absent';assert(validateDocument(e).includes('CATALOG_ACTIVE'));
});
test('Old PICO JSON (Spanish 0.1.0) migrates to 1.1.0 without losing content or identity; export contains selected content only',()=>{
 const old=JSON.parse(fs.readFileSync(new URL('./fixtures/legacy-0.1.0.pico.json',import.meta.url),'utf8'));
 assert.deepEqual(validateDocument(old),['SCHEMA_VERSION']);assert(isLegacyDocument(old));
 const upgraded=migrateDocument(old);assert.equal(upgraded.document_id,old.documento_id);assert.equal(upgraded.schema_version,'1.1.0');
 assert.equal(plain(upgraded.pico.clinical_question),plain(old.pico.pregunta_clinica));
 assert.deepEqual(validateDocument(upgraded),[]);assert.equal(old.schema_version,'0.1.0');
 assert.deepEqual(upgraded,exampleFile);
 assert.equal(migrateDocument(upgraded),upgraded);
 importCatalog(upgraded.pico,demo);addCatalogVariable(upgraded.pico,'outcomes','outcome-skin','es');
 const md=toMarkdown(upgraded,'es');assert(md.includes('Actividad cutánea'));assert(!md.includes('Brepocitinib'));
});
test('Old candidate catalogue (0.1.0) migrates on import',()=>{
 const old=JSON.parse(fs.readFileSync(new URL('./fixtures/legacy-0.1.0.pico-catalog.json',import.meta.url),'utf8'));
 assert(validateCatalog(old).length>0);const migrated=migrateCatalog(old);assert.deepEqual(validateCatalog(migrated),[]);assert.deepEqual(migrated,demo);
 const p=newDocument().pico;importCatalog(p,old);assert.equal(activeCatalog(p).schema_version,'0.2.0');
});
