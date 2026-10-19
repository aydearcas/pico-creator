// Languages and import marks of schema 1.1.0 (revsis-app ADR 0035). revsis-app owns the schema:
// pico-document.schema.json and tests/fixtures/revsis/ are exact copies of its files.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newDocument,validateDocument,warnings,legacy,rich,uid,LANG_LABELS,copy} from '../src/model.js';
import {migrateDocument,isLegacyDocument,SCHEMA_VERSION} from '../src/migrate.js';
import {toMarkdown,previewHtml,pdfDefinition,presentation} from '../src/exports.js';
import {exampleDocument} from '../src/example.js';
const read=name=>JSON.parse(fs.readFileSync(new URL('./fixtures/revsis/'+name,import.meta.url),'utf8'));
const schema=JSON.parse(fs.readFileSync(new URL('../pico-document.schema.json',import.meta.url),'utf8'));
const withLanguages=block=>{const d=newDocument();Object.assign(d.pico.languages,block);return d;};

test('The schema is revsis 1.1.0 and new documents carry an unstated languages block after publication types',()=>{
 assert.equal(SCHEMA_VERSION,'1.1.0');assert.equal(schema.properties.schema_version.const,'1.1.0');assert(schema.$id.endsWith('pico-document-1.1.0.json'));
 const keys=Object.keys(newDocument().pico);assert.equal(keys[keys.indexOf('publication_types')+1],'languages');
 assert.deepEqual(newDocument().pico.languages,{mode:null,included:[],conditions:rich()});
});

test('A 1.0.0 document migrates to 1.1.0 keeping content, identity and key order; the original is not modified',()=>{
 const current=exampleDocument();const old=copy(current);old.schema_version='1.0.0';delete old.pico.languages;
 assert.deepEqual(validateDocument(old),['SCHEMA_VERSION']);assert(isLegacyDocument(old));
 const upgraded=migrateDocument(old);assert.equal(old.schema_version,'1.0.0');assert(!('languages' in old.pico));
 assert.deepEqual(upgraded,current);assert.deepEqual(Object.keys(upgraded.pico),Object.keys(current.pico));
 assert.deepEqual(validateDocument(upgraded),[]);assert.equal(migrateDocument(upgraded),upgraded);
});

test('The revsis synthetic document validates and its projection is identical to revsis project_question()',()=>{
 const d=read('languages.pico.json');assert.deepEqual(validateDocument(d),[]);
 for(const lang of ['es','en']){
  const expected=read(`languages.projection.${lang}.json`);const actual=legacy(d,lang);
  delete expected.source;delete actual.source;assert.deepEqual(actual,expected);
 }
});

test('The schema rejects inactive, malformed and repeated language codes and unknown modes',()=>{
 for(const block of [{mode:'ANY',included:['eng']},{mode:null,included:['eng']},{mode:'RESTRICTED',included:['en']},{mode:'RESTRICTED',included:['eng','eng']},{mode:'ONLY'}])
  assert(validateDocument(withLanguages(block)).some(e=>e.startsWith('STRUCTURE:')),JSON.stringify(block));
 assert.deepEqual(validateDocument(withLanguages({mode:'RESTRICTED',included:['eng','swe','xyz']})),[]);
 const d=newDocument();delete d.pico.languages;assert(validateDocument(d).some(e=>e.startsWith('STRUCTURE:')));
});

test('Unstated or empty restricted languages raise a completeness warning; no restriction does not',()=>{
 assert(warnings(newDocument()).includes('languageWarning'));
 assert(warnings(withLanguages({mode:'RESTRICTED'})).includes('languageWarning'));
 assert(!warnings(withLanguages({mode:'RESTRICTED',included:['eng']})).includes('languageWarning'));
 assert(!warnings(withLanguages({mode:'ANY'})).includes('languageWarning'));
});

test('Language labels follow the interface language; unknown codes are shown as they are',()=>{
 const d=withLanguages({mode:'RESTRICTED',included:['spa','eng','swe','xyz'],conditions:rich('Con traducción')});
 assert(legacy(d,'es').components.others.includes('Idiomas: Español, Inglés, Sueco, xyz\nCon traducción\n\nNotas para revisores:'));
 assert(legacy(d,'en').components.others.includes('Languages: Spanish, English, Swedish, xyz\n'));
 assert(legacy(withLanguages({mode:'ANY'}),'es').components.others.includes('Idiomas: Sin restricción de idioma\n'));
 assert.equal(Object.keys(LANG_LABELS).length,23);assert(Object.keys(LANG_LABELS).every(c=>/^[a-z]{3}$/.test(c)));
});

test('Preview, Markdown and PDF show languages after publication types',()=>{
 const d=withLanguages({mode:'RESTRICTED',included:['eng','spa'],conditions:rich('Otros con traducción')});
 const md=toMarkdown(d,'es');assert(md.indexOf('## Idiomas')>md.indexOf('## Tipos de publicación'));assert(md.includes('**Inglés, Español**'));assert(md.includes('Otros con traducción'));
 assert(previewHtml(d,'en').includes('<h3>Languages</h3>'));
 const pdf=JSON.stringify(pdfDefinition(d,'es'));assert(pdf.includes('"Idiomas"'));assert(pdf.includes('Inglés, Español'));
 assert.equal(JSON.stringify(presentation(newDocument(),'es').languages[0].node),JSON.stringify(rich('No especificado')));
});

test('Import marks from a Word or PDF draft are part of the schema and survive a JSON round trip',()=>{
 const d=newDocument();const id=uid();
 d.import_review={source:{file_name:'pico.docx',sha256:'a'.repeat(64),file_format:'DOCX',imported_at:'2026-10-19T12:00:00Z',skill:'importar-pico',skill_version:'1.0.0'},
  marks:[{id,field:'clinical_question',item_id:null,status:'REVIEW',reason:'Ambigua',quote:'¿Es eficaz…?',page:null}],unplaced:[{id:uid(),text:'Texto suelto',page:2}]};
 assert.deepEqual(validateDocument(JSON.parse(JSON.stringify(d))),[]);
 d.import_review.marks[0].status='MAYBE';assert(validateDocument(d).some(e=>e.startsWith('STRUCTURE:')));
 d.import_review=null;assert.deepEqual(validateDocument(d),[]);
});
