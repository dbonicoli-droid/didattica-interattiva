const assert=require('node:assert/strict'),M=require('../assets/funzioni/model.js');
const close=(a,b,t=1e-5)=>assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(a),Math.abs(b)),a+' != '+b);
for(const kind of Object.keys(M.defs)){const cases=[M.defs[kind].defaults];if(['exp','expfrac'].includes(kind))cases.push({a:.5,alpha:1},{a:1,alpha:1},{a:2,alpha:0},{a:2,alpha:-1});if(['log','logfrac'].includes(kind))for(const b of [.5,2])for(const alpha of [.2,.5,1,3])cases.push({b,alpha});if(kind==='cubic')cases.push({A:1.5,p:1,q:1},{A:.25,p:4,q:-4});if(kind==='quadratic')cases.push({A:-1,r1:2,r2:2},{A:2,r1:-3,r2:1});if(kind==='rational2')cases.push({A:.25,r:3,d:-2},{A:3,r:.25,d:2});if(kind==='rational')cases.push({p:2,h:0},{p:.25,h:-3});
for(const p of cases){M.validate(kind,p);const s=M.study(kind,p);assert.ok(s.sections.length>=3);assert.ok(!JSON.stringify(s).includes('NaN'));for(const x of [-4.4,-2.2,-.7,.3,1.4,2.7,4.8,11.1]){if(M.poles(kind,p,-20,20).some(z=>Math.abs(x-z)<.05)||M.holes(kind,p).some(z=>Math.abs(x-z.x)<.05))continue;const h=1e-4,f=M.value(kind,x,p),fl=M.value(kind,x-h,p),fr=M.value(kind,x+h,p);if(![f,fl,fr].every(Number.isFinite))continue;const [d1,d2]=M.derivatives(kind,x,p);close(d1,(fr-fl)/(2*h),2e-5);close(d2,(fr-2*f+fl)/(h*h),.0002);}
for(const q of s.critical){assert.ok(Number.isFinite(q.x)&&Number.isFinite(q.y));close(M.derivatives(kind,q.x,p)[0],0,1e-7);close(M.value(kind,q.x,p),q.y);const h=1e-4*Math.max(1,Math.abs(q.x)),l=M.value(kind,q.x-h,p),r=M.value(kind,q.x+h,p);if(q.type.startsWith('massimo'))assert.ok(q.y>=l-1e-10&&q.y>=r-1e-10);else assert.ok(q.y<=l+1e-10&&q.y<=r+1e-10);}
for(const q of s.inflections){close(M.derivatives(kind,q.x,p)[1],0,1e-7);const h=1e-4;assert.ok(M.derivatives(kind,q.x-h,p)[1]*M.derivatives(kind,q.x+h,p)[1]<0);}
for(const x of s.zeros)close(M.value(kind,x,p),0,1e-7);
}}
const e=M.study('expfrac',{a:Math.E,alpha:1});close(e.critical[0].x,-Math.sqrt(5));close(e.critical[1].x,Math.sqrt(5));
const deg={b:Math.E,alpha:.5};assert.deepEqual(M.poles('logfrac',deg),[]);assert.equal(M.holes('logfrac',deg).length,1);close(M.value('logfrac',2.00001,deg),1,1e-5);assert.equal(M.study('logfrac',deg).critical.length,0);assert.equal(M.study('logfrac',deg).inflections.length,0);assert.ok(Number.isNaN(M.value('logfrac',2,deg)));
assert.throws(()=>M.validate('log',{b:1,alpha:1}));assert.equal(M.study('logfrac',{b:2,alpha:.2}).critical.length,0);assert.equal(M.study('logfrac',{b:.5,alpha:1}).critical[0].type,'minimo locale');
// Check pole direction independently with positive denominators/numerators on each side.
for(const x of [-3,1])for(const k of [-1,0,1]){const p={a:Math.E,alpha:k},l=M.value('expfrac',x-1e-7,p),r=M.value('expfrac',x+1e-7,p);assert.ok(x===-3?l>0&&r<0:l<0&&r>0);}
console.log('PASS funzioni: 11 famiglie, derivate numeriche indipendenti, zeri/estremi/flessi, k positivo/negativo/nullo, base logaritmica <1 e >1, buco alpha=0.5, poli e parametri invalidi.');

assert.throws(()=>M.validate('quadratic',{A:0,r1:-1,r2:1}));assert.ok(Number.isNaN(M.derivatives('log',-1,{b:2,alpha:1})[0]));
