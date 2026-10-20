// The compiled library in lib/ as a host such as revsis-app uses it (revsis-app ADR 0036).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';
const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const pkg=JSON.parse(read('package.json'));
const imports=path=>[...read(path).matchAll(/^import[^;]*?from\s*"([^"]+)"/gm)].map(m=>m[1]);

test('Package entry points exist; the editor entry does not load the Word and PDF libraries',()=>{
 for(const [name,target] of Object.entries(pkg.exports)){for(const file of typeof target==='string'?[target]:Object.values(target))assert(fs.existsSync(new URL('../'+file,import.meta.url)),name+' → '+file);}
 assert.deepEqual(Object.keys(pkg.peerDependencies),['react','react-dom']);assert(!('react' in pkg.dependencies));assert('ajv' in pkg.dependencies);
 const editor=[...imports('lib/editor.js'),...fs.readdirSync(new URL('../lib/chunks/',import.meta.url)).flatMap(f=>imports('lib/chunks/'+f))];
 assert(!editor.some(x=>x==='docx'||x.startsWith('pdfmake')),editor.join(', '));
 assert(imports('lib/exports.js').includes('docx'));
 const external=[...Object.keys(pkg.dependencies),...Object.keys(pkg.peerDependencies)];
 for(const x of [...editor,...imports('lib/exports.js')])assert(x.startsWith('./')||external.some(d=>x===d||x.startsWith(d+'/')),'undeclared import '+x);
});

test('Every style rule of the library is scoped under .pico-root',()=>{
 const css=read('lib/pico-editor.css').replace(/\/\*[\s\S]*?\*\//g,'');
 const selectors=[...css.matchAll(/(?:^|[{}])\s*([^{}@]+)\{/g)].map(m=>m[1].trim()).filter(s=>!/^(from|to|\d+%)$/.test(s));
 assert(selectors.length>300);
 for(const list of selectors)for(const s of list.split(/,(?![^(]*\))/))assert(/^(\.pico-root|:where\(\.pico-root\))/.test(s.trim()),s);
 assert(!/(^|[{}\s,])(body|html|:root)\s*[{,]/.test(css));
});

test('PicoEditor reports whole documents, keeps undo inside and adopts another document',async()=>{
 const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'https://host.local/',pretendToBeVisual:true});
 const w=dom.window;
 for(const k of ['window','document','Node','Element','HTMLElement','HTMLInputElement','HTMLSelectElement','Text','DocumentFragment','MutationObserver','getComputedStyle','requestAnimationFrame','cancelAnimationFrame','DOMParser','Range','Selection','getSelection','Event','KeyboardEvent','MouseEvent','FocusEvent','InputEvent','CustomEvent','ClipboardEvent','DragEvent']){Object.defineProperty(globalThis,k,{configurable:true,writable:true,value:k==='window'?w:typeof w[k]==='function'&&/^[a-z]/.test(k)?w[k].bind(w):w[k]});}
 w.scrollTo=()=>{};w.Range.prototype.getBoundingClientRect=()=>({top:0,bottom:0,left:0,right:0,width:0,height:0});w.Range.prototype.getClientRects=()=>[];w.HTMLElement.prototype.scrollIntoView=()=>{};
 const pause=()=>new Promise(r=>setTimeout(r,120));
 try{
  const React=(await import('react')).default;const {createRoot}=await import('react-dom/client');
  const {PicoEditor,newDocument,validateDocument,importPrompt,proposePrompt,pendingCount}=await import('../lib/editor.js');
  assert(importPrompt('es','Sólo la 2').includes('importar-pico'));assert(proposePrompt('es','¿P?').endsWith('Pregunta:\n¿P?'));assert.equal(pendingCount(newDocument()),0);
  const first=newDocument('intervention');first.pico.number='1';const second=newDocument('diagnostic');second.pico.number='2';
  const changes=[];const handle={current:null};let setDocument;
  function Host(){const [doc,setDoc]=React.useState(first);setDocument=setDoc;return React.createElement(PicoEditor,{document:doc,onChange:d=>{changes.push(d);setDoc(d);},lang:'es',theme:'dark',ref:handle,header:React.createElement('p',{id:'host-header'},'Cabecera')});}
  const root=createRoot(w.document.getElementById('root'));root.render(React.createElement(Host));await pause();
  const editorRoot=w.document.querySelector('.pico-root.pico-editor');assert(editorRoot);assert.equal(editorRoot.dataset.theme,'dark');assert.equal(editorRoot.getAttribute('lang'),'es');
  assert(w.document.getElementById('host-header'));assert(w.document.querySelector('.language-section'));assert.equal(w.document.documentElement.dataset.theme,undefined);
  const number=w.document.querySelector('.question-number input');Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set.call(number,'3A');number.dispatchEvent(new w.Event('input',{bubbles:true}));await pause();
  assert.equal(changes.at(-1).pico.number,'3a');assert.equal(changes.at(-1).document_id,first.document_id);assert.deepEqual(validateDocument(changes.at(-1)),[]);
  handle.current.undo();await pause();assert.equal(changes.at(-1).pico.number,'1');assert.equal(number.value,'1');
  handle.current.redo();await pause();assert.equal(changes.at(-1).pico.number,'3a');
  const count=changes.length;setDocument(second);await pause();assert.equal(changes.length,count);
  assert.equal(w.document.querySelector('.question-number input').value,'2');assert.equal(w.document.querySelector('.question-type select').value,'diagnostic');
  root.unmount();await pause();
 }finally{/* node --test runs each file in its own process: the DOM globals stay until it exits, so late editor timers find them. */}
});
