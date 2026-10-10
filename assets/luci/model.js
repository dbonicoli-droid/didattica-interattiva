(function(root){'use strict';
function lamp(s){if(s.length!==3||s.some(n=>n!==0&&n!==1))throw new RangeError('Tre posizioni 0/1 richieste');return (s[0]^s[1])===s[2];}
const initial=()=>({on:false,pressed:null,impulses:0,last:null});
function relay(state,event){if(event.type==='reset')return initial();if(event.type==='release')return {...state,pressed:null};if(event.type==='press'){if(![0,1,2].includes(event.index))throw new RangeError('Pulsante non valido');if(state.pressed!==null)return state;return {on:!state.on,pressed:event.index,impulses:state.impulses+1,last:event.index};}throw new RangeError('Evento non valido');}
const path=(d,active=false,cl='')=>`<path class="wire ${active?'active ':''}${cl}" d="${d}"/>`;
const text=(x,y,t,cl='',anchor='start')=>`<text class="${cl}" x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
const terminal=(x,y)=>`<circle class="terminal" cx="${x}" cy="${y}" r="5"/>`;
function bulb(x,y,on){return `<circle class="bulb ${on?'lit':''}" cx="${x}" cy="${y}" r="27"/><path class="wire" d="M${x-17} ${y-17}l34 34 m0 -34l-34 34"/>`;}
function switchesSvg(s){const on=lamp(s),selected=s[0]^s[1],ys=[115,225];
let a=text(36,175,'L','supply')+text(1052,175,'N','supply')+text(195,50,'S1 · Deviatore','','middle')+text(575,50,'S2 · Invertitore','','middle')+text(810,50,'S3 · Deviatore','','middle')+text(960,95,'L1','','middle');
a+=`<rect class="device-box" x="450" y="75" width="250" height="190" rx="12"/>`;
a+=path('M55 170H125',on)+path(`M125 170L230 ${ys[s[0]]}`,on);
for(let i=0;i<2;i++)a+=path(`M230 ${ys[i]}H480`,on&&i===s[0]);
if(s[1]===0){for(let i=0;i<2;i++)a+=path(`M480 ${ys[i]}H660`,on&&i===s[0]);}
else{
a+=path('M480 225L660 115',on&&s[0]===1);
a+=`<path class="cross-clear" d="M480 115L660 225"/>`+path('M480 115L660 225',on&&s[0]===0);
a+=text(575,290,'Incrocio senza nodo','','middle');
}
for(let i=0;i<2;i++)a+=path(`M660 ${ys[i]}H775`,on&&i===selected);
a+=path(`M775 ${ys[s[2]]}L850 170`,on)+path('M850 170H933 M987 170H1040',on)+bulb(960,170,on);
for(const [x,y]of [[125,170],[230,115],[230,225],[480,115],[480,225],[660,115],[660,225],[775,115],[775,225],[850,170]])a+=terminal(x,y);
a+=text(190,325,`s₁ = ${s[0]} · ${s[0]?'inferiore':'superiore'}`,'','middle')+text(575,325,`s₂ = ${s[1]} · ${s[1]?'incrociato':'diretto'}`,'','middle')+text(825,325,`s₃ = ${s[2]} · ${s[2]?'inferiore':'superiore'}`,'','middle');
return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 365" role="img" aria-label="Due deviatori e un invertitore: lampada ${on?'accesa':'spenta'}">${a}</svg>`;
}
function relaySvg(s){const coil=s.pressed!==null;let a=text(35,40,'Circuito di comando')+text(35,193,'L','supply')+text(965,193,'N','supply');
a+=path('M55 185H110',coil)+path('M110 95V275 M550 95V275')+path('M550 185H710',coil);
if(coil)a+=path(`M110 185V${95+s.pressed*90} M550 ${95+s.pressed*90}V185`,true);
for(let i=0;i<3;i++){const y=95+i*90,pressed=s.pressed===i;a+=path(`M110 ${y}H295`,pressed)+path(`M295 ${y}L${pressed?365:355} ${pressed?y:y-22}`,pressed)+path(`M365 ${y}H550`,pressed)+terminal(295,y)+terminal(365,y)+text(315,y-40,`S${i+1} · NO`,'','middle');a+=`<path class="actuator" d="M330 ${y-32}v12 m-14 0h28"/>`;a+=`<circle class="junction" cx="110" cy="${y}" r="4"/><circle class="junction" cx="550" cy="${y}" r="4"/>`;}
a+=`<rect class="coil ${coil?'energized':''}" x="710" y="162" width="95" height="46"/>`+text(757,192,'K1','','middle')+text(697,145,'A1','','middle')+text(820,145,'A2','','middle')+path('M805 185H950',coil);
a+=text(757,245,coil?'Bobina alimentata':'Bobina non alimentata',coil?'active-text':'','middle');
a+=`<path class="mechanism" d="M757 210V315H330V365"/>`+text(510,303,'Collegamento meccanico','','middle');
a+=text(35,357,'Circuito della lampada')+text(35,413,'L','supply')+text(965,413,'N','supply');
a+=path('M55 405H295',s.on)+path(`M295 405L${s.on?365:355} ${s.on?405:382}`,s.on)+terminal(295,405)+terminal(365,405)+path('M365 405H743 M797 405H950',s.on)+bulb(770,405,s.on);
a+=text(272,445,'11')+text(358,445,'14')+text(325,475,'K1 · contatto','','middle')+text(770,353,'L1','','middle');
return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 495" role="img" aria-label="Relè passo-passo: bobina ${coil?'alimentata':'non alimentata'}, contatto ${s.on?'chiuso':'aperto'}, lampada ${s.on?'accesa':'spenta'}">${a}</svg>`;
}
const api={lamp,initial,relay,switchesSvg,relaySvg};if(typeof module==='object'&&module.exports)module.exports=api;else root.LightLabModel=api;
})(globalThis);
