// Marks of a draft built by a skill (import_review): imported from Word or PDF by importar-pico
// (schema 1.1.0; revsis-app ADR 0035 and 0038) or proposed from a question by proponer-pico (schema
// 1.2.0, ADR 0044), and the prompts that ask an assistant for them.
import {plain,label,DESIGN_LABELS,COMP_LABELS,PUB_LABELS} from './model.js';
import {translate} from './i18n.js';

export const PENDING=['REVIEW','NOT_IMPORTED','ASSUMED'];
export const fmt=(text,vars={})=>String(text).replace(/\{(\w+)\}/g,(m,k)=>k in vars?String(vars[k]):m);
const review=d=>d?.import_review||null;
export const isPending=m=>PENDING.includes(m.status);
export const pendingMarks=d=>(review(d)?.marks||[]).filter(isPending);
export const importedMarks=d=>(review(d)?.marks||[]).filter(m=>!isPending(m));
export const unplaced=d=>review(d)?.unplaced||[];
/** The draft was proposed from a question (proponer-pico), not imported from a file. */
export const fromQuestion=d=>review(d)?.source?.file_format==='QUESTION';
/** Translation key of a mark's badge: an empty field of a proposal is "not completed", not "not imported". */
export const markKey=(d,m)=>m.status==='NOT_IMPORTED'&&fromQuestion(d)?'mark_MISSING':'mark_'+m.status;
/** Marks still to review plus text not placed: while above 0, revsis does not accept the document as a version. */
export const pendingCount=d=>pendingMarks(d).length+unplaced(d).length;
/** Pending marks of a field (itemId null) or of one item. */
export const marksFor=(d,field,itemId=null)=>pendingMarks(d).filter(m=>itemId?m.item_id===itemId:m.field===field&&!m.item_id);
/** "Mark as reviewed": the mark goes; the provenance (source) and the imported marks stay. */
export function resolveMark(d,id){if(d.import_review)d.import_review.marks=d.import_review.marks.filter(m=>m.id!==id);}
export function discardFragment(d,id){if(d.import_review)d.import_review.unplaced=d.import_review.unplaced.filter(u=>u.id!==id);}

/** A short label of the item a mark points to (empty if it no longer exists). */
export function itemLabel(p,id,lang='en'){
 const text=node=>plain(node).replace(/\s+/g,' ').trim();
 const free=list=>{for(const x of list||[]){if(x.id===id)return text(x.text)||label(COMP_LABELS,x.code,lang)+' '+text(x.specification);for(const c of x.children||[])if(c.id===id)return text(c.text);}return null;};
 const found=[()=>p.population.subpopulations.find(x=>x.id===id)&&text(p.population.subpopulations.find(x=>x.id===id).text),
  ()=>free(p.interventions),()=>free(p.comparators),
  ()=>{const o=p.outcomes.find(x=>x.id===id);return o?text(o.name):null;},
  ()=>{const s=[...p.study_designs.included,...p.study_designs.excluded].find(x=>x.id===id);return s?label(DESIGN_LABELS,s.code,lang):null;},
  ()=>{const a=p.publication_types.additional.find(x=>x.id===id);return a?label(PUB_LABELS,a.code,lang):null;}];
 for(const f of found){const v=f();if(v!=null)return v.trim().slice(0,80);}
 return null;
}

/** The fixed prompt for the importar-pico skill, with the notes of this import at the end (ADR 0028). */
export function importPrompt(lang='en',notes=''){const t=k=>translate(lang,k);const extra=String(notes||'').trim();return t('importPromptText')+(extra?'\n\n'+t('importPromptNotes')+'\n'+extra:'');}
/** The fixed prompt for the proponer-pico skill (revsis-app ADR 0044): the instructions, then the notes and the
 * question number if given, and the question last, so that what the person typed never comes before the instructions. */
export function proposePrompt(lang='en',question='',notes='',number=''){
 const t=k=>translate(lang,k);const clean=v=>String(v||'').trim();
 const parts=[t('proposePromptText')];
 if(clean(notes))parts.push(t('proposePromptNotes')+'\n'+clean(notes));
 if(clean(number))parts.push(t('proposePromptNumber')+' '+clean(number).toLowerCase());
 parts.push(t('proposePromptQuestion')+'\n'+clean(question));
 return parts.join('\n\n');
}
