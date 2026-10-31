'use client';
import {useState} from 'react';
type Candidate={id:string;name:string;category:string;petPolicy:string;actionable:boolean};
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
  <h1>Cultural Discovery for People & Pets</h1>
  <p>Discover culture together. Pet-friendly venue claims require separate verification.</p>
  <label>What do you enjoy?<textarea value={taste} onChange={e=>setTaste(e.target.value)} style={{display:'block',width:'100%',minHeight:70,marginBottom:16}}/></label>
  <label>Pet and outing constraints<textarea value={constraints} onChange={e=>setConstraints(e.target.value)} style={{display:'block',width:'100%',minHeight:70,marginBottom:16}}/></label>
  <button onClick={run} disabled={busy||!taste.trim()} style={{padding:'12px 22px',cursor:'pointer'}}>{busy?'Searching Qloo…':'Explore cultural matches'}</button>
  {result&&<section aria-live="polite" style={{marginTop:24}}>
   <h2>{result.status||'Result'}</h2>
   {(result.error||result.message)&&<p role="alert">{result.error||result.message}</p>}
   {(result.candidates||[]).map(item=><article key={item.id} style={{border:'1px solid #ccd5d0',padding:16,marginBottom:12,borderRadius:10}}>
     <strong>{item.name}</strong><p>Category: {item.category} · Cultural source: Qloo</p>
     <p>Pet policy: <strong>{item.petPolicy}</strong> · Not approved for pet visit</p>
   </article>)}
   {result.ablation&&<p>Qloo ON cultural candidates: {result.ablation.qlooOn.culturalCandidates}; OFF: {result.ablation.qlooOff.culturalCandidates}. {result.ablation.note}</p>}
   <p><small>{result.notice||'No pet-safety approval is implied.'}</small></p>
  </section>}
 </main>;
}
