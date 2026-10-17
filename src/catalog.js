import {copy,uid,rich,freeItem,comparator,outcome} from './model.js';
import {validateCatalog} from './catalog-schema.js';
export {validateCatalog};
const keys={interventions:'intervenciones',comparators:'comparadores',outcomes:'outcomes'};
export const activeCatalog=p=>p.catalogo_variables?.catalogos?.find(x=>x.catalog_id===p.catalogo_variables.activo_id)||null;
export const candidateText=(value,lang)=>value?.[lang]??'';
export function importCatalog(p,catalog){
 const errors=validateCatalog(catalog);if(errors.length)throw Error(errors.join(', '));
 const state=p.catalogo_variables||{catalogos:[],activo_id:null,visible:false};
 const index=state.catalogos.findIndex(x=>x.catalog_id===catalog.catalog_id);
 if(index<0){if(state.catalogos.length>=20)throw Error('CATALOG_LIMIT');state.catalogos.push(copy(catalog));}
 else state.catalogos[index]=copy(catalog);
 state.activo_id=catalog.catalog_id;state.visible=true;p.catalogo_variables=state;
}
function findCandidate(catalog,kind,id){
 for(const parent of catalog[kind]||[]){
  if(parent.id===id)return {parent,item:parent,child:false};
  const item=parent.children?.find(x=>x.id===id);if(item)return {parent,item,child:true};
 }
 return null;
}
function same(item,catalog,id){return item.catalogo_origen?.catalog_id===catalog.catalog_id&&item.catalogo_origen.variable_id===id;}
function allItems(list){return list.flatMap(x=>[x,...(x.hijos||[])]);}
export function canAddCandidate(p,kind,id){
 const catalog=activeCatalog(p),key=keys[kind];
 if(!catalog||!key||catalog.question_type!==p.tipo_pregunta.plantilla)return false;
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
  const item=outcome();item.nombre=rich(candidateText(found.item.label,lang));item.descripcion=rich(candidateText(found.item.description,lang));item.catalogo_origen=provenance(catalog,found.item);p.outcomes.push(item);return true;
 }
 let parent=p[key].find(x=>same(x,catalog,found.parent.id));
 if(!parent){
  if(kind==='comparators'){
   parent=comparator(found.parent.controlled_code?'CONTROLADO':'LIBRE',found.parent.controlled_code||'');
   if(parent.modo==='CONTROLADO')parent.especificacion=rich(candidateText(found.parent.description,lang));
   else parent.texto=content(found.parent,lang);
  }else{parent=freeItem();parent.texto=content(found.parent,lang);}
  parent.catalogo_origen=provenance(catalog,found.parent);p[key].push(parent);
 }
 const children=found.child?[found.item]:(found.parent.children||[]);
 for(const source of children){
  if(allItems(p[key]).some(x=>same(x,catalog,source.id)))continue;
  const child=freeItem();child.texto=content(source,lang);child.catalogo_origen=provenance(catalog,source);parent.hijos.push(child);
 }
 return true;
}
export function upgradeDocument(value){
 const d=copy(value);d.schema_version='0.2.0';if(d.pico.catalogo_variables===undefined)d.pico.catalogo_variables=null;return d;
}
