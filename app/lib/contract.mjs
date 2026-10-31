export const MAX_INPUT = 500;
export function validateRequest(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {ok:false,error:'Body must be an object'};
  const {taste,constraints} = value;
  if(typeof taste!=='string'||!taste.trim()||taste.length>MAX_INPUT) return {ok:false,error:'taste must be 1–500 characters'};
  if(typeof constraints!=='string'||constraints.length>MAX_INPUT) return {ok:false,error:'constraints must be 0–500 characters'};
  return {ok:true,value:{taste:taste.trim(),constraints:constraints.trim()}};
}
export function normalizeEvidence(items) {
  if (!Array.isArray(items)) throw new Error('Qloo results must be an array');
  return items.map((item)=>{
    if(!item||typeof item!=='object'||typeof item.id!=='string'||typeof item.name!=='string'||!item.id||!item.name) throw new Error('Invalid evidence item');
    return {id:item.id,name:item.name,source:'qloo',category:typeof item.category==='string'?item.category:'unknown'};
  });
}
export function rankWithEvidence(candidates,evidence,verifiedPetFriendlyIds=[]) {
  const allowed=new Set(verifiedPetFriendlyIds);
  const ids=new Set(evidence.map(x=>x.id));
  return candidates.filter(c=>allowed.has(c.id)&&ids.has(c.id)).map(c=>({...c,petFriendlyVerified:true,evidenceId:c.id}));
}
