'use client';
import {useEffect,useState} from 'react';
import {MEMORY_KEY,JOURNEY_KEY,rankLocal,safeFeedback} from '../lib/taste-memory.mjs';
import {appendEvent,EVENT_KEY} from '../lib/profile-evidence.mjs';
type Candidate={id:string;name:string;category:string;petPolicy:string;actionable:boolean;localScore?:number;localReasons?:string[];originalQlooPosition?:number};
type Feedback=Record<string,'liked'|'disliked'>;
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
 const [adaptive,setAdaptive]=useState(false);
 const [feedback,setFeedback]=useState<Feedback>({});
 const [journey,setJourney]=useState<unknown[]>([]);
 const [loaded,setLoaded]=useState(false);
 const [expanded,setExpanded]=useState<Record<string,boolean>>({});
 const record=(type:string,id?:string)=>{
  try{const raw=JSON.parse(localStorage.getItem(EVENT_KEY)||'[]');localStorage.setItem(EVENT_KEY,JSON.stringify(appendEvent(raw,type,Date.now(),id)))}catch{}
 };
 const detail=(id:string)=>{setExpanded(prev=>({...prev,[id]:!prev[id]}));if(!expanded[id])record('candidate_opened',id)};

 useEffect(()=>{
  try{
   setAdaptive(localStorage.getItem('carli-taste-adaptive-opt-in')==='true');
   const f=localStorage.getItem(MEMORY_KEY);if(f)setFeedback(safeFeedback(JSON.parse(f)));
   const j=localStorage.getItem(JOURNEY_KEY);if(j){const parsed:unknown=JSON.parse(j);if(Array.isArray(parsed))setJourney(parsed);}
  }catch{}setLoaded(true);
 },[]);
 useEffect(()=>{if(loaded)try{localStorage.setItem(MEMORY_KEY,JSON.stringify(feedback));localStorage.setItem('carli-taste-adaptive-opt-in',String(adaptive));}catch{}},[feedback,adaptive,loaded]);
 const localCandidates=result?.candidates?adaptive?rankLocal(result.candidates,{feedback,journey}):result.candidates:[];
 const rate=(id:string,value:'liked'|'disliked')=>{setFeedback(prev=>({...prev,[id]:prev[id]===value?undefined:value} as Feedback));record('candidate_feedback',id)};
 const erase=()=>{if(!window.confirm('Delete stored CARLi Taste likes/dislikes and turn off adaptive ranking? Journey activity notes are managed separately on the Journey page.'))return;setFeedback({});setAdaptive(false);try{localStorage.removeItem(MEMORY_KEY);localStorage.removeItem('carli-taste-adaptive-opt-in')}catch{}};

 async function run(){
   setBusy(true);setResult(null);
   try{const j=localStorage.getItem(JOURNEY_KEY);if(j){const parsed:unknown=JSON.parse(j);if(Array.isArray(parsed))setJourney(parsed);}}catch{}

   try{
     const response=await fetch('/api/recommend',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({taste,constraints}),cache:'no-store'});
     const data:Result=await response.json();setResult(data);if(response.ok&&Array.isArray(data.candidates))record('discovery_completed');
   }catch{setResult({status:'NETWORK_ERROR',message:'Could not contact the application server.'})}
   finally{setBusy(false)}
 }
 return <main style={{maxWidth:850,margin:'40px auto',padding:24,fontFamily:'system-ui, sans-serif',lineHeight:1.6}}>
  <p style={{letterSpacing:2,color:'#437d65'}}>CARLi × QLOO</p>
  <h1>Cultural Discovery for People &amp; Pets</h1>
  <p>Discover places matching your cultural interests. Qloo is used for cultural discovery, not pet-entry approval.</p>
  <p><a href="/profile" style={{marginRight:14}}>My Taste Profile &amp; Evidence</a><a href="/journey" style={{display:'inline-block',padding:'10px 15px',background:'#e1f3e6',color:'#21513f',borderRadius:10,fontWeight:600}}>Start the 7-Day Lifestyle Journey →</a></p>
  <p style={{background:'#eef5ef',padding:'10px 14px',borderRadius:9,color:'#285b45'}}>How it works: enter an interest, explore Qloo cultural matches, then independently verify each venue's pet policy before planning a visit.</p>
  <label>What do you enjoy?<textarea value={taste} onChange={e=>setTaste(e.target.value)} style={{display:'block',width:'100%',minHeight:70,marginBottom:16}}/></label>
  <label>Pet and outing constraints<textarea value={constraints} onChange={e=>setConstraints(e.target.value)} style={{display:'block',width:'100%',minHeight:70,marginBottom:16}}/></label>
  <section aria-label="Adaptive taste settings" style={{border:'1px solid #c8d9ce',padding:14,borderRadius:12,marginBottom:18}}>
   <label style={{display:'block',fontWeight:600}}><input type="checkbox" checked={adaptive} onChange={e=>setAdaptive(e.target.checked)}/> Use my local Journey ratings and venue feedback to reorder results</label>
   <p style={{fontSize:13,margin:'8px 0'}}>Optional and off by default. Qloo still returns the original cultural candidates. Only this browser reorders them using simple keyword matching and your explicit ratings. Personal notes and feedback are never sent to Qloo or the server. This is not an AI recommendation quality claim.</p>
   {adaptive&&<><p style={{fontSize:13,margin:'8px 0'}}>Positive activity ratings can promote matching music, outdoor, dining, social or novelty venues. Your venue likes/dislikes carry more weight. Unrecognized names keep their Qloo position.</p><button type="button" onClick={erase} style={{padding:'6px 10px'}}>Delete local taste feedback</button></>}
  </section>
  <button type="button" onClick={run} disabled={busy||!taste.trim()} style={{padding:'12px 22px',background:'#285b45',color:'white',border:0,borderRadius:8,cursor:'pointer',fontWeight:600}}>{busy?'Searching Qloo…':'Explore cultural matches'}</button>
  {result&&<section aria-live="polite" style={{marginTop:24}}>
   <h2>{result.status==='CULTURAL_CANDIDATES_UNVERIFIED'?'Cultural matches — pet policies unverified':result.status||'Result'}</h2>
   {(result.error||result.message)&&<p role="alert">{result.error||result.message}</p>}
   {localCandidates.map(item=><article key={item.id} style={{border:'1px solid #ccd5d0',padding:16,marginBottom:12,borderRadius:10}}>
     <strong>{item.name}</strong><p>Category: {categoryLabel(item.category)} · Cultural source: Qloo</p>
     <p>Pet policy: <strong>{item.petPolicy}</strong> · No pet-entry approval has been verified</p>
     <button type="button" onClick={()=>detail(item.id)} aria-expanded={!!expanded[item.id]}>{expanded[item.id]?'Hide evidence details':'View candidate evidence'}</button>
     {expanded[item.id]&&<p style={{background:'#f0f5f1',padding:10,borderRadius:8,fontSize:13}}>Source: Qloo cultural discovery. Candidate ID: {item.id}. The listed category is not proof of a venue's pet policy, operating hours, accessibility or availability. This action is recorded only in this browser.</p>}
     {adaptive&&<div><small>Qloo source position: {item.originalQlooPosition} · Local adjustment: {item.localScore||0}</small>
      <p style={{fontSize:13}}>{item.localReasons?.length?item.localReasons.join('; '):'No local adjustment; original Qloo order retained for ties.'}</p>
      <button type="button" aria-label={`Like ${item.name}`} onClick={()=>rate(item.id,'liked')} aria-pressed={feedback[item.id]==='liked'} style={{marginRight:9}}>♡ Like</button>
      <button type="button" aria-label={`Not for me ${item.name}`} onClick={()=>rate(item.id,'disliked')} aria-pressed={feedback[item.id]==='disliked'}>Not for me</button>
     </div>}
   </article>)}
   {result.ablation&&<details style={{marginTop:14}}><summary>How Qloo changes the discovery results</summary><p>Qloo ON: {result.ablation.qlooOn.culturalCandidates} cultural candidates; Qloo OFF: {result.ablation.qlooOff.culturalCandidates}. {result.ablation.note}</p></details>}
   <p><small>{result.notice||'No pet-safety approval is implied.'}</small></p>
  </section>}
 </main>;
}
