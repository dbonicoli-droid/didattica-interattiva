const assert=require('node:assert/strict'),M=require('../assets/luci/model.js');
// Independent connectivity check: traverse actual terminals and contacts.
function connected([s1,s2,s3]){const edges=[['L','C1'],['C3','lamp'],['lamp','N'],['C1','T'+s1],['U'+s3,'C3']];for(let i=0;i<2;i++)edges.push(['T'+i,'U'+(s2?1-i:i)]);let queue=['L'],seen=new Set(queue);while(queue.length){const n=queue.shift();for(const[a,b]of edges){const next=a===n?b:b===n?a:null;if(next&&!seen.has(next)){seen.add(next);queue.push(next);}}}return seen.has('N');}
for(let n=0;n<8;n++){const s=[n>>2&1,n>>1&1,n&1];assert.equal(M.lamp(s),connected(s));for(let i=0;i<3;i++){const t=[...s];t[i]^=1;assert.notEqual(M.lamp(s),M.lamp(t));}}
let r=M.initial();for(let i=0;i<12;i++){const before=r.on;r=M.relay(r,{type:'press',index:i%3});assert.equal(r.on,!before);assert.equal(r.pressed,i%3);assert.equal(r.impulses,i+1);assert.equal(M.relay(r,{type:'press',index:(i+1)%3}),r);const held=r.on;r=M.relay(r,{type:'release'});assert.equal(r.on,held);assert.equal(r.pressed,null);}
assert.deepEqual(M.relay(r,{type:'reset'}),M.initial());
const on=M.relaySvg({on:true,pressed:0,impulses:1,last:0});assert(on.includes('M295 95L365 95'));assert(on.includes('M295 405L365 405'));
console.log('PASS: graph connectivity for 8 states, 24 toggles, relay impulses and hold/release, no duplicate pulse, contact endpoints and reset.');
