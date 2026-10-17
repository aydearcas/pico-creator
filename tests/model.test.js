import test from 'node:test';
import assert from 'node:assert/strict';
import {newDocument,rich,design,outcome,validateDocument,copy,reorder,remainder,DESIGN_CATALOGS,warnings,legacy,plain,uid} from '../src/model.js';
import {exampleDocument} from '../src/example.js';
import {dictionaries} from '../src/i18n.js';
test('All four templates can be saved as incomplete drafts',()=>{for(const t of Object.keys(DESIGN_CATALOGS))assert.deepEqual(validateDocument(newDocument(t)),[]);});
test('Intervention catalogue excludes accuracy, prediction and qualitative studies',()=>{for(const c of ['DIAGNOSTIC_ACCURACY','PREDICTION_MODEL','QUALITATIVE_STUDY'])assert.equal(DESIGN_CATALOGS.intervention.includes(c),false);assert(DESIGN_CATALOGS.diagnostic.includes('DIAGNOSTIC_ACCURACY'));assert(DESIGN_CATALOGS.prognosis.includes('PREDICTION_MODEL'));});
test('Abbreviated reference preserves conditional minimum n and notes through JSON round trip',()=>{const d=exampleDocument();const r=JSON.parse(JSON.stringify(d));assert.deepEqual(validateDocument(r),[]);assert.equal(r.pico.study_designs.included.at(-1).min_n,10);assert(plain(r.pico.study_designs.included.at(-1).conditions).includes('ECA'));assert.equal(r.pico.publication_types.mode,null);});
test('Question suffixes, rich marks, hierarchy and identity survive serialisation',()=>{const d=exampleDocument();d.pico.number='3b';d.pico.population.text.content[0].content[0].marks=[{type:'bold'},{type:'highlight',attrs:{color:'#fff19c'}},{type:'textStyle',attrs:{color:'#255ca8'}}];assert.deepEqual(validateDocument(d),[]);const r=JSON.parse(JSON.stringify(d));assert.deepEqual(r,d);assert.equal(r.pico.number,'3b');});
test('Minimum n cannot be zero, fractional, negative or applied to reviews',()=>{for(const n of [0,-1,1.5,'10']){const d=newDocument();d.pico.study_designs.included=[{...design('RCT'),min_n:n}];assert(validateDocument(d).some(e=>e==='MIN_N'||e.startsWith('STRUCTURE:')));}const d=newDocument();d.pico.study_designs.included=[{...design('SYSTEMATIC_REVIEW'),min_n:10}];assert(validateDocument(d).some(e=>e==='MIN_N_REVIEW'||e.startsWith('STRUCTURE:')));});
test('Invalid files are rejected rather than stripped',()=>{assert.deepEqual(validateDocument({}),['FORMAT']);const d=newDocument();d.schema_version='9';assert.deepEqual(validateDocument(d),['SCHEMA_VERSION']);const e=newDocument();e.pico.population.text={type:'doc',content:[{type:'script',text:'evil'}]};assert(validateDocument(e).some(x=>x.startsWith('RICHTEXT')||x.startsWith('STRUCTURE:')));});
test('Duplicate entity IDs and inactive publication criteria are rejected',()=>{const d=exampleDocument();d.pico.outcomes[1].id=d.pico.outcomes[0].id;assert(validateDocument(d).includes('ITEM_ID'));const e=newDocument();e.pico.publication_types.mode='FULL_REPORTS_ONLY';e.pico.publication_types.additional=[{id:uid(),code:'ABSTRACT',clarification:rich()}];assert(validateDocument(e).includes('INACTIVE_PUBLICATIONS'));});
test('Reordering preserves IDs and does not mutate source',()=>{const items=[{id:'a'},{id:'b'},{id:'c'}];assert.deepEqual(reorder(items,0,2).map(x=>x.id),['b','c','a']);assert.deepEqual(items.map(x=>x.id),['a','b','c']);});
test('Exclude remainder respects study family coverage and active template',()=>{const a=[design('OBSERVATIONAL_ANY'),design('RCT')];const r=remainder('intervention',a,[design('META_ANALYSIS')]);assert(!r.some(x=>['CASE_REPORT','CASE_SERIES','OBSERVATIONAL_COMPARATIVE','DIAGNOSTIC_ACCURACY','PREDICTION_MODEL','OTHER','META_ANALYSIS','RCT'].includes(x.code)));assert(r.some(x=>x.code==='SYSTEMATIC_REVIEW'));});
test('Legacy projection preserves numeric threshold, publication criteria and subgroups',()=>{const d=exampleDocument();d.pico.number='3a';d.pico.publication_types.mode='FULL_REPORTS_AND_OTHERS';d.pico.publication_types.additional=[{id:uid(),code:'ABSTRACT',clarification:rich('Congresos anuales')}];const r=legacy(d,'es');assert.equal(r.pico_id,'PICO-3a');assert(r.components.designs.includes('n ≥ 10'));assert(r.components.others.includes('Abstracts'));assert(r.components.intervention_exposure_test.includes('Anti-CD20'));});
test('The two interface languages have identical translation keys',()=>assert.deepEqual(Object.keys(dictionaries.en).sort(),Object.keys(dictionaries.es).sort()));
test('Any study design is valid in every template and never expands into exclusions',()=>{
 for(const type of Object.keys(DESIGN_CATALOGS)){
  assert(DESIGN_CATALOGS[type].includes('ANY_DESIGN'));
  const d=newDocument(type);d.pico.study_designs.included=[{...design('ANY_DESIGN'),min_n:10}];
  assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(d))),[]);
  assert(legacy(d,'es').components.designs.includes('Cualquier tipo de estudio — n ≥ 10'));
  assert.deepEqual(remainder(type,d.pico.study_designs.included,[]),[]);
  assert(!remainder(type,[],[]).some(x=>x.code==='ANY_DESIGN'));
 }
});
