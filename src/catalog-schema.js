import Ajv from 'ajv';
import schema from '../skills/generate-pico-catalog/references/pico-variable-catalog.schema.json' with {type:'json'};
const check=new Ajv({strict:false,allErrors:true}).compile(schema);
export const CATALOG_COMPARATORS={
 intervencion:['PLACEBO','CUIDADO_HABITUAL','CUALQUIER_COMPARADOR','OTROS_FARMACOLOGICOS','SIMULADA','SIN_COMPARACION'],
 diagnostico:['PATRON_REFERENCIA','DIAGNOSTICO_CLINICO','OTRA_PRUEBA','PRUEBA_HABITUAL','CUALQUIER_COMPARADOR','SIN_COMPARACION_PRUEBAS'],
 pronostico:['AUSENCIA_FACTOR','NIVEL_REFERENCIA','OTRO_FACTOR_MODELO','SEGUIMIENTO_HABITUAL','CUALQUIER_COMPARADOR','SIN_COMPARACION']
};
const validDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
export function validateCatalog(value){
 const errors=[];
 try{
  if(!check(value))return ['CATALOG_STRUCTURE:'+check.errors.map(e=>(e.instancePath||'/')+' '+e.keyword).slice(0,8).join(', ')];
  const ids=new Set(),sources=new Set();
  for(const source of value.sources){
   if(sources.has(source.id))errors.push('CATALOG_DUPLICATE_SOURCE');sources.add(source.id);
   if(!validDate(source.accessed_on))errors.push('CATALOG_DATE');
   if(source.url){try{const u=new URL(source.url);if(!['https:','http:'].includes(u.protocol)||!u.hostname)errors.push('CATALOG_URL');}catch{errors.push('CATALOG_URL');}}
  }
  let count=0;
  const item=x=>{
   count++;if(ids.has(x.id))errors.push('CATALOG_DUPLICATE_ID');ids.add(x.id);
   for(const id of x.source_ids)if(!sources.has(id))errors.push('CATALOG_SOURCE_REFERENCE');
   for(const child of x.children||[])item(child);
  };
  for(const list of [value.interventions,value.comparators,value.outcomes])list.forEach(item);
  if(count>1000||count===0)errors.push('CATALOG_ITEM_COUNT');
  for(const x of value.comparators)if(x.controlled_code&&CATALOG_COMPARATORS[value.question_type]&&!CATALOG_COMPARATORS[value.question_type].includes(x.controlled_code))errors.push('CATALOG_COMPARATOR_TYPE');
  if(value.verification.checked_on!==null&&!validDate(value.verification.checked_on))errors.push('CATALOG_DATE');
  const inspect=x=>{
   if(typeof x==='string'&&/<\/?[a-z][^>]*>/i.test(x))errors.push('CATALOG_MARKUP');
   else if(Array.isArray(x))x.forEach(inspect);
   else if(x&&typeof x==='object')for(const [key,v] of Object.entries(x)){if(['__proto__','constructor','prototype'].includes(key))errors.push('CATALOG_KEY');inspect(v);}
  };
  inspect(value);
 }catch{return ['CATALOG_INVALID'];}
 return [...new Set(errors)];
}
