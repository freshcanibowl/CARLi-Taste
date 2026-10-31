export type RequestData = {taste:string;constraints:string};
export function validateRequest(value:unknown): {ok:true;value:RequestData}|{ok:false;error:string};
export type Evidence = {id:string;name:string;source:'qloo';category:string};
export function normalizeEvidence(items:unknown):Evidence[];
export function rankWithEvidence<T extends {id:string}>(candidates:T[],evidence:Evidence[],verifiedPetFriendlyIds:string[]):(T&{petFriendlyVerified:true;evidenceId:string})[];
