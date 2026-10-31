import {NextResponse} from 'next/server';
import {validateRequest} from '../../../lib/contract.mjs';
import {discoverCulture} from '../../../lib/qloo.mjs';
import {buildDiscoveryView} from '../../../lib/discovery.mjs';
export const runtime='nodejs';
export async function POST(req:Request){
  if(Number(req.headers.get('content-length')||0)>4096)return NextResponse.json({error:'Request too large'},{status:413});
  let body:unknown;
  try{body=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
  const validated=validateRequest(body);
  if(!validated.ok)return NextResponse.json({error:validated.error},{status:400});
  if(!process.env.QLOO_API_KEY)return NextResponse.json({status:'QLOO_KEY_MISSING',message:'Configure server-only QLOO_API_KEY.',recommendations:[]},{status:503,headers:{'Cache-Control':'no-store'}});
  try{
    const result=await discoverCulture({interest:validated.value.taste,location:'Kuala Lumpur'});
    return NextResponse.json({...buildDiscoveryView(result),seeds:result.seeds||[],petConstraints:validated.value.constraints,liveSource:'qloo-api'},{headers:{'Cache-Control':'no-store'}});
  }catch(e){
    const code=e instanceof Error?e.message:'UNKNOWN';
    return NextResponse.json({status:'QLOO_UNAVAILABLE',error:code,recommendations:[]},{status:502,headers:{'Cache-Control':'no-store'}});
  }
}
