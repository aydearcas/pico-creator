import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM,VirtualConsole} from 'jsdom';
import {validateDocument} from '../src/model.js';
import demo from '../examples/dermatomyositis.pico-catalog.json' with {type:'json'};
test('Built editor imports, selects, translates, hides, undoes and reopens candidate catalogues',async()=>{
 let html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');const scripts=[];
 html=html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g,(m,s)=>{scripts.push(s);return '';});
 let captured;const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.join(' ')));
 const dom=new JSDOM(html,{url:'https://pico.local/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.Range.prototype.getBoundingClientRect=()=>({top:0,bottom:0,left:0,right:0,width:0,height:0});w.Range.prototype.getClientRects=()=>[];w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.Blob=globalThis.Blob;w.URL.createObjectURL=blob=>{captured=blob;return 'blob:test';};w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){};
 }});
 const doc=dom.window.document,pause=()=>new Promise(r=>setTimeout(r,150));
 const button=text=>[...doc.querySelectorAll('button')].find(b=>b.textContent.trim()===text);
 const choose=(select,value)=>{select.value=value;select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));};
 const upload=async(input,data)=>{Object.defineProperty(input,'files',{configurable:true,value:[{size:1000,text:async()=>JSON.stringify(data)}]});input.dispatchEvent(new dom.window.Event('change',{bubbles:true}));await pause();};
 try{
  scripts.forEach(s=>dom.window.eval(s));await pause();doc.querySelector('.home-card.accent-card').click();await pause();doc.querySelector('.template-picker button').click();await pause();
  assert.equal(doc.querySelector('[role="switch"]').disabled,true);
  button('Try dermatomyositis').click();await pause();
  assert.equal(doc.querySelectorAll('.catalog-picker select').length,3);
  const selectors=()=>[...doc.querySelectorAll('.catalog-picker select')];
  choose(selectors()[0],'drug-methotrexate');await pause();
  const interventions=()=>doc.querySelectorAll('.pico-column')[1];
  assert(interventions().textContent.includes('Methotrexate'));assert.equal(interventions().querySelectorAll('.child-card').length,1);
  choose(selectors()[0],'family-conventional');await pause();assert.equal(interventions().querySelectorAll('.child-card').length,6);
  choose(selectors()[2],'outcome-skin');await pause();assert(doc.querySelector('.outcome-name').textContent.includes('Cutaneous disease activity'));
  doc.querySelector('[role="switch"]').click();await pause();assert.equal(doc.querySelectorAll('.catalog-picker').length,0);assert.equal(interventions().querySelectorAll('.child-card').length,6);
  doc.querySelector('[role="switch"]').click();await pause();
  doc.querySelector('.language-switch').click();await pause();assert(selectors()[0].textContent.includes('Metotrexato'));assert(interventions().textContent.includes('Methotrexate'));
  const snapshot=interventions().textContent;
  const invalid=structuredClone(demo);delete invalid.outcomes[0].label.en;
  await upload(doc.querySelector('[data-catalog-file]'),invalid);assert.equal(interventions().textContent,snapshot);
  button('Guardar JSON').click();await pause();const saved=JSON.parse(await captured.text());
  assert.equal(saved.schema_version,'1.1.0');assert(saved.pico.variable_catalogs);assert.deepEqual(validateDocument(saved),[]);
  const open=doc.querySelector('input[type=file]:not([data-catalog-file])');await upload(open,saved);
  assert.equal(interventions().querySelectorAll('.child-card').length,6);
  assert.equal([...selectors()[0].options].find(o=>o.value==='drug-methotrexate').disabled,true);
  const previous=doc.querySelectorAll('.outcome-name').length;choose(selectors()[2],'outcome-itch');await pause();assert.equal(doc.querySelectorAll('.outcome-name').length,previous+1);
  doc.querySelector('[aria-label="Deshacer"]').click();await pause();assert.equal(doc.querySelectorAll('.outcome-name').length,previous);
  const wrong=structuredClone(demo);wrong.catalog_id='diagnosis';wrong.question_type='diagnostic';wrong.comparators=[];
  await upload(doc.querySelector('[data-catalog-file]'),wrong);assert.equal(doc.querySelector('.catalog-context>strong').textContent,'Dermatomiositis: inmunosupresores');
  assert.deepEqual(errors,[]);
 }finally{dom.window.close();}
});
