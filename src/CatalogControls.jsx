import React,{useRef} from 'react';
import {activeCatalog,candidateText,canAddCandidate,validateCatalog} from './catalog.js';
export function CatalogBar({pico,documentId,t,lang,onImport,onUpdate,onError,onQuestion,demo,onDownloadDemo}){
 const input=useRef(null),catalog=activeCatalog(pico),state=pico.catalogo_variables;
 const mismatch=!!catalog&&catalog.question_type!==pico.tipo_pregunta.plantilla;
 async function readFile(event){
  const file=event.target.files?.[0];event.target.value='';if(!file)return;
  const target=documentId;
  if(file.size>2*1024*1024){onError(t('catalogTooLarge'));return;}
  try{const data=JSON.parse(await file.text());const errors=validateCatalog(data);if(errors.length)throw Error(errors.join(', '));onImport(data,target);}
  catch(e){onError(t('catalogInvalid')+' '+e.message);}
 }
 return <section className="catalog-bar" aria-label={t('preloadedVariables')}>
  <div className="catalog-actions">
   <input type="file" accept=".json,application/json" hidden ref={input} onChange={readFile} data-catalog-file="true"/>
   <button type="button" onClick={()=>input.current.click()}>{t('importCatalog')}</button>
   <label className="catalog-switch"><input type="checkbox" role="switch" aria-label={t('showPreloaded')} checked={!!state?.visible} disabled={!catalog} onChange={e=>onUpdate(p=>{p.catalogo_variables.visible=e.target.checked;})}/><span>{t('showPreloaded')}</span></label>
   <button type="button" className="text-button" onClick={()=>onImport(demo,documentId,{fillQuestionIfEmpty:true})}>{t('tryDermatomyositis')}</button>
   <button type="button" className="text-button" onClick={onDownloadDemo}>{t('downloadCatalogExample')}</button>
  </div>
  {catalog&&<div className="catalog-context">
   {state.catalogos.length>1?<label>{t('activeCatalog')}<select className="active-catalog" aria-label={t('activeCatalog')} value={state.activo_id} onChange={e=>onUpdate(p=>{p.catalogo_variables.activo_id=e.target.value;})}>{state.catalogos.map(c=><option key={c.catalog_id} value={c.catalog_id}>{candidateText(c.title,lang)}</option>)}</select></label>:<strong>{candidateText(catalog.title,lang)}</strong>}
   <span className="catalog-status">{t('catalogStatus_'+catalog.verification.status)}</span>
   {mismatch&&<p role="alert" className="inline-warning">{t('catalogTypeMismatch')}</p>}
   <details className="catalog-details"><summary>{t('catalogContextSources')}</summary>
    <p>{candidateText(catalog.clinical_question,lang)}</p>
    <button type="button" className="text-button" onClick={()=>onQuestion(candidateText(catalog.clinical_question,lang))}>{t('useCatalogQuestion')}</button>
    <p>{candidateText(catalog.population_notes,lang)}</p>
    <p>{candidateText(catalog.verification.limitations,lang)}</p>
    <p>{t('catalogSuggestionsOnly')}</p>
    {catalog.verification.checked_on&&<p>{t('catalogReviewedOn')}: {catalog.verification.checked_on}</p>}
    <ul>{catalog.sources.map(source=><li key={source.id}>{source.url?<a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>:source.title}{source.locator&&<span> — {source.locator}</span>}</li>)}</ul>
   </details>
  </div>}
  {!catalog&&<p className="catalog-empty">{t('catalogImportHint')}</p>}
 </section>;
}
export function CatalogPicker({pico,kind,t,lang,onSelect}){
 const catalog=activeCatalog(pico);
 if(!catalog||!pico.catalogo_variables?.visible||catalog.question_type!==pico.tipo_pregunta.plantilla)return null;
 const caption=t({interventions:'pickIntervention',comparators:'pickComparator',outcomes:'pickOutcome'}[kind]);
 return <label className="catalog-picker"><span className="field-label">{caption}</span>
  <select aria-label={caption} value="" onChange={e=>{const id=e.target.value;if(id)onSelect(kind,id);}}>
   <option value="">{t('select')}</option>
   {catalog[kind].map(item=>{
    const option=x=><option key={x.id} value={x.id} disabled={!canAddCandidate(pico,kind,x.id)}>{candidateText(x.label,lang)}{!canAddCandidate(pico,kind,x.id)?' · '+t('catalogAdded'):''}</option>;
    return item.children?.length?<optgroup key={item.id} label={candidateText(item.label,lang)}>
     <option value={item.id} disabled={!canAddCandidate(pico,kind,item.id)}>{t('addWholeFamily')}: {candidateText(item.label,lang)}</option>
     {item.children.map(option)}
    </optgroup>:option(item);
   })}
  </select>
 </label>;
}
