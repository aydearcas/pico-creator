import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
const hasBuild=fs.existsSync(new URL('../dist/index.html',import.meta.url));
test('Built local app: language, theme, templates, reorder, publication scope and preview', {skip:!hasBuild},async()=>{
 let html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');const scripts=[];html=html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g,(m,s)=>{scripts.push(s);return '';});const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.join(' ')));
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'https://pico.local/',virtualConsole:vc,beforeParse(w){w.matchMedia=()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.Range.prototype.getBoundingClientRect=()=>({top:0,bottom:0,left:0,right:0,width:0,height:0});w.Range.prototype.getClientRects=()=>[];w.HTMLElement.prototype.scrollIntoView=()=>{};}});
 const pause=()=>new Promise(r=>setTimeout(r,120));const doc=dom.window.document;const button=text=>[...doc.querySelectorAll('button')].find(b=>b.textContent.trim()===text);const choose=(sel,value)=>{sel.value=value;sel.dispatchEvent(new dom.window.Event('change',{bubbles:true}));};
 try{
  for(const s of scripts)dom.window.eval(s);await pause();assert.equal(doc.documentElement.dataset.theme,'light');assert.equal(doc.documentElement.lang,'en');
  doc.querySelector('.language-switch').click();await pause();assert.equal(doc.documentElement.lang,'es');assert(button('Explorar un ejemplo'));
  doc.querySelector('[aria-label="Activar modo oscuro"]').click();await pause();assert.equal(doc.documentElement.dataset.theme,'dark');
  button('Explorar un ejemplo').click();await pause();assert(doc.querySelectorAll('.tiptap').length>=20);
  const designSelect=doc.querySelector('.design-fields select');assert(![...designSelect.options].some(o=>o.value==='DIAGNOSTIC_ACCURACY'));assert.equal(doc.querySelectorAll('.minimum-n').length,3);
  const intervention=doc.querySelectorAll('.pico-column')[1];assert(intervention.querySelector('.card-rich').textContent.includes('Biológicos'));intervention.querySelector('.item-card .move-controls [aria-label="Mover abajo"]').click();await pause();assert(intervention.querySelector('.card-rich').textContent.includes('Sintéticos convencionales'));
  const cards=[...intervention.querySelector('.column-content').children].filter(x=>x.classList.contains('item-card'));const handle=cards[0].querySelector('.drag-handle');const transfer={effectAllowed:'',files:[],types:['application/x-pico-item'],setData(){}};const event=name=>{const e=new dom.window.Event(name,{bubbles:true,cancelable:true});Object.defineProperty(e,'dataTransfer',{value:transfer});return e;};handle.dispatchEvent(event('dragstart'));cards[1].dispatchEvent(event('drop'));await pause();assert(intervention.querySelector('.card-rich').textContent.includes('Biológicos'));
  choose(doc.querySelector('.question-type select'),'diagnostic');await pause();assert(doc.body.textContent.includes('Pruebas índice'));assert([...doc.querySelector('.design-fields select').options].some(o=>o.value==='DIAGNOSTIC_ACCURACY'));
  choose(doc.querySelector('.publication-scope select'),'FULL_REPORTS_AND_OTHERS');await pause();button('Añadir tipo de publicación').click();await pause();assert([...doc.querySelector('.publication-list select').options].some(o=>o.value==='THESIS'));
  assert([...doc.querySelector('.design-fields select').options].some(o=>o.value==='ANY_DESIGN'));
  const list=doc.querySelector('.study-grid>div');const initial=list.querySelectorAll('.design-card').length;
  assert(initial>1);list.querySelector('.clear-list').click();await pause();
  button('Cancelar').click();await pause();assert.equal(list.querySelectorAll('.design-card').length,initial);
  list.querySelector('.clear-list').click();await pause();
  doc.querySelector('.modal-actions .primary').click();await pause();assert.equal(list.querySelectorAll('.design-card').length,0);
  doc.querySelector('[aria-label="Deshacer"]').click();await pause();assert.equal(list.querySelectorAll('.design-card').length,initial);
  const studySection=doc.querySelector('.study-grid').closest('section');studySection.querySelector('.section-heading .clear-list').click();await pause();
  doc.querySelector('.modal-actions .primary').click();await pause();assert.equal(studySection.querySelectorAll('.design-card').length,0);
  doc.querySelector('[aria-label="Deshacer"]').click();await pause();assert.equal(studySection.querySelectorAll('.design-card').length,initial+1);
  const interventionClear=intervention.querySelector('.clear-list');interventionClear.click();await pause();doc.querySelector('.modal-actions .primary').click();await pause();
  assert.equal(intervention.querySelectorAll('.item-card').length,0);doc.querySelector('[aria-label="Deshacer"]').click();await pause();assert(intervention.querySelector('.category-rich'));
  const languages=doc.querySelector('.language-section');assert(!languages.querySelector('.language-grid'));
  choose(languages.querySelector('select'),'RESTRICTED');await pause();assert.equal(languages.querySelectorAll('.language-option input').length,23);
  const option=code=>[...languages.querySelectorAll('.language-option')].find(x=>x.querySelector('code').textContent===code);
  option('spa').querySelector('input').click();await pause();option('eng').querySelector('input').click();await pause();
  const other=languages.querySelector('.language-other input');const typeCode=v=>{Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value').set.call(other,v);other.dispatchEvent(new dom.window.Event('input',{bubbles:true}));};
  typeCode('sw');await pause();assert(languages.querySelector('.language-other .inline-warning'));assert(languages.querySelector('.language-other button').disabled);
  typeCode('xyz');await pause();languages.querySelector('.language-other button').click();await pause();
  assert(option('xyz').querySelector('input').checked);assert(option('spa').querySelector('input').checked);
  button('Vista previa').click();await pause();assert(doc.querySelector('.print-document').textContent.includes('Español, Inglés, xyz'));button('Editar').click();await pause();
  choose(doc.querySelector('.language-section select'),'ANY');await pause();doc.querySelector('.modal-actions .primary').click();await pause();
  assert(!doc.querySelector('.language-section .language-grid'));
  button('Vista previa').click();await pause();assert(doc.querySelector('.print-table'));assert(doc.querySelector('.print-document').textContent.includes('Tipos de publicación'));
  assert(doc.querySelector('.print-document').textContent.includes('Sin restricción de idioma'));
  button('Editar').click();await pause();assert(doc.querySelector('.question-type select'));
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});
test('Opening the HTML as a file saves by download even when a native picker exists', {skip:!hasBuild},async()=>{
 let html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');const scripts=[];html=html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g,(m,s)=>{scripts.push(s);return '';});let captured=null;let pickerCalls=0;let filename='';const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'file:///desktop/PICO-Creator.html',virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.Range.prototype.getBoundingClientRect=()=>({top:0,bottom:0,left:0,right:0,width:0,height:0});w.Range.prototype.getClientRects=()=>[];w.HTMLElement.prototype.scrollIntoView=()=>{};w.isSecureContext=true;w.showSaveFilePicker=async()=>{pickerCalls++;throw Error('Not allowed from file');};w.Blob=globalThis.Blob;w.URL.createObjectURL=blob=>{captured=blob;return 'blob:qa';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){filename=this.download;};}});
 const pause=()=>new Promise(r=>setTimeout(r,130));const doc=dom.window.document;const button=text=>[...doc.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
 try{for(const s of scripts)dom.window.eval(s);await pause();button('Explore an example').click();await pause();button('Save JSON').click();await pause();assert.equal(pickerCalls,0);assert.equal(filename,'PICO-1.pico.json');assert(captured);const data=JSON.parse(await captured.text());assert.equal(data.format,'pico-document');assert.equal(data.pico.study_designs.included.at(-1).min_n,10);assert.equal(data.document_revision,1);assert.deepEqual(errors,[]);}finally{dom.window.close();}
});
