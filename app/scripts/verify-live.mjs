#!/usr/bin/env node
// Read-only public release probe. Never calls the metered Qloo recommendation API.
const argv=process.argv.slice(2);
const value=(key)=>{const i=argv.indexOf(key);return i<0?null:argv[i+1]||null;};
const base=(value('--base')||process.env.CARLI_BASE_URL||'http://127.0.0.1:3127').replace(/\/+$/,'');
const expected=(value('--sha')||process.env.CARLI_EXPECTED_SHA||'').trim();
const timeout=Number(value('--timeout-ms')||'8000');
if(!/^https?:\/\//.test(base)||!Number.isInteger(timeout)||timeout<1000||timeout>30000){console.error('Invalid base URL or timeout');process.exit(2)}
const checks=[
 {path:'/',marker:'Cultural Discovery for People'},
 {path:'/journey',marker:'Seven days of better discovery'},
 {path:'/profile',marker:'My Taste Profile &amp; Evidence'},
 {path:'/api/status',kind:'status'}
];
const results=[];
for(const check of checks){
 const url=base+check.path;
 const entry={path:check.path,outcome:'FAIL',http:null,reason:null};
 try{
  const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(timeout),headers:{Accept:'text/html,application/json'}});
  entry.http=response.status;
  if([301,302,303,307,308,401,403].includes(response.status)){
   entry.reason='ACCESS_OR_REDIRECT_BLOCKED';
  }else if(!response.ok){
   entry.reason='HTTP_'+response.status;
  }else if(check.kind==='status'){
   const obj=await response.json();
   entry.revision=obj.revision??null;
   entry.environment=obj.environment??'unknown';
   entry.qlooConfigured=obj.qlooConfigured===true;
   entry.liveQlooVerified=obj.liveQlooVerified===true;
   entry.petPoliciesVerified=obj.petPoliciesVerified===true;
   if(obj.app!=='CARLi Taste'||obj.service!=='ok')entry.reason='STATUS_SCHEMA_MISMATCH';
   else if(expected&&obj.revision!==expected)entry.reason='REVISION_MISMATCH';
   else entry.outcome='PASS';
  }else{
   const body=await response.text();
   if(!body.includes(check.marker))entry.reason='EXPECTED_PAGE_CONTENT_MISSING';
   else entry.outcome='PASS';
  }
 }catch(error){entry.reason=error?.name==='TimeoutError'?'TIMEOUT':'NETWORK_ERROR'}
 results.push(entry);
 console.log(JSON.stringify(entry));
}
const passed=results.every(x=>x.outcome==='PASS');
const status=results.find(x=>x.path==='/api/status');
console.log(JSON.stringify({gate:passed?'HTTP_ROUTES_PASS':'NO_GO',releaseVerified:passed&&!!expected,expectedRevision:expected||null,actualRevision:status?.revision||null,qlooLiveVerified:false,petPolicyApproved:false}));
if(!passed)process.exitCode=1;
