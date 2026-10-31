// Deterministic evidence-bound planning. No unverified venues or safety claims.
export function planCandidates({candidates,evidence,petFriendlyProofs,blockedTags=[]}) {
  if(!Array.isArray(candidates)||!Array.isArray(evidence)||!Array.isArray(petFriendlyProofs)) throw new Error('Invalid planning inputs');
  const qloo=new Map(evidence.filter(x=>typeof x?.id==='string'&&typeof x?.name==='string'&&x.source==='qloo').map(x=>[x.id,x]));
  const verified=new Map(petFriendlyProofs.filter(x=>typeof x?.candidateId==='string'&&typeof x?.sourceUrl==='string'&&/^https:\/\//.test(x.sourceUrl)&&x.verified===true).map(x=>[x.candidateId,x]));
  const blocked=new Set(blockedTags.map(x=>String(x).toLowerCase()));
  const accepted=[],rejected=[];
  for(const candidate of candidates){
    if(!candidate||typeof candidate.id!=='string'||typeof candidate.name!=='string'){rejected.push({id:null,reason:'INVALID_CANDIDATE'});continue;}
    const reason=!qloo.has(candidate.id)?'NO_QLOO_EVIDENCE':!verified.has(candidate.id)?'NO_INDEPENDENT_PET_POLICY_PROOF':(candidate.tags||[]).some(t=>blocked.has(String(t).toLowerCase()))?'CONSTRAINT_CONFLICT':null;
    if(reason){rejected.push({id:candidate.id,reason});continue;}
    accepted.push({id:candidate.id,name:candidate.name,culturalEvidence:qloo.get(candidate.id),petPolicyProof:verified.get(candidate.id),requiresOwnerApproval:true});
  }
  return {status:accepted.length?'PROPOSED_NOT_APPROVED':'NO_VERIFIED_RECOMMENDATIONS',accepted,rejected};
}
export function compareAblation(input){
 const withQloo=planCandidates(input);
 const withoutQloo=planCandidates({...input,evidence:[]});
 return {withQloo,withoutQloo,deltaVerifiedRecommendations:withQloo.accepted.length-withoutQloo.accepted.length,disclaimer:'Offline fixture comparison; not evidence of a live Qloo API call or recommendation quality.'};
}
