import {copy,uid,rich,freeItem,comparator,outcome} from './model.js';
import {validateCatalog} from './catalog-schema.js';
import {migrateCatalog} from './migrate.js';
export {validateCatalog};
const keys={interventions:'interventions',comparators:'comparators',outcomes:'outcomes'};
export const activeCatalog=p=>p.variable_catalogs?.catalogs?.find(x=>x.catalog_id===p.variable_catalogs.active_id)||null;
export const candidateText=(value,lang)=>value?.[lang]??'';
export function importCatalog(p,catalog){
 catalog=migrateCatalog(catalog);
 const errors=validateCatalog(catalog);if(errors.length)throw Error(errors.join(', '));
 const state=p.variable_catalogs||{catalogs:[],active_id:null,visible:false};
 const index=state.catalogs.findIndex(x=>x.catalog_id===catalog.catalog_id);
 if(index<0){if(state.catalogs.length>=20)throw Error('CATALOG_LIMIT');state.catalogs.push(copy(catalog));}
 else state.catalogs[index]=copy(catalog);
 state.active_id=catalog.catalog_id;state.visible=true;p.variable_catalogs=state;
}
function findCandidate(catalog,kind,id){
 for(const parent of catalog[kind]||[]){
  if(parent.id===id)return {parent,item:parent,child:false};
  const item=parent.children?.find(x=>x.id===id);if(item)return {parent,item,child:true};
 }
 return null;
}
function same(item,catalog,id){return item.catalog_origin?.catalog_id===catalog.catalog_id&&item.catalog_origin.variable_id===id;}
function allItems(list){return list.flatMap(x=>[x,...(x.children||[])]);}
export function canAddCandidate(p,kind,id){
 const catalog=activeCatalog(p),key=keys[kind];
 if(!catalog||!key||catalog.question_type!==p.question_type.template)return false;
 const found=findCandidate(catalog,kind,id);if(!found)return false;
 const list=allItems(p[key]);
 const exists=x=>list.some(y=>same(y,catalog,x.id));
 if(found.child||!found.item.children?.length)return !exists(found.item);
 return !exists(found.item)||found.item.children.some(x=>!exists(x));
}
const provenance=(catalog,item)=>({catalog_id:catalog.catalog_id,variable_id:item.id});
const content=(item,lang)=>rich(candidateText(item.label,lang)+(candidateText(item.description,lang)?' — '+candidateText(item.description,lang):''));
export function addCatalogVariable(p,kind,id,lang='en'){
 if(!canAddCandidate(p,kind,id))return false;
 const catalog=activeCatalog(p),key=keys[kind],found=findCandidate(catalog,kind,id);
 if(kind==='outcomes'){
  const item=outcome();item.name=rich(candidateText(found.item.label,lang));item.description=rich(candidateText(found.item.description,lang));item.catalog_origin=provenance(catalog,found.item);p.outcomes.push(item);return true;
 }
 let parent=p[key].find(x=>same(x,catalog,found.parent.id));
 if(!parent){
  if(kind==='comparators'){
   parent=comparator(found.parent.controlled_code?'CONTROLLED':'FREE',found.parent.controlled_code||'');
   if(parent.mode==='CONTROLLED')parent.specification=rich(candidateText(found.parent.description,lang));
   else parent.text=content(found.parent,lang);
  }else{parent=freeItem();parent.text=content(found.parent,lang);}
  parent.catalog_origin=provenance(catalog,found.parent);p[key].push(parent);
 }
 const children=found.child?[found.item]:(found.parent.children||[]);
 for(const source of children){
  if(allItems(p[key]).some(x=>same(x,catalog,source.id)))continue;
  const child=freeItem();child.text=content(source,lang);child.catalog_origin=provenance(catalog,source);parent.children.push(child);
 }
 return true;
}
