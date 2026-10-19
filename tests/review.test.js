// Import marks of a draft from Word or PDF (import_review; revsis-app ADR 0038), with synthetic data only.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
import {validateDocument,warnings,copy} from '../src/model.js';
import {pendingCount,pendingMarks,importedMarks,marksFor,resolveMark,discardFragment,itemLabel,importPrompt,fmt} from '../src/review.js';

export function importedDocument(){
 const d=JSON.parse(fs.readFileSync(new URL('./fixtures/revsis/languages.pico.json',import.meta.url),'utf8'));
 const p=d.pico;const first=p.interventions[0];
 d.import_review={source:{file_name:'pico-sintetica.docx',sha256:'a'.repeat(64),file_format:'DOCX',imported_at:'2026-10-19T12:00:00.000Z',skill:'importar-pico',skill_version:'1.0.0'},
  marks:[{id:'m1',field:'clinical_question',item_id:null,status:'REVIEW',reason:'Pregunta reconstruida',quote:'¿Es eficaz…?',page:null},
   {id:'m2',field:'interventions',item_id:first.id,status:'REVIEW',reason:'Dosis ambigua',quote:'dosis baja',page:2},
   {id:'m3',field:'languages',item_id:null,status:'NOT_IMPORTED',reason:'No consta',quote:'',page:null},
   {id:'m4',field:'population',item_id:null,status:'IMPORTED',reason:'',quote:'Adultos',page:1}],
  unplaced:[{id:'u1',text:'Pendiente de revisar con el panel.',page:3}]};
 return d;
}

test('Pending marks and text not placed are counted; imported marks are not',()=>{
 const d=importedDocument();assert.deepEqual(validateDocument(d),[]);
 assert.equal(pendingCount(d),4);assert.deepEqual(pendingMarks(d).map(m=>m.id),['m1','m2','m3']);assert.deepEqual(importedMarks(d).map(m=>m.id),['m4']);
 assert.deepEqual(marksFor(d,'clinical_question').map(m=>m.id),['m1']);
 assert.deepEqual(marksFor(d,null,d.pico.interventions[0].id).map(m=>m.id),['m2']);
 assert.deepEqual(marksFor(d,'interventions'),[]);
 assert(warnings(d).includes('importWarning'));
});

test('Reviewing removes the mark and keeps the provenance; the document stays valid',()=>{
 const d=importedDocument();
 for(const id of ['m1','m2','m3'])resolveMark(d,id);discardFragment(d,'u1');
 assert.equal(pendingCount(d),0);assert.equal(d.import_review.source.file_name,'pico-sintetica.docx');
 assert.deepEqual(d.import_review.marks.map(m=>m.id),['m4']);
 assert.deepEqual(validateDocument(d),[]);assert(!warnings(d).includes('importWarning'));
});

test('Mark targets are labelled, and a removed item is reported as such',()=>{
 const d=importedDocument();const id=d.pico.interventions[0].id;
 assert.equal(typeof itemLabel(d.pico,id,'es'),'string');
 d.pico.interventions=[];assert.equal(itemLabel(d.pico,id,'es'),null);
});

test('The import prompt is fixed, with the notes at the end',()=>{
 assert(importPrompt('es').startsWith('Usa la skill importar-pico'));assert(!importPrompt('es').includes('Notas para'));
 assert(importPrompt('es',' Sólo la 3b ').endsWith('Notas para esta importación:\nSólo la 3b'));
 assert(importPrompt('en','x').includes('importar-pico'));assert.equal(fmt('{n} por revisar',{n:3}),'3 por revisar');
});

const hasBuild=fs.existsSync(new URL('../dist/index.html',import.meta.url));
test('Built app: import dialog, review panel, badges, go to field, review, discard and undo',{skip:!hasBuild},async()=>{
 let html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');const scripts=[];html=html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g,(m,s)=>{scripts.push(s);return '';});
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.join(' ')));let clipboard='';
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://pico.local/',virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.Range.prototype.getBoundingClientRect=()=>({top:0,bottom:0,left:0,right:0,width:0,height:0});w.Range.prototype.getClientRects=()=>[];w.HTMLElement.prototype.scrollIntoView=()=>{};Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async s=>{clipboard=s;}}});}});
 const pause=()=>new Promise(r=>setTimeout(r,150));const doc=dom.window.document;const button=text=>[...doc.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
 const type=(el,v)=>{Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype,'value').set.call(el,v);el.dispatchEvent(new dom.window.Event('input',{bubbles:true}));};
 try{
  for(const s of scripts)dom.window.eval(s);await pause();doc.querySelector('.language-switch').click();await pause();
  button('Importar desde Word o PDFTrae una PICO que ya tienes, con ayuda de un asistente')?.click()??[...doc.querySelectorAll('.home-card')].find(b=>b.textContent.includes('Importar desde Word o PDF')).click();await pause();
  const modal=doc.querySelector('.modal');assert(modal.textContent.includes('importar-pico'));assert.equal(modal.querySelectorAll('.import-steps li').length,4);
  type(modal.querySelector('textarea'),'Sólo la 1');await pause();assert(modal.querySelector('.import-prompt').value.endsWith('Notas para esta importación:\nSólo la 1'));
  button('Copiar prompt').click();await pause();assert(clipboard.startsWith('Usa la skill importar-pico'));
  const input=doc.querySelector('input[type=file]');const data=importedDocument();
  Object.defineProperty(input,'files',{configurable:true,value:[{size:1000,text:async()=>JSON.stringify(data)}]});input.dispatchEvent(new dom.window.Event('change',{bubbles:true}));await pause();
  const panel=()=>doc.querySelector('.import-review');assert(panel());assert(panel().textContent.includes('4 por revisar'));assert(panel().textContent.includes('pico-sintetica.docx'));
  assert.equal(panel().querySelectorAll(':scope>.import-review-list>li').length,4);assert(panel().querySelector('.import-review-imported').textContent.includes('Importado sin dudas (1)'));
  const item=doc.querySelector(`[data-item-id="${data.pico.interventions[0].id}"]`);const badge=item.querySelector('.mark-badge.mark-REVIEW');assert(badge);
  assert(doc.querySelector('[data-pico-field="clinical_question"] .mark-badge'));assert(doc.querySelector('[data-pico-field="languages"] .mark-NOT_IMPORTED'));
  assert(doc.querySelector('.validation-panel').textContent.includes('Quedan campos o textos importados por revisar'));
  [...panel().querySelectorAll('li')].find(li=>li.textContent.includes('No importado')).querySelector('.text-button').click();await pause();
  assert(doc.querySelector('[data-pico-field="languages"]').classList.contains('mark-flash'));
  badge.click();await pause();const pop=item.querySelector('.mark-popover');assert(pop.textContent.includes('Dosis ambigua'));assert(pop.textContent.includes('pág. 2'));
  [...pop.querySelectorAll('button')].find(b=>b.textContent.includes('Marcar como revisado')).click();await pause();
  assert(panel().textContent.includes('3 por revisar'));assert(!item.querySelector('.mark-badge'));
  [...panel().querySelectorAll('button')].find(b=>b.textContent.includes('Descartar')).click();await pause();assert(panel().textContent.includes('2 por revisar'));
  doc.querySelector('[aria-label="Deshacer"]').click();await pause();assert(panel().textContent.includes('3 por revisar'));
  doc.querySelector('[aria-label="Rehacer"]').click();await pause();
  for(const li of [...panel().querySelectorAll(':scope>.import-review-list>li')].filter(li=>li.querySelector('.mark-actions')&&li.textContent.includes('Marcar como revisado')))[...li.querySelectorAll('button')].find(b=>b.textContent.includes('Marcar como revisado')).click(),await pause();
  assert(panel().textContent.includes('Revisión completa'));assert(!doc.querySelector('.mark-badges .mark-badge'));
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});
