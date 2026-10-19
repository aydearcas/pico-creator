// Import marks in the editor (revsis-app ADR 0038): a badge beside each marked field or item, and a
// panel with every pending mark, the text not placed and the imported marks. No bulk "mark all".
import React,{useState,useEffect,useRef} from 'react';
import {Check,Copy,Crosshair,FileInput,Trash2} from 'lucide-react';
import {useApp} from './ui.jsx';
import {fmt,pendingMarks,importedMarks,unplaced,pendingCount,itemLabel} from './review.js';

function MarkDetail({mark,t}){return <>{mark.reason&&<span className="mark-reason">{mark.reason}</span>}{mark.quote&&<q className="mark-quote">{mark.quote}</q>}{mark.page!=null&&<span className="mark-page">{fmt(t('markPage'),{n:mark.page})}</span>}</>;}

/** Badges of the pending marks of one field or item; a click shows the reason, quote and page. */
export function MarkBadges({marks,onResolve}){
 const {t}=useApp();const [open,setOpen]=useState(null);const ref=useRef(null);
 useEffect(()=>{if(!open)return;const close=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(null);};const esc=e=>{if(e.key==='Escape')setOpen(null);};document.addEventListener('mousedown',close);document.addEventListener('keydown',esc);return()=>{document.removeEventListener('mousedown',close);document.removeEventListener('keydown',esc);};},[open]);
 if(!marks.length)return null;
 return <span className="mark-badges" ref={ref}>{marks.map(m=><span key={m.id} className="mark-anchor"><button type="button" className={'mark-badge mark-'+m.status} aria-expanded={open===m.id} onClick={e=>{e.preventDefault();e.stopPropagation();setOpen(open===m.id?null:m.id);}}>{t('mark_'+m.status)}</button>{open===m.id&&<span className="mark-popover" role="dialog" aria-label={t('mark_'+m.status)}><MarkDetail mark={m} t={t}/><button type="button" className="small primary" onClick={e=>{e.preventDefault();e.stopPropagation();setOpen(null);onResolve(m.id);}}><Check size={13}/>{t('markReviewed')}</button></span>}</span>)}</span>;
}

/** The import review panel at the top of the document. */
export function ImportReviewPanel({doc,fieldLabels,onResolve,onDiscard,onGo}){
 const {t,lang}=useApp();const [copied,setCopied]=useState(null);
 const review=doc.import_review;if(!review)return null;
 const pending=pendingMarks(doc),done=importedMarks(doc),fragments=unplaced(doc),count=pendingCount(doc);
 const src=review.source;const date=new Date(src.imported_at);
 const target=m=>{const name=fieldLabels[m.field]||m.field;if(!m.item_id)return name;const item=itemLabel(doc.pico,m.item_id,lang);return name+' · '+(item==null?t('itemRemoved'):item||'—');};
 const copy=async u=>{try{await navigator.clipboard.writeText(u.text);setCopied(u.id);setTimeout(()=>setCopied(null),1500);}catch{setCopied(null);}};
 return <section className={'import-review'+(count?'':' import-review-done')} aria-label={t('reviewTitle')}>
  <div className="import-review-head"><FileInput size={17}/><h2>{t('reviewTitle')}</h2><span className="import-review-count">{count?fmt(t('reviewPending'),{n:count}):t('reviewDone')}</span></div>
  <p className="section-tip">{fmt(t('reviewFrom'),{file:src.file_name,date:Number.isFinite(date.getTime())?date.toLocaleDateString(lang==='es'?'es-ES':'en-GB'):src.imported_at,skill:src.skill,version:src.skill_version})} {count>0&&t('reviewHelp')}</p>
  {pending.length>0&&<ul className="import-review-list">{pending.map(m=><li key={m.id}><span className={'mark-badge mark-'+m.status}>{t('mark_'+m.status)}</span><span className="mark-target">{target(m)}</span><MarkDetail mark={m} t={t}/><span className="mark-actions"><button type="button" className="text-button" onClick={()=>onGo(m)}><Crosshair size={13}/>{t('goToField')}</button><button type="button" className="text-button" onClick={()=>onResolve(m.id)}><Check size={13}/>{t('markReviewed')}</button></span></li>)}</ul>}
  {fragments.length>0&&<><h3>{fmt(t('unplacedTitle'),{n:fragments.length})}</h3><ul className="import-review-list">{fragments.map(u=><li key={u.id}><span className="mark-fragment">{u.text}</span>{u.page!=null&&<span className="mark-page">{fmt(t('markPage'),{n:u.page})}</span>}<span className="mark-actions"><button type="button" className="text-button" onClick={()=>copy(u)}><Copy size={13}/>{t(copied===u.id?'copied':'copyText')}</button><button type="button" className="text-button" onClick={()=>onDiscard(u.id)}><Trash2 size={13}/>{t('discardFragment')}</button></span></li>)}</ul></>}
  {done.length>0&&<details className="import-review-imported"><summary>{fmt(t('importedMarks'),{n:done.length})}</summary><ul className="import-review-list">{done.map(m=><li key={m.id}><span className={'mark-badge mark-'+m.status}>{t('mark_'+m.status)}</span><span className="mark-target">{target(m)}</span><MarkDetail mark={m} t={t}/></li>)}</ul></details>}
 </section>;
}
