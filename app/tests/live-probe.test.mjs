import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile);
const script=new URL('../scripts/verify-live.mjs',import.meta.url).pathname;
const fullSha='a'.repeat(40);
const paths={
 '/':'<html>Cultural Discovery for People</html>',
 '/journey':'<html>Seven days of better discovery</html>',
 '/profile':'<html>My Taste Profile &amp; Evidence</html>'
};
async function fixture(fn){
 const server=createServer((req,res)=>{
  if(req.url==='/api/status'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({app:'CARLi Taste',service:'ok',revision:fullSha,environment:'production',qlooConfigured:true,liveQlooVerified:false,petPoliciesVerified:false}));return}
  if(Object.hasOwn(paths,req.url)){res.setHeader('Content-Type','text/html');res.end(paths[req.url]);return}
  res.writeHead(404).end();
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{return await fn('http://127.0.0.1:'+server.address().port)}finally{await new Promise(resolve=>server.close(resolve))}
}
test('read-only HTTP smoke never claims release verification without full expected SHA',async()=>fixture(async base=>{
 const {stdout}=await exec(process.execPath,[script,'--base',base]);
 const lines=stdout.trim().split('\n');
 const summary=JSON.parse(lines.at(-1));
 assert.equal(summary.gate,'HTTP_ROUTES_PASS');
 assert.equal(summary.releaseVerified,false);
 assert.equal(summary.qlooLiveVerified,false);
 assert.equal(summary.petPolicyApproved,false);
}));
test('read-only HTTP smoke verifies expected SHA exactly',async()=>fixture(async base=>{
 const {stdout}=await exec(process.execPath,[script,'--base',base,'--sha',fullSha]);
 assert.equal(JSON.parse(stdout.trim().split('\n').at(-1)).releaseVerified,true);
 await assert.rejects(exec(process.execPath,[script,'--base',base,'--sha','b'.repeat(40)]),err=>{
  assert.match(err.stdout,/REVISION_MISMATCH/);return true;
 });
}));
test('production gate rejects HTTP and missing SHA before making network requests',async()=>{
 for(const args of [
  ['--production','--base','http://127.0.0.1:3127','--sha',fullSha],
  ['--production','--base','https://example.invalid'],
  ['--production','--base','https://example.invalid','--sha','not-a-sha']
 ]){
  await assert.rejects(exec(process.execPath,[script,...args]),err=>{
   assert.equal(err.code,2);assert.match(err.stderr,/PRODUCTION_GATE_INVALID_ARGS/);return true;
  });
 }
});
