const fs=require('fs'),vm=require('vm'),assert=require('assert');
const base=require('path').resolve(__dirname,'..');
const preset=JSON.parse(fs.readFileSync(base+'/assets/rc/preset.json','utf8').replace(/^\uFEFF/,''));
const num=n=>n.toFixed(3);
let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" role="img" aria-labelledby="title"><title id="title">Confronto di due cariche RC a 10 V</title><rect width="900" height="430" fill="white"/><g font-family="sans-serif" font-size="17" fill="#142c44">';
for(let i=0;i<=5;i++){let x=72+i*160,y=342-i*64;svg+='<path d="M'+x+' 22V342 M72 '+y+'H872" stroke="#e1e7ea"/><text x="'+x+'" y="370" text-anchor="middle">'+(i/5).toLocaleString('it-IT')+'</text><text x="60" y="'+(y+6)+'" text-anchor="end">'+(12*i/5).toLocaleString('it-IT')+'</text>';}
svg+='<path d="M72 22V342H872" fill="none" stroke="#142c44"/><text x="72" y="17">vC (V)</text><text x="870" y="402" text-anchor="end">Tempo t (s)</text>';
for(const [key,color,dash] of [['circuit1','#087e82',''],['circuit2','#bd501a','10 7']]){const c=preset[key],tau=c.R_ohm*c.C_farad;let d='';for(let i=0;i<=800;i++){const t=i/800,v=10*(-Math.expm1(-t/tau));d+=(i?'L':'M')+num(72+800*t)+' '+num(342-320*v/12);}svg+='<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="4" stroke-dasharray="'+dash+'"/>';}
svg+='<text x="110" y="422" fill="#087e82">Circuito 1: τ = 0,1 s — continuo</text><text x="480" y="422" fill="#bd501a">Circuito 2: τ = 0,2 s — tratteggiato</text></g></svg>';
fs.writeFileSync(base+'/assets/rc/confronto.svg',svg);
const html=fs.readFileSync(base+'/laboratori/rc/index.html','utf8');
assert(!/\b(?:src|href)=["']https?:/i.test(html),'No remote dependencies');
const elements={};
function el(id){if(!elements[id])elements[id]={value:'',textContent:'',innerHTML:'',disabled:false,attrs:{},events:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){this.events[k]=f}};return elements[id]}
const context=vm.createContext({document:{getElementById:el},performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{},console});
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);
const run=s=>vm.runInContext(s,context);
assert(Math.abs(run('voltage(.1,1,100)')-6.321205588)<1e-8);
assert(Math.abs(run('voltage(.1,2,100)')-3.934693403)<1e-8);
assert(Math.abs(run('voltage(.5,1,100)')-9.93262053)<1e-8);
assert.equal(run('voltage(0,1,100)'),0);
assert.equal(run('voltage(.1,1,100)'),run('voltage(.1,2,50)'));
run("measure(.1)");assert.equal(run('state.selected'),.1);
for(const id of ['r1','r2','c1','c2']){el(id).value=id[0]==='r'?'3':'200';el(id).events.input();assert.equal(run('state.xmax'),1);assert.equal(run('state.ymax'),12);}
el('start').events.click();assert.equal(run('state.running'),true);assert.equal(run('state.progress'),0);
el('pause').events.click();assert.equal(run('state.running'),false);
el('pause').events.click();assert.equal(run('state.running'),true);
el('r1').value='4';el('r1').events.input();assert.equal(run('state.running'),false);assert.equal(run('state.progress'),1);
el('reset').events.click();assert.equal(run('state.r1'),1);assert.equal(run('state.r2'),2);
run('measure(.9)');el('xmax').value='0';el('xmax').events.input();assert.equal(run('state.selected'),null);assert.equal(run('state.xmax'),.05);
el('reset').events.click();el('ymax').value='1';el('ymax').events.input();run('measure(.1)');assert(el('readings').innerHTML.includes('fuori scala'));
for(let t=0;t<=10;t+=.01){const v=run('voltage('+t+',1,100)');assert(v>=0&&v<=10);}
console.log('PASS: formula, SI conversion, equal RC, bounds, independent axes, selected time, animation/pause/reset, clipping notice. SVG generated from saved preset.');
