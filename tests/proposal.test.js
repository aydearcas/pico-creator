// Drafts proposed from a question by proponer-pico (schema 1.2.0; revsis-app ADR 0044), with synthetic data only.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
import {validateDocument,warnings,copy} from '../src/model.js';
import {migrateDocument,isLegacyDocument,SCHEMA_VERSION} from '../src/migrate.js';
import {pendingCount,pendingMarks,importedMarks,fromQuestion,markKey,resolveMark,proposePrompt} from '../src/review.js';

const QUESTION='¿Es útil el ejercicio en la artrosis de rodilla?';

// The same draft as if it came from a Word file (importar-pico): a file name and no question text.
function fromWord(){const d=proposedDocument();const s=d.import_review.source;s.file_name='pico-sintetica.docx';s.file_format='DOCX';delete s.question_text;return d;}

export function proposedDocument(){
 const d=migrateDocument(JSON.parse(fs.readFileSync(new URL('./fixtures/revsis/languages.pico.json',import.meta.url),'utf8')));
 d.import_review={source:{file_name:null,sha256:'b'.repeat(64),file_format:'QUESTION',question_text:QUESTION,imported_at:'2026-10-20T12:00:00.000Z',skill:'proponer-pico',skill_version:'1.0.0'},
  marks:[{id:'a1',field:'population',item_id:null,status:'ASSUMED',reason:'Se asumen adultos: la pregunta no dice edad',quote:'artrosis de rodilla',page:null},
   {id:'a2',field:'outcomes',item_id:null,status:'ASSUMED',reason:'Desenlaces habituales en artrosis',quote:'',page:null},
   {id:'a3',field:'languages',item_id:null,status:'NOT_IMPORTED',reason:'Lo decide el grupo',quote:'',page:null},
   {id:'a4',field:'clinical_question',item_id:null,status:'IMPORTED',reason:'',quote:QUESTION,page:null}],
  unplaced:[]};
 return d;
}

test('A 1.1.0 document migrates to 1.2.0 without other changes; the original is not modified',()=>{
 const old=JSON.parse(fs.readFileSync(new URL('./fixtures/revsis/languages.pico.json',import.meta.url),'utf8'));
 assert.equal(old.schema_version,'1.1.0');assert(isLegacyDocument(old));assert.deepEqual(validateDocument(old),['SCHEMA_VERSION']);
 const upgraded=migrateDocument(old);assert.equal(old.schema_version,'1.1.0');assert.equal(upgraded.schema_version,SCHEMA_VERSION);
 assert.deepEqual({...upgraded,schema_version:'1.1.0'},old);assert.deepEqual(validateDocument(upgraded),[]);
 assert.deepEqual(validateDocument(fromWord()),[]);
});

test('A proposal validates; Assumed marks are pending like Review, and an empty field reads Not completed',()=>{
 const d=proposedDocument();assert.deepEqual(validateDocument(d),[]);assert(fromQuestion(d));assert(!fromQuestion(fromWord()));
 assert.equal(pendingCount(d),3);assert.deepEqual(pendingMarks(d).map(m=>m.id),['a1','a2','a3']);assert.deepEqual(importedMarks(d).map(m=>m.id),['a4']);
 assert.equal(markKey(d,d.import_review.marks[0]),'mark_ASSUMED');assert.equal(markKey(d,d.import_review.marks[2]),'mark_MISSING');
 const word=fromWord();assert.equal(markKey(word,word.import_review.marks[2]),'mark_NOT_IMPORTED');
 assert(warnings(d).includes('importWarning'));
 for(const id of ['a1','a2','a3'])resolveMark(d,id);assert.equal(pendingCount(d),0);assert.equal(d.import_review.source.question_text,QUESTION);assert.deepEqual(validateDocument(d),[]);
});

test('The schema requires the question text, and no file name, for a QUESTION origin',()=>{
 const changes=[s=>{delete s.question_text;},s=>{s.file_name='pregunta.txt';},s=>{s.file_format='DOCX';},s=>{s.file_format='TXT';}];
 for(const change of changes){const d=proposedDocument();change(d.import_review.source);assert(validateDocument(d).some(e=>e.startsWith('STRUCTURE:')),String(change));}
 const d=proposedDocument();d.import_review.marks[0].status='MAYBE';assert(validateDocument(d).some(e=>e.startsWith('STRUCTURE:')));
});

test('The proposal prompt is fixed, with the notes and number in between and the question last',()=>{
 const bare=proposePrompt('es',QUESTION);assert(bare.startsWith('Usa la skill proponer-pico'));assert(bare.endsWith('Pregunta:\n'+QUESTION));assert(!bare.includes('Notas:'));
 const full=proposePrompt('es',' '+QUESTION+' ',' Sólo adultos ','3A');
 assert(full.indexOf('Notas:\nSólo adultos')>0);assert(full.includes('Número de la pregunta: 3a'));assert(full.endsWith('Pregunta:\n'+QUESTION));
 assert(full.indexOf('Notas:')<full.indexOf('Número de la pregunta')&&full.indexOf('Número de la pregunta')<full.indexOf('Pregunta:\n'));
 assert(proposePrompt('en','Q').startsWith('Use the proponer-pico skill'));assert(proposePrompt('en','Q').endsWith('Question:\nQ'));
});

const hasBuild=fs.existsSync(new URL('../dist/index.html',import.meta.url));
test('Built app: create from a question, prompt with the question last, proposal with its question and badges',{skip:!hasBuild},async()=>{
 let html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');const scripts=[];html=html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g,(m,s)=>{scripts.push(s);return '';});
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.join(' ')));let clipboard='';
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://pico.local/',virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.Range.prototype.getBoundingClientRect=()=>({top:0,bottom:0,left:0,right:0,width:0,height:0});w.Range.prototype.getClientRects=()=>[];w.HTMLElement.prototype.scrollIntoView=()=>{};Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async v=>{clipboard=v;}}});}});
 const pause=()=>new Promise(r=>setTimeout(r,150));const doc=dom.window.document;const button=text=>[...doc.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
 const type=(el,v)=>{const proto=el.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement:dom.window.HTMLInputElement;Object.getOwnPropertyDescriptor(proto.prototype,'value').set.call(el,v);el.dispatchEvent(new dom.window.Event('input',{bubbles:true}));};
 try{
  for(const s of scripts)dom.window.eval(s);await pause();doc.querySelector('.language-switch').click();await pause();
  [...doc.querySelectorAll('.home-card')].find(b=>b.textContent.includes('Crear desde una pregunta')).click();await pause();
  const modal=doc.querySelector('.modal');assert(modal.textContent.includes('proponer-pico'));assert.equal(modal.querySelectorAll('.import-steps li').length,4);
  assert(button('Copiar prompt').disabled);assert.equal(modal.querySelector('.import-prompt').value,'');
  type(modal.querySelector('textarea'),QUESTION);const [number,notes]=modal.querySelectorAll('.propose-fields input');type(number,'2B');type(notes,'Sólo adultos');await pause();
  const prompt=modal.querySelector('.import-prompt').value;assert(prompt.startsWith('Usa la skill proponer-pico'));assert(prompt.includes('Número de la pregunta: 2b'));assert(prompt.endsWith('Pregunta:\n'+QUESTION));
  button('Copiar prompt').click();await pause();assert.equal(clipboard,prompt);
  const input=doc.querySelector('input[type=file]');const data=proposedDocument();
  Object.defineProperty(input,'files',{configurable:true,value:[{size:1000,text:async()=>JSON.stringify(data)}]});input.dispatchEvent(new dom.window.Event('change',{bubbles:true}));await pause();
  const panel=doc.querySelector('.import-review');assert(panel.textContent.includes('3 por revisar'));assert(panel.textContent.includes('Propuesta por proponer-pico 1.0.0'));assert.equal(panel.querySelector('h2').textContent,'Revisión de la propuesta');
  assert.equal(panel.querySelector('.review-question').textContent,QUESTION);
  assert(doc.querySelector('[data-pico-field="population"] .mark-badge.mark-ASSUMED').textContent==='Asumido');
  assert(doc.querySelector('[data-pico-field="languages"] .mark-badge.mark-NOT_IMPORTED').textContent==='Sin completar');
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});
