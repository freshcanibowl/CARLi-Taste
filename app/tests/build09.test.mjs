import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDiscoveryView} from '../lib/discovery.mjs';
test('fails closed on empty evidence',()=>{
 const x=buildDiscoveryView({evidence:[]});
 assert.equal(x.status,'NO_CULTURAL_CANDIDATES');
 assert.deepEqual(x.recommendations,[]);
});
test('deduplicates and refuses to infer pet safety',()=>{
 const x=buildDiscoveryView({evidence:[{id:'a',name:'Jazz Cafe',category:'place'},{id:'a',name:'duplicate'},{id:'b',name:'Cinema'}]});
 assert.equal(x.candidates.length,2);
 assert.equal(x.candidates[0].petPolicy,'UNVERIFIED');
 assert.equal(x.candidates[0].actionable,false);
 assert.deepEqual(x.recommendations,[]);
});
test('ON OFF is labelled structural not outcome proof',()=>{
 const x=buildDiscoveryView({evidence:[{id:'a',name:'Jazz'}]});
 assert.equal(x.ablation.deltaCulturalCandidates,1);
 assert.match(x.ablation.note,/not proof/);
});
test('rejects malformed evidence',()=>{
 const x=buildDiscoveryView({evidence:[null,{id:3,name:'bad'},{id:'',name:'empty'},{id:'ok',name:'Valid'}]});
 assert.equal(x.candidates.length,1);
});
