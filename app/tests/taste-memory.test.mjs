import test from 'node:test';
import assert from 'node:assert/strict';
import {rankLocal,journeySignal,safeFeedback} from '../lib/taste-memory.mjs';
const items=[
 {id:'1',name:'Generic Hall',category:'urn:entity',petPolicy:'UNVERIFIED',actionable:false},
 {id:'2',name:'Jazz Music Hall',category:'urn:entity',petPolicy:'UNVERIFIED',actionable:false},
 {id:'3',name:'Community Garden',category:'urn:entity',petPolicy:'UNVERIFIED',actionable:false}
];
test('default mode preserves Qloo candidate ordering and safety flags',()=>{
 const r=rankLocal(items);assert.deepEqual(r.map(x=>x.id),['1','2','3']);
 assert.ok(r.every(x=>x.petPolicy==='UNVERIFIED'&&x.actionable===false));
});
test('liked and disliked explicit feedback reorders client candidates only',()=>{
 const r=rankLocal(items,{feedback:{'3':'liked','1':'disliked'}});
 assert.deepEqual(r.map(x=>x.id),['3','2','1']);
 assert.match(r[0].localReasons[0],/previously liked/);
});
test('a positive completed music journey rating can promote music matches',()=>{
 const journey=Array.from({length:7},()=>({done:false,rating:null,note:''}));
 journey[1]={done:true,rating:'liked',note:'private'};
 const r=rankLocal(items,{journey});
 assert.equal(r[0].id,'2');assert.equal(r[0].localScore,1);
 assert.ok(!JSON.stringify(r).includes('private'));
});
test('uncompleted journey ratings must not influence ordering',()=>{
 const journey=Array.from({length:7},()=>({done:false,rating:'liked'}));
 assert.deepEqual(journeySignal(journey),{});
});
test('malformed stored feedback and journey data is ignored',()=>{
 assert.deepEqual(safeFeedback({'1':'liked','2':'invalid','3':'disliked'}),{'1':'liked','3':'disliked'});
 assert.deepEqual(safeFeedback(null),{});
 assert.deepEqual(journeySignal([{}]),{});
});
test('stable tie ordering preserves source order',()=>{
 const r=rankLocal(items,{feedback:{}});
 assert.deepEqual(r.map(x=>x.originalQlooPosition),[1,2,3]);
});
