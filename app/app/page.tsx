'use client';
import {useState} from 'react';
type Candidate={id:string;name:string;category:string;petPolicy:string;actionable:boolean};
function categoryLabel(category:string){
 if(!category || category==='urn:entity' || category==='urn:entity:place' || category==='unknown')return 'Cultural place';
 if(category.startsWith('urn:entity:'))return category.slice('urn:entity:'.length).replace(/[-_]/g,' ');
 return category;
}
type Result={status?:string;message?:string;notice?:string;error?:string;candidates?:Candidate[];ablation?:{qlooOn:{culturalCandidates:number};qlooOff:{culturalCandidates:number};note:string}};
export default function Home(){
 const [taste,setTaste]=useState('jazz music');
 const [constraints,setConstraints]=useState('small dog; avoid crowded spaces');
 const [result,setResult]=useState<Result|null>(null);
 const [busy,setBusy]=useState(false);
 async function run(){
   setBusy(true);setResult(null);
   try{
     const response=await fetch('/api/recommend',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({taste,constraints}),cache:'no-store'});
     const data:Result=await response.json();setResult(data);
   }catch{setResult({status:'NETWORK_ERROR',message:'Could not contact the application server.'})}
   finally{setBusy(false)}
 }
 return <main style={{maxWidth:850,margin:'40px auto',padding:24,fontFamily:'system-ui, sans-serif',lineHeight:1.6}}>
  <p style={{letterSpacing:2,color:'#437d65'}}>CARLi × QLOO</p>
  <h1>Cultural Discovery for People &amp; Pets</h1>
  <p>Discover places matching your cultural interests. Qloo is used for cultural discovery, not pet-entry approval.</p>
  <p><a href="/journey" style={{display:'inline-block',padding:'10px 15px',background:'#e1f3e6',color:'#21513f',borderRadius:10,fontWeight:600}}>Start the 7-Day Lifestyle Journey →</a></p>
  <p style={{background:'#eef5ef',padding:'10px 14px',borderRadius:9,color:'#285b45'}}>How it works: enter an interest, explore Qloo cultural matches, then independently verify each venue's pet policy before planning a visit.</p>
  <label>What do you enjoy?<textarea value={taste} onChange={e=>setTaste(e.target.value)} style={{display:'block',width:'100%',minHeight:70,marginBottom:16}}/></label>
  <label>Pet and outing constraints<textarea value={constraints} onChange={e=>setConstraints(e.target.value)} style={{display:'block',width:'100%',minHeight:70,marginBottom:16}}/></label>
  <button type="button" onClick={run} disabled={busy||!taste.trim()} style={{padding:'12px 22px',background:'#285b45',color:'white',border:0,borderRadius:8,cursor:'pointer',fontWeight:600}}>{busy?'Searching Qloo…':'Explore cultural matches'}</button>
  {result&&<section aria-live="polite" style={{marginTop:24}}>
   <h2>{result.status==='CULTURAL_CANDIDATES_UNVERIFIED'?'Cultural matches — pet policies unverified':result.status||'Result'}</h2>
   {(result.error||result.message)&&<p role="alert">{result.error||result.message}</p>}
   {(result.candidates||[]).map(item=><article key={item.id} style={{border:'1px solid #ccd5d0',padding:16,marginBottom:12,borderRadius:10}}>
     <strong>{item.name}</strong><p>Category: {categoryLabel(item.category)} · Cultural source: Qloo</p>
     <p>Pet policy: <strong>{item.petPolicy}</strong> · No pet-entry approval has been verified</p>
   </article>)}
   {result.ablation&&<details style={{marginTop:14}}><summary>How Qloo changes the discovery results</summary><p>Qloo ON: {result.ablation.qlooOn.culturalCandidates} cultural candidates; Qloo OFF: {result.ablation.qlooOff.culturalCandidates}. {result.ablation.note}</p></details>}
   <p><small>{result.notice||'No pet-safety approval is implied.'}</small></p>
  </section>}
 </main>;
}
