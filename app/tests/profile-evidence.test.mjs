import test from 'node:test';
import assert from 'node:assert/strict';
import {appendEvent,localMetrics,portableProfile,parsePortableProfile,validateEvents} from '../lib/profile-evidence.mjs';
test('local metrics use actual recorded events, no invented retention',()=>{
 const e=appendEvent([], 'discovery_completed', 1000);
 const next=appendEvent(e,'candidate_opened',1100,'c1');
 const m=localMetrics(next);
 assert.deepEqual([m.searches,m.opened,m.openPerSearch,m.retention7Day,m.scope],[1,1,1,null,'THIS_BROWSER_ONLY']);
});
test('invalid telemetry is filtered and no notes enter event records',()=>{
 const e=validateEvents([{type:'journey_completed',at:1000,note:'secret'},{type:'fake',at:1000},{type:'candidate_opened',at:-1}]);
 assert.deepEqual(e,[{type:'journey_completed',at:1000}]);
});
test('profile export round trips explicit consent data',()=>{
 const j=Array.from({length:7},()=>({done:false,rating:null,note:''}));j[0]={done:true,rating:'liked',note:'music'};
 const p=portableProfile({'abc-1':'liked'},j,true);
 const q=parsePortableProfile(JSON.stringify(p));
 assert.equal(q.journey[0].note,'music');assert.equal(q.feedback['abc-1'],'liked');assert.equal(q.adaptive,true);
 assert.equal('events' in q,false);
});
test('reject malformed, wrong schema and oversized import',()=>{
 assert.throws(()=>parsePortableProfile('garbage'),/PROFILE_JSON_INVALID/);
 assert.throws(()=>parsePortableProfile(JSON.stringify({schema:'wrong'})),/PROFILE_SCHEMA_INVALID/);
 assert.throws(()=>parsePortableProfile(' '.repeat(20001)),/PROFILE_SIZE_INVALID/);
});
