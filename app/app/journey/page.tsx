'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';

type Entry={done:boolean;rating:'liked'|'neutral'|'disliked'|null;note:string};
const KEY='carli-taste-journey-v1';
const DAYS=[
 {title:'Discover Your Taste',task:'List three cultural interests you enjoy.',why:'Start with your own preferences.'},
 {title:'Morning Ritual',task:'Spend ten minutes on music, reading or a calming activity you enjoy.',why:'Try a small, repeatable ritual.'},
 {title:'Move & Explore',task:'Explore a place or take a short walk if suitable for you.',why:'Make cultural discovery part of your routine.'},
 {title:'Mindful Dining',task:'Reflect on a meal or cafe experience you enjoyed.',why:'Notice what matters in your food choices.'},
 {title:'Connect',task:'Share an activity with someone, or plan an outing that respects your pet\'s needs.',why:'Connect interests with people and pets responsibly.'},
 {title:'Try Something New',task:'Explore one unfamiliar genre, place or cultural activity.',why:'Expand your options beyond familiar favorites.'},
 {title:'Reflect & Adapt',task:'Review your notes and choose one activity to repeat next week.',why:'Use your own feedback to guide the next step.'}
] as const;
const empty=():Entry[]=>DAYS.map(()=>({done:false,rating:null,note:''}));
function valid(input:unknown):input is Entry[]{
 return Array.isArray(input)&&input.length===7&&input.every(x=>x&&typeof x==='object'&&typeof x.done==='boolean'&&
 (x.rating===null||['liked','neutral','disliked'].includes(x.rating))&&typeof x.note==='string');
}
export default function Journey(){
 const [entries,setEntries]=useState<Entry[]>(empty);
 const [day,setDay]=useState(0);
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const parsed:unknown=JSON.parse(raw);if(valid(parsed))setEntries(parsed.map(e=>({...e,note:e.note.slice(0,300)})));}}catch{}setLoaded(true)},[]);
 useEffect(()=>{if(loaded){try{localStorage.setItem(KEY,JSON.stringify(entries))}catch{}}},[entries,loaded]);
 const update=(patch:Partial<Entry>)=>setEntries(prev=>prev.map((e,i)=>i===day?{...e,...patch}:e));
 const completed=entries.filter(e=>e.done).length;
 const entry=entries[day];
 const reset=()=>{if(!window.confirm('Delete all seven days of local journey notes and progress?'))return;setEntries(empty());setDay(0);try{localStorage.removeItem(KEY)}catch{}};
 const styles={maxWidth:780,margin:'0 auto',padding:'24px 18px 72px',fontFamily:'system-ui, sans-serif',color:'#173e36',lineHeight:1.55} as const;
 return <main style={styles}>
  <Link href="/" style={{color:'#286e55'}}>← Back to cultural discovery</Link>
  <p style={{marginTop:28,letterSpacing:2,fontSize:12,color:'#477260'}}>CARLi TASTE / OPTIONAL JOURNEY</p>
  <h1 style={{fontSize:'clamp(28px,5vw,42px)',lineHeight:1.13,margin:'10px 0'}}>Seven days of better discovery</h1>
  <p>Explore your cultural interests with one small, self-chosen activity a day. This is a personal reflection tool, not medical advice or proof of improved health.</p>
  <div style={{background:'#eef5ef',padding:16,borderRadius:14,margin:'22px 0'}}>
   <strong>{completed} of 7 days completed</strong>
   <div role="progressbar" aria-label="Journey progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={completed} style={{background:'#d2e3d7',height:9,borderRadius:9,marginTop:10,overflow:'hidden'}}>
    <div style={{background:'#28795b',width:`${completed/7*100}%`,height:'100%'}}/>
   </div>
  </div>
  <nav aria-label="Choose journey day" style={{display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:5}}>
   {DAYS.map((d,i)=><button key={i} type="button" aria-label={`Day ${i+1}: ${d.title}`} aria-current={day===i?'step':undefined} onClick={()=>setDay(i)} style={{border:day===i?'2px solid #1d6048':'1px solid #ccdcd3',borderRadius:10,padding:'10px 0',background:entries[i].done?'#c6e9d3':'white',fontWeight:day===i?700:400,color:'#173e36',cursor:'pointer'}}>{entries[i].done?'✓':i+1}</button>)}
  </nav>
  <section aria-live="polite" style={{border:'1px solid #d8e4dc',borderRadius:16,padding:22,marginTop:18}}>
   <p style={{margin:'0 0 8px',color:'#477260'}}>DAY {day+1}</p>
   <h2 style={{fontSize:25,margin:'0 0 12px'}}>{DAYS[day].title}</h2>
   <p>{DAYS[day].task}</p><p style={{color:'#537366'}}>{DAYS[day].why}</p>
   <label style={{display:'block',margin:'18px 0'}}>
    <input type="checkbox" checked={entry.done} onChange={e=>update({done:e.target.checked})}/> I completed this activity
   </label>
   <fieldset style={{border:'none',padding:0,margin:'12px 0'}}>
    <legend style={{fontWeight:600}}>How was it?</legend>
    {(['liked','neutral','disliked'] as const).map(r=><label key={r} style={{display:'inline-block',margin:'8px 18px 8px 0'}}>
      <input type="radio" name="experience" checked={entry.rating===r} onChange={()=>update({rating:r})}/> {r==='liked'?'Enjoyed it':r==='neutral'?'Neutral':'Not for me'}
     </label>)}
   </fieldset>
   <label htmlFor="journey-note" style={{display:'block',fontWeight:600}}>Optional reflection (max 300 characters)</label>
   <textarea id="journey-note" maxLength={300} value={entry.note} onChange={e=>update({note:e.target.value})} placeholder="What would you keep or change?" style={{boxSizing:'border-box',width:'100%',minHeight:105,padding:12,border:'1px solid #a8bdb1',borderRadius:10,marginTop:8,font:'inherit'}}/>
  </section>
  <div style={{display:'flex',justifyContent:'space-between',gap:12,marginTop:18}}>
   <button disabled={day===0} onClick={()=>setDay(x=>Math.max(0,x-1))} style={{padding:'12px 18px'}}>Previous day</button>
   <button disabled={day===6} onClick={()=>setDay(x=>Math.min(6,x+1))} style={{padding:'12px 18px'}}>Next day</button>
  </div>
  <aside style={{marginTop:28,borderTop:'1px solid #d8e4dc',paddingTop:18,fontSize:14}}>
   <strong>Private by default.</strong> Journey progress stays in this browser's local storage. It is not sent to Qloo or a CARLi server, and it may disappear if you clear browser data. Other people using this browser could see it.
   <p>CARLi Taste does not verify venue pet-entry policies. Contact each venue before taking a pet.</p>
   <button onClick={reset} style={{background:'transparent',border:'1px solid #a8bdb1',padding:'10px 14px',borderRadius:9,cursor:'pointer'}}>Delete my journey data</button>
  </aside>
 </main>;
}
