const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),M=require(root+'/assets/resistori/model.js');
const near=(a,b)=>assert(Math.abs(a-b)<1e-8*Math.max(1,Math.abs(b)),`${a} != ${b}`);
let s=M.solve('series','voltage',12,1,2);near(s.itot,4);near(s.v1,4);near(s.v2,8);
s=M.solve('parallel','voltage',12,1,2);near(s.itot,18);near(s.i1,12);near(s.i2,6);
s=M.solve('series','current',6,1,2);near(s.vin,18);near(s.v1,6);near(s.v2,12);
s=M.solve('parallel','current',6,1,2);near(s.vin,4);near(s.i1,4);near(s.i2,2);
for(const kind of ['series','parallel'])for(const mode of ['voltage','current'])for(const input of [0,.1,12,50])for(const r1 of [.1,1,100])for(const r2 of [.1,2,100]){
 const a=M.solve(kind,mode,input,r1,r2);near(a.vin*a.itot,a.v1*a.i1+a.v2*a.i2);
 if(kind==='series'){near(a.i1,a.itot);near(a.i2,a.itot);near(a.v1+a.v2,a.vin);}else{near(a.v1,a.vin);near(a.v2,a.vin);near(a.i1+a.i2,a.itot);}
 near(a.v1,a.i1*r1);near(a.v2,a.i2*r2);
}
assert.throws(()=>M.solve('series','voltage',12,0,1));
const css=fs.readFileSync(root+'/assets/tema-chiaro.scss','utf8')+fs.readFileSync(root+'/assets/tema.scss','utf8');
const token=k=>{const m=css.match(new RegExp('--'+k+':\\s*(#[0-9a-fA-F]+)'));assert(m,k);return m[1]};
const palette={text:token('testo'),bg:token('superficie'),one:token('c-elettronici-l'),two:token('c-sistemi-automatici-l')};
for(const [kind,file] of [['series','serie'],['parallel','parallelo']])fs.writeFileSync(root+'/assets/resistori/'+file+'.svg',M.diagram(kind,'voltage',12,1,2,palette));
console.log('PASS: voltage and current sources, series/parallel invariants, Ohm, power balance, bounds; static diagrams generated.');
