(()=>{'use strict';
const root=document.getElementById('sine-lab');if(!root)return;
const $=id=>document.getElementById('sine-'+id),M=window.SineModel;
let s,shown=[true,true,false,false],preset='same';
const fmt=n=>(Math.abs(n)<1e-9?0:n).toLocaleString('it-IT',{maximumFractionDigits:3});
const names=()=>preset==='usa'?['vL₁N','vL₂N','Somma','vL₁L₂ (differenza)']:preset==='italy'?['vLN','N (riferimento)','Somma','Differenza']:['v₁','v₂','Somma','Differenza'];
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const controls=$('controls');
for(let i=0;i<2;i++){
 const box=document.createElement('fieldset');box.innerHTML=`<legend>Sinusoide ${i+1}</legend>`;
 for(const [key,label,min,max,step] of [['a','Ampiezza di picco (V)',0,500,.1],['f','Frequenza (Hz)',.1,1000,.1],['p','Fase iniziale (°)',-180,180,1]]){
  const id=`sine-${key}${i}`;
  box.insertAdjacentHTML('beforeend',`<label for="${id}">${label}</label><div class="sine-pair"><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" aria-label="${label}, sinusoide ${i+1}"><input id="${id}-n" type="number" min="${min}" max="${max}" step="any" aria-label="${label}, valore numerico sinusoide ${i+1}"></div>`);
  for(const suffix of ['', '-n'])box.querySelector('#'+id+suffix).addEventListener('input',e=>{
   const n=e.target.valueAsNumber;if(!Number.isFinite(n)||n<min||n>max){e.target.setCustomValidity(`Inserisci un valore tra ${min} e ${max}`);return;}e.target.setCustomValidity('');
   s[key][i]=n;preset='custom';$('preset').value='custom';$('circuit').hidden=true;
   document.getElementById(id+(suffix?'':'-n')).value=n;draw();
  });
 }
 box.insertAdjacentHTML('beforeend',`<p id="sine-info${i}"></p><label><input id="sine-visible${i}" type="checkbox" checked> Mostra la curva ${i+1}</label>`);
 box.querySelector('input[type=checkbox]').addEventListener('change',e=>{shown[i]=e.target.checked;draw()});controls.append(box);
}
function circuit(){
 const usa=preset==='usa';$('circuit').hidden=!['usa','italy'].includes(preset);if($('circuit').hidden)return;
 const title=usa?'Sorgente monofase con presa centrale N':'Sorgente monofase: riferimento N';
 const drawing=usa?`<path d="M100 55H240M100 145H240M100 235H240M100 55V75M100 125V165M100 215V235"/><circle cx="100" cy="100" r="25"/><circle cx="100" cy="190" r="25"/><text x="92" y="108">∿</text><text x="92" y="198">∿</text><text x="255" y="40">L₁ (+)</text><text x="255" y="150">N (−), riferimento 0 V</text><text x="255" y="260">L₂ (+)</text><text x="395" y="70">vL₁N: 120 V efficaci, 0°</text><text x="395" y="215">vL₂N: 120 V efficaci, 180°</text><path d="M720 55H765V125h-15v45h30v-45h-15M765 170V235H720"/><text x="610" y="280">Carico tra L₁ e L₂: vL₁ − vL₂</text><path d="M240 55H720M240 235H720"/>`:`<path d="M100 65H600V110M600 155V220H100V160M100 110V65"/><circle cx="100" cy="135" r="25"/><text x="92" y="143">∿</text><path d="M585 110h30v45h-30z"/><text x="130" y="55">L (+)</text><text x="130" y="245">N (−), riferimento 0 V</text><text x="250" y="135">vLN: 230 V efficaci · 50 Hz</text><text x="630" y="140">Carico</text>`;
 $('circuit').innerHTML=`<svg viewBox="0 0 900 310" role="img" aria-label="${title}"><title>${title}</title>${drawing}</svg><p>${title}. ${usa?'60 Hz; polarità di entrambe le tensioni rispetto a N. Le due sorgenti rappresentano le metà del secondario.':'Il simbolo ∿ indica il generatore ideale.'}</p>`;
}
function load(key){preset=key;s=structuredClone(M.presets[key]);shown=[true,true,false,key==='usa'];$('preset').value=key;for(let i=0;i<2;i++){for(const k of ['a','f','p']){ $(k+i).value=s[k][i];$(k+i+'-n').value=s[k][i];$(k+i+'-n').setCustomValidity('');} $('visible'+i).checked=true;} $('duration').value=s.duration;$('time').value=250;fit();circuit();}
function fit(){
 let duration=s.duration;
 if(preset==='custom'){duration=3000/Math.min(...s.f);const delta=Math.abs(s.f[0]-s.f[1]);if(delta>0&&delta<Math.min(...s.f)/2)duration=Math.max(duration,2000/delta);}
 $('duration').value=Math.min(10000,Math.max(.1,duration));$('limit').value=Math.max(.01,Math.ceil((s.a[0]+s.a[1])*1.1*100)/100);draw();
}
function draw(){
 const duration=Number($('duration').value),limit=Number($('limit').value);if(!$('duration').checkValidity()||!$('limit').checkValidity()||!duration||!limit)return;
 const css=getComputedStyle(root),color=key=>css.getPropertyValue(key).trim();
 const colors=['--c-elettronici','--c-elettrotecnici','--c-domotica','--c-sistemi-automatici'].map(color),text=color('--testo'),grid=color('--bordo-forte'),bg=color('--superficie');
 const x=t=>65+t/duration*810;
 const yplot=v=>210-v/limit*170;
 let svg=`<title>Sinusoidi: tensione in volt, tempo in millisecondi</title><rect width="900" height="440" fill="${bg}"/><defs><clipPath id="sine-clip"><rect x="65" y="40" width="810" height="340"/></clipPath></defs>`;
 for(let j=0;j<=4;j++){const v=-limit+j*limit/2,yy=yplot(v),xx=65+j*810/4;svg+=`<path d="M65 ${yy}H875M${xx} 40V380" stroke="${grid}" fill="none"/><text x="58" y="${yy+5}" text-anchor="end" fill="${text}">${fmt(v)}</text><text x="${xx}" y="404" text-anchor="middle" fill="${text}">${fmt(duration*j/4)}</text>`;}
 svg+=`<text x="65" y="22" fill="${text}">Tensione (V)</text><text x="780" y="432" fill="${text}">Tempo (ms)</text>`;
 const samples=Math.min(30000,Math.max(1000,Math.ceil(duration/1000*Math.max(...s.f)*40))),sparse=duration/1000*Math.max(...s.f)>750;
 let clipped=false;
 for(let k=0;k<4;k++)if(shown[k]){let d='';for(let j=0;j<=samples;j++){const t=duration*j/samples,v=M.at(s,t/1000)[k];if(Math.abs(v)>limit+1e-6)clipped=true;d+=(j?'L':'M')+x(t).toFixed(2)+' '+yplot(v).toFixed(2);}svg+=`<path d="${d}" clip-path="url(#sine-clip)" fill="none" stroke="${colors[k]}" stroke-width="${k<2?2:3}" ${k===1?'stroke-dasharray="8 4"':k===3?'stroke-dasharray="3 4"':''}/>`;}
 const time=duration*Number($('time').value)/1000,vals=M.at(s,time/1000);
 svg+=`<path d="M${x(time)} 40V380" stroke="${text}" stroke-dasharray="4 4"/>`;
 for(let k=0;k<4;k++)if(shown[k]&&Math.abs(vals[k])<=limit)svg+=`<circle cx="${x(time)}" cy="${yplot(vals[k])}" r="4" fill="${colors[k]}"/>`;
 $('plot').innerHTML=svg;
 $('legend').innerHTML=names().map((n,i)=>shown[i]?`<span style="color:${colors[i]}">${i===1||i===3?'┄':'━'} ${n}</span>`:'').join('');
 $('reading').textContent=`t = ${fmt(time)} ms · `+names().map((n,i)=>`${n} = ${fmt(vals[i])} V`).join(' · ');
 $('time').setAttribute('aria-valuetext',`${fmt(time)} millisecondi`);
 for(let i=0;i<2;i++)$('info'+i).textContent=`Valore efficace: ${fmt(s.a[i]/Math.SQRT2)} V · Periodo: ${fmt(1000/s.f[i])} ms · Fase: ${fmt(s.p[i]*Math.PI/180)} rad`;
 for(const [key,k,name] of [['sum',2,'somma'],['diff',3,'differenza']]){$(key).setAttribute('aria-pressed',String(shown[k]));$(key).textContent=(shown[k]?'Nascondi':'Mostra')+' la '+name;}
 $('notice').textContent=[clipped?'Parte delle curve supera il limite verticale: aumenta il limite o adatta il grafico.':'',sparse?'Troppi periodi per distinguere le oscillazioni: riduci la durata del grafico.':''].filter(Boolean).join(' ');
}
$('preset').addEventListener('change',e=>{if(e.target.value==='custom'){preset='custom';circuit();draw();}else load(e.target.value)});
$('sum').onclick=()=>{shown[2]=!shown[2];draw()};$('diff').onclick=()=>{shown[3]=!shown[3];draw()};
$('fit').onclick=fit;$('reset').onclick=()=>load(preset==='custom'?'same':preset);$('time').oninput=draw;
for(const k of ['duration','limit'])$(k).addEventListener('input',()=>{if($(k).checkValidity())draw()});
$('export').onclick=()=>{
 const caption=$('preset').selectedOptions[0].textContent;
 const lines=[caption,...[0,1].map(i=>`v${i+1}: A = ${fmt(s.a[i])} V (picco); f = ${fmt(s.f[i])} Hz; fase = ${fmt(s.p[i])} gradi`),names().filter((_,i)=>shown[i]).join(' | '),$('reading').textContent];
 const text=getComputedStyle(root).getPropertyValue('--testo').trim(),bg=getComputedStyle(root).getPropertyValue('--superficie').trim();
 const content=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620"><rect width="900" height="620" fill="${bg}"/>${$('plot').innerHTML}<g fill="${text}" font-family="sans-serif" font-size="14">${lines.map((l,i)=>`<text x="30" y="${465+i*30}">${esc(l)}</text>`).join('')}</g></svg>`;
 const url=URL.createObjectURL(new Blob([content],{type:'image/svg+xml;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='sinusoidi-'+preset+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
new MutationObserver(draw).observe(document.body,{attributes:true,attributeFilter:['class']});
document.querySelectorAll('link.quarto-color-scheme').forEach(link=>new MutationObserver(()=>setTimeout(draw,100)).observe(link,{attributes:true}));
load('same');
})();
