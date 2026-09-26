(function(root){
'use strict';
function solve(v,r1,r2,r3,r4){
 if(![v,r1,r2,r3,r4].every(Number.isFinite)||v<0||[r1,r2,r3,r4].some(r=>r<=0))throw new RangeError('Valori non validi');
 const k1=r2/(r1+r2),k2=r4/(r3+r4),rp=1/(1/r2+1/(r3+r4));
 const v1=v*rp/(r1+rp),out=v1*k2,i1=(v-v1)/r1,i2=v1/r2,i3=v1/(r3+r4);
 return {k1,k2,ideal:v*k1*k2,separate:[v*k1,v*k2],sepI:[v/(r1+r2),v/(r3+r4)],v1,out,currents:[i1,i2,i3,i3],voltages:[v-v1,v1,v1-out,out],gain:rp/(r1+rp)*k2};
}
const fmt=n=>new Intl.NumberFormat('it-IT',{maximumFractionDigits:4}).format(n);
const ohm=n=>n>=1000?fmt(n/1000)+' kΩ':fmt(n)+' Ω';
function diagram(s,kind='cascade',readings=true){
 const m=solve(s.v,s.r1,s.r2,s.r3,s.r4),cascade=kind==='cascade',second=kind==='second';
 const width=cascade?900:440,sub=(name,n)=>`${name}<tspan baseline-shift="sub" font-size="13">${n}</tspan>`;
 const text=(x,y,t,cl='',anchor='start')=>`<text x="${x}" y="${y}" class="${cl}" text-anchor="${anchor}">${t}</text>`;
 const line=(d)=>`<path d="${d}"/>`;
 const rh=(x,y,n,value)=>line(`M${x-55} ${y}h25 m60 0h25`)+`<rect x="${x-30}" y="${y-11}" width="60" height="22"/>`+text(x,y-24,`R${n} · ${ohm(value)}`,'','middle');
 const rv=(x,y,n,value)=>line(`M${x} ${y-55}v25 m0 60v25`)+`<rect x="${x-11}" y="${y-30}" width="22" height="60"/>`+text(x+22,y,`R${n}`)+text(x+22,y+23,ohm(value));
 const dot=(x,y)=>`<circle class="junction" cx="${x}" cy="${y}" r="4"/>`;
 const arrow=(x,y,dx,dy,label)=>line(`M${x} ${y}l${dx} ${dy}`)+line(dx?`M${x+dx-7} ${y-5}l7 5 -7 5`:`M${x-5} ${y+dy-7}l5 7 5 -7`)+text(x+(dx?dx/2:-10),y+(dx?-12:dy/2),label,'current',dx?'middle':'end');
 const source=(label)=>line('M65 85V157 M65 213V320')+'<circle cx="65" cy="185" r="28"/>'+text(65,179,'+','','middle')+text(65,203,'−','','middle')+text(20,246,label)+text(20,270,fmt(s.v)+' V');
 let content='';
 if(cascade){
 content=source(sub('v','in'))+line('M65 85H160 M270 85H450 M560 85H710V135 M710 245V320H65 M370 85V135 M370 245V320')+rh(215,85,1,s.r1)+rh(505,85,3,s.r3)+rv(370,190,2,s.r2)+rv(710,190,4,s.r4)+dot(370,85)+dot(370,320)+dot(710,85)+dot(710,320);
 content+=text(370,40,sub('v','1')+(readings?' = '+fmt(m.v1)+' V':''),'node','middle')+text(735,65,sub('v','out')+(readings?' = '+fmt(m.out)+' V':''),'node');
 content+=arrow(145,145,100,0,sub('I','1')+(readings?' = '+fmt(m.currents[0]*1000)+' mA':''))+arrow(322,167,0,54,sub('I','2'))+arrow(450,145,100,0,sub('I','3')+(readings?' = '+fmt(m.currents[2]*1000)+' mA':''))+arrow(855,170,0,55,sub('I','4'));
 content+=text(735,108,'+')+text(735,310,'−')+text(390,108,'+')+text(390,310,'−');
 }else{
 const a=second?3:1,b=second?4:2,ra=second?s.r3:s.r1,rb=second?s.r4:s.r2,i=second?1:0;
 content=source(sub('v',second?'2':'in'))+line('M65 85H230V90 M230 200V205 M230 315V320H65')+rv(230,145,a,ra)+rv(230,260,b,rb)+dot(230,200)+line('M230 200H315');
 content+=text(315,182,sub('v',second?'out':'1'),'node')+text(315,207,readings?fmt(m.separate[i])+' V':'','node')+text(200,215,'+')+text(200,317,'−');
 content+=arrow(104,52,80,0,'I'+(readings?' = '+fmt(m.sepI[i]*1000)+' mA':''));
 }
 content+=line('M140 320v15 m-16 0h32 m-25 7h18 m-13 7h8')+text(cascade?485:280,365,'Riferimento: 0 V','','middle');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 385" role="img" aria-label="${cascade?'Due partitori collegati in cascata':second?'Secondo partitore isolato':'Primo partitore isolato'}"><g class="wires">${content}</g></svg>`;
}
const api={solve,fmt,ohm,diagram};if(typeof module==='object'&&module.exports)module.exports=api;else root.CascadeModel=api;
})(typeof window==='object'?window:globalThis);
