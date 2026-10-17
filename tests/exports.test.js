import test from 'node:test';
import assert from 'node:assert/strict';
import {exampleDocument} from '../src/example.js';
import {rich,outcome,uid,plain} from '../src/model.js';
import {richHtml,toMarkdown,toWord,toPdf,pdfDefinition,previewHtml} from '../src/exports.js';
test('Markdown preserves criteria, n, notes and publication section',()=>{const s=toMarkdown(exampleDocument(),'es');assert(s.includes('| Población |'));assert(s.includes('n ≥ 10'));assert(s.indexOf('## Tipos de publicación')>s.indexOf('## Tipos de estudio'));assert(s.includes('IMACS'));});
test('Markdown portable and HTML modes differ only in visual marks',()=>{const d=exampleDocument();const node=d.pico.population.text.content[0].content[0];node.marks=[{type:'highlight',attrs:{color:'#ffee99'}},{type:'textStyle',attrs:{color:'#123456'}},{type:'strike'}];const clean=toMarkdown(d,'en');const styled=toMarkdown(d,'en',{styles:'html'});assert(!clean.includes('<mark'));assert(styled.includes('<mark'));assert(styled.includes('#123456'));assert(clean.includes('~~'));});
test('HTML preview escapes user text and keeps rich styles',()=>{const html=richHtml(rich('<script>alert(1)</script>'));assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert(previewHtml(exampleDocument(),'es').includes('Tipos de publicación'));});
test('DOCX and PDF produce real binary document signatures',async()=>{const d=exampleDocument();const word=await toWord(d,'es');const w=new Uint8Array(await word.arrayBuffer());assert.equal(w[0],0x50);assert.equal(w[1],0x4b);const pdf=await toPdf(d,'es');const p=new Uint8Array(await pdf.arrayBuffer());assert.equal(new TextDecoder().decode(p.slice(0,5)),'%PDF-');});
test('Long outcome descriptions remain complete in PDF definition and Markdown',()=>{const d=exampleDocument();const o=outcome();o.name=rich('Long outcome');o.description=rich(('Contenido clínico ≥ 20, MMT-8. ').repeat(500)+'END-SENTINEL');d.pico.outcomes.push(o);assert(toMarkdown(d,'en',{layout:'sections'}).includes('END-SENTINEL'));assert(JSON.stringify(pdfDefinition(d,'en')).includes('END-SENTINEL'));});
test('Parent categories are bold and subcategories regular in exported presentation',async()=>{
 const {presentation}=await import('../src/exports.js');const d=exampleDocument();const v=presentation(d,'es');
 assert(v.columns[1].items.filter(x=>x.level===0).every(x=>x.strong));
 assert(v.columns[1].items.some(x=>x.level===1));
 assert(v.columns[1].items.filter(x=>x.level===1).every(x=>!x.strong));
 const md=toMarkdown(d,'es',{layout:'sections'});assert(md.includes('**Biológicos y sintéticos dirigidos**'));
 const definition=pdfDefinition(d,'es',{layout:'sections'});
 assert(definition.content.some(x=>x.bold&&JSON.stringify(x.text||'').includes('Biológicos y sintéticos dirigidos')));
});
