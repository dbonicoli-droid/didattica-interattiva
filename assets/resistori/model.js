(function(root){
'use strict';
function solve(kind,mode,input,r1,r2){
 if(!['series','parallel'].includes(kind)||!['voltage','current'].includes(mode)||![input,r1,r2].every(Number.isFinite)||input<0||r1<=0||r2<=0)throw new RangeError('Parametri non validi');
 // kOhm, V and mA: V / kOhm = mA.
 const req=kind==='series'?r1+r2:r1*r2/(r1+r2),vin=mode==='voltage'?input:input*req,itot=mode==='current'?input:input/req;
 const i1=kind==='series'?itot:vin/r1,i2=kind==='series'?itot:vin/r2;
 return {req,vin,itot,i1,i2,v1:i1*r1,v2:i2*r2};
}
const fmt=n=>(Math.abs(n)<1e-10?0:n).toLocaleString('it-IT',{maximumFractionDigits:3});
const sub=(a,b)=>`${a}<tspan baseline-shift="sub" font-size="70%">${b}</tspan>`;
function diagram(kind,mode,input,r1,r2,palette){
 const m=solve(kind,mode,input,r1,r2),{text,one,two,bg}=palette;
 const label=(x,y,t,c=text,anchor='start')=>`<text x="${x}" y="${y}" fill="${c}" text-anchor="${anchor}">${t}</text>`;
 const path=(d,c=text)=>`<path d="${d}" stroke="${c}" stroke-width="3" fill="none"/>`;
 const arrow=(x,y,vertical,c)=>vertical?path(`M${x} ${y}v40m-6 -8l6 8 6 -8`,c):path(`M${x} ${y}h48m-8 -6l8 6 -8 6`,c);
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" role="img" aria-label="Circuito ${kind==='series'?'serie':'parallelo'}, generatore di ${mode==='voltage'?'tensione':'corrente'}"><rect width="800" height="520" rx="12" fill="${bg}"/><g font-family="system-ui, sans-serif" font-size="22">`;
 svg+=path('M100 195V110H275 M100 265V385H500');
 svg+=`<circle cx="100" cy="230" r="35" fill="none" stroke="${text}" stroke-width="3"/>`;
 svg+=mode==='voltage'?label(100,219,'+',text,'middle')+label(100,255,'−',text,'middle'):path('M100 253V207m-7 10l7 -10 7 10');
 svg+=label(35,178,'+',text,'middle')+label(35,289,'−',text,'middle');
 svg+=label(24,430,`${sub('v','in')} = ${fmt(m.vin)} V`);
 svg+=arrow(146,81,false,text)+label(24,465,`${sub('I','tot')} = ${fmt(m.itot)} mA`);
 if(kind==='series'){
  svg+=path('M275 110H290 M400 110H500V200 M500 290V385');
  svg+=`<rect x="290" y="96" width="110" height="28" fill="none" stroke="${one}" stroke-width="3"/><rect x="486" y="200" width="28" height="90" fill="none" stroke="${two}" stroke-width="3"/>`;
  svg+=label(345,44,`${sub('R','1')} = ${fmt(r1)} kΩ`,one,'middle')+label(345,76,`${sub('V','1')} = ${fmt(m.v1)} V`,one,'middle');
  svg+=label(278,93,'+',one,'middle')+label(413,93,'−',one,'middle');
  svg+=arrow(313,151,false,one)+label(345,192,`${sub('I','1')} = ${fmt(m.i1)} mA`,one,'middle');
  svg+=label(530,208,`${sub('R','2')} = ${fmt(r2)} kΩ`,two)+label(530,243,`${sub('V','2')} = ${fmt(m.v2)} V`,two)+label(530,278,`${sub('I','2')} = ${fmt(m.i2)} mA`,two);
  svg+=label(472,192,'+',two)+label(472,311,'−',two)+arrow(547,304,true,two);
 }else{
  svg+=path('M275 110H540V200 M540 290V385H500 M330 110V200 M330 290V385');
  for(const [x,r,v,i,c,index] of [[330,r1,m.v1,m.i1,one,1],[540,r2,m.v2,m.i2,two,2]]){
   svg+=`<rect x="${x-14}" y="200" width="28" height="90" fill="none" stroke="${c}" stroke-width="3"/><circle cx="${x}" cy="110" r="5" fill="${text}"/><circle cx="${x}" cy="385" r="5" fill="${text}"/>`;
   svg+=label(x+27,202,`${sub('R',index)} = ${fmt(r)} kΩ`,c)+label(x+27,243,`${sub('V',index)} = ${fmt(v)} V`,c)+label(x+27,284,`${sub('I',index)} = ${fmt(i)} mA`,c);
   svg+=label(x-32,192,'+',c)+label(x-32,310,'−',c)+arrow(x+38,309,true,c);
  }
 }
 svg+=label(780,430,`${sub('R','eq')} = ${fmt(m.req)} k\u03a9`,text,'end');
 svg+=label(780,465,kind==='series'?`${sub('V','1')} + ${sub('V','2')} = ${fmt(m.vin)} V`:`${sub('I','1')} + ${sub('I','2')} = ${fmt(m.itot)} mA`,text,'end');
 return svg+'</g></svg>';
}
const api={solve,diagram,fmt};if(typeof module==='object')module.exports=api;else root.ResistorModel=api;
})(globalThis);
