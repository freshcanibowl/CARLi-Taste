'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {EVENT_KEY,localMetrics,portableProfile,parsePortableProfile,browserKeys,validateEvents} from '../../lib/profile-evidence.mjs';
import type {ChangeEvent} from 'react';

const keys=browserKeys();
export default function TasteProfile(){
 const [metrics,setMetrics]=useState(localMetrics([]));
 const [message,setMessage]=useState('');
 const [refreshed,setRefreshed]=useState(0);
 useEffect(()=>{
  try{setMetrics(localMetrics(JSON.parse(localStorage.getItem(EVENT_KEY)||'[]')))}
  catch{setMetrics(localMetrics([]))}
 },[refreshed]);
 function exportProfile(){
  try{
   const feedback=JSON.parse(localStorage.getItem(keys.feedback)||'{}');
   const journey=JSON.parse(localStorage.getItem(keys.journey)||'[]');
   const adaptive=localStorage.getItem(keys.optin)==='true';
   const profile=portableProfile(feedback,journey,adaptive);
   const blob=new Blob([JSON.stringify(profile,null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob);
   const a=document.createElement('a');a.href=url;a.download='carli-taste-profile.json';a.click();
   URL.revokeObjectURL(url);
   setMessage('Export created. Store this file safely: it includes your optional notes and ratings.');
  }catch{setMessage('Could not export local data.')}
 }
 async function importProfile(e:ChangeEvent<HTMLInputElement>){
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  if(file.size>20000){setMessage('Import rejected: file exceeds 20 KB.');return}
  try{
   const profile=parsePortableProfile(await file.text());
   if(!window.confirm('Replace this browser’s existing CARLi Taste feedback and seven-day notes with the selected file?'))return;
   // Validate before applying any write; no automatic cloud transfer.
   localStorage.setItem(keys.feedback,JSON.stringify(profile.feedback));
   localStorage.setItem(keys.journey,JSON.stringify(profile.journey));
   localStorage.setItem(keys.optin,String(profile.adaptive));
   setMessage('Profile imported locally. Reload Discovery or Journey to view it.');
  }catch{setMessage('Import rejected: invalid or unsupported profile file.')}
 }
 function clearEvidence(){
  if(!window.confirm('Delete local interaction evidence on this browser?'))return;
  try{localStorage.removeItem(keys.events)}catch{}
  setRefreshed(x=>x+1);setMessage('Local interaction evidence cleared.');
 }
 function exportEvidence(){
  try{
   const events=validateEvents(JSON.parse(localStorage.getItem(keys.events)||'[]'));
   const url=URL.createObjectURL(new Blob([JSON.stringify({scope:'THIS_BROWSER_ONLY',events},null,2)],{type:'application/json'}));
   const a=document.createElement('a');a.href=url;a.download='carli-taste-local-evidence.json';a.click();URL.revokeObjectURL(url);
   setMessage('Local evidence export created.');
  }catch{setMessage('Could not export evidence.')}
 }
 return <main style={{maxWidth:760,margin:'0 auto',padding:'32px 20px 80px',fontFamily:'system-ui,sans-serif',color:'#173e36',lineHeight:1.6}}>
  <Link href="/">← Cultural discovery</Link>
  <p style={{letterSpacing:2,color:'#477260'}}>CARLi TASTE / DATA CONTROL</p>
  <h1>My Taste Profile &amp; Evidence</h1>
  <p>Move your profile between browsers by manually exporting and importing a JSON file. No account or automatic cross-device cloud sync is enabled.</p>
  <section style={{background:'#eef5ef',padding:20,borderRadius:14,margin:'20px 0'}}>
   <h2>Portable Taste Profile</h2>
   <p>Includes your seven-day notes, activity ratings, feedback and personalization setting. It does not include interaction history.</p>
   <button type="button" onClick={exportProfile}>Download my Taste Profile</button>
   <label style={{display:'block',marginTop:18}}>Import a previously exported profile (replaces existing notes and feedback)
    <input type="file" accept=".json,application/json" onChange={importProfile} style={{display:'block',marginTop:8}}/>
   </label>
  </section>
  <section style={{border:'1px solid #d1e1d7',padding:20,borderRadius:14}}>
   <h2>This-browser usage evidence</h2>
   <p>Only explicitly recorded interactions on this browser count. These are not population-level analytics.</p>
   <dl>
    <dt>Completed discovery searches</dt><dd><strong>{metrics.searches}</strong></dd>
    <dt>Candidate detail actions</dt><dd><strong>{metrics.opened}</strong></dd>
    <dt>Feedback actions</dt><dd><strong>{metrics.feedbackActions}</strong></dd>
    <dt>Journey completion actions</dt><dd><strong>{metrics.journeyCompletions}</strong></dd>
    <dt>Candidate detail actions per completed search</dt><dd><strong>{metrics.openPerSearch===null?'Not enough data':metrics.openPerSearch.toFixed(2)}</strong></dd>
    <dt>Seven-day user retention</dt><dd><strong>Not measured</strong></dd>
   </dl>
   <p style={{fontSize:13}}>A detail action is not proof of a real-world visit or booking. Repeated actions can increase counts. This dashboard makes no conversion or retention performance claim.</p>
   <button type="button" onClick={exportEvidence}>Export local interaction evidence</button>{' '}
   <button type="button" onClick={clearEvidence}>Delete local interaction evidence</button>
  </section>
  <p role="status">{message}</p>
  <p style={{fontSize:13}}>Your files stay on your device unless you choose to share them. Other people using your browser or exported file may see sensitive notes. Use the Journey page to delete notes and the discovery page to clear taste feedback independently.</p>
 </main>;
}
