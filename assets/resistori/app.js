(()=>{'use strict';const root=document.getElementById('resistor-lab');if(!root)return;
const M=window.ResistorModel,$=id=>document.getElementById('resistor-'+id);
let state={mode:'voltage',voltage:12,current:6,r1:1,r2:2,view:'both'};
const limits={voltage:[0,50],current:[0,50],r1:[.1,100],r2:[.1,100]};
for(const [key,label,unit,step,steps] of [['voltage','Tensione imposta','V',1,[.1,.5,1,5]],['current','Corrente imposta','mA',1,[.1,.5,1,5]],['r1','Resistenza R₁','kΩ',.1,[.01,.1,.5,1,10]],['r2','Resistenza R₂','kΩ',.1,[.01,.1,.5,1,10]]]){
 const title=key==='voltage'?'Tensione imposta v_in':key==='current'?'Corrente imposta I_tot':label,[min,max]=limits[key],box=document.createElement('div');box.id='resistor-control-'+key;box.className='resistor-control';
 box.innerHTML=`<label for="resistor-${key}">${title.replace("v_in", "v<sub>in</sub>").replace("I_tot", "I<sub>tot</sub>")} (${unit})</label><input id="resistor-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${state[key]}"><div class="resistor-value-row"><input id="resistor-${key}-n" type="number" min="${min}" max="${max}" step="any" value="${state[key]}" aria-label="${title} in ${unit}"><span class="resistor-arrows"><button type="button" id="resistor-${key}-up" aria-label="Aumenta ${title}">▲</button><button type="button" id="resistor-${key}-down" aria-label="Diminuisci ${title}">▼</button></span><label>Passo<select id="resistor-${key}-step" aria-label="Passo ${title}">${steps.map(n=>`<option value="${n}" ${n===step?'selected':''}>${M.fmt(n)}</option>`).join('')}</select></label></div>`;
 $('controls').append(box);
 const apply=n=>{if(!Number.isFinite(n)||n<min||n>max){$(key+'-n').setCustomValidity(`Inserisci un valore tra ${min} e ${max}`);return;}$(key+'-n').setCustomValidity('');state[key]=n;$(key).value=n;$(key+'-n').value=n;draw();};
 $(key).oninput=()=>apply($(key).valueAsNumber);$(key+'-n').oninput=()=>apply($(key+'-n').valueAsNumber);
 const nudge=sign=>apply(Math.min(max,Math.max(min,Number((state[key]+sign*Number($(key+'-step').value)).toFixed(10)))));
 $(key+'-up').onclick=()=>nudge(1);$(key+'-down').onclick=()=>nudge(-1);
 $(key+'-n').onkeydown=e=>{if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();nudge(e.key==='ArrowUp'?1:-1);}};
 $(key+'-step').onchange=()=>{$(key).step=$(key+'-step').value;};
}
function draw(){
 const css=getComputedStyle(root),palette={text:css.getPropertyValue('--testo').trim(),one:css.getPropertyValue('--c-elettronici').trim(),two:css.getPropertyValue('--c-sistemi-automatici').trim(),bg:css.getPropertyValue('--superficie').trim()},input=state[state.mode],notes=[];
 for(const kind of ['series','parallel']){
  $(kind).hidden=state.view!=='both'&&state.view!==kind;
  $(kind+'-svg').innerHTML=M.diagram(kind,state.mode,input,state.r1,state.r2,palette);
  const m=M.solve(kind,state.mode,input,state.r1,state.r2);
  notes.push(`${kind==='series'?'Serie':'Parallelo'}: v in ${M.fmt(m.vin)} volt, I totale ${M.fmt(m.itot)} milliampere, V1 ${M.fmt(m.v1)} volt, V2 ${M.fmt(m.v2)} volt, I1 ${M.fmt(m.i1)} milliampere, I2 ${M.fmt(m.i2)} milliampere.`);
 }
 $('control-voltage').hidden=state.mode!=='voltage';$('control-current').hidden=state.mode!=='current';
 $('constraint').innerHTML=state.mode==='voltage'?'<strong>Il generatore mantiene v<sub>in</sub> costante.</strong> I<sub>tot</sub> dipende dal collegamento e dalle resistenze.':'<strong>Il generatore mantiene I<sub>tot</sub> costante.</strong> v<sub>in</sub> dipende dal collegamento e dalle resistenze.';
 $('series-note').innerHTML=state.mode==='voltage'?'A tensione imposta, le resistenze determinano la corrente comune e la ripartizione della tensione.':'A corrente imposta, V₁ = I<sub>tot</sub> R₁ e V₂ = I<sub>tot</sub> R₂: il generatore adatta la tensione totale.';
 $('parallel-note').textContent=state.mode==='voltage'?'A tensione imposta, ogni resistenza determina la corrente nel proprio ramo; la tensione ai capi resta invariata.':'A corrente totale imposta, le resistenze determinano sia la tensione comune sia la ripartizione della corrente.';
 $('readings').textContent=notes.join(' ');
 root.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===state.view)));
}
root.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{state.view=b.dataset.view;draw()});
$('source').onchange=()=>{state.mode=$('source').value;draw()};
$('reset').onclick=()=>{state={mode:'voltage',voltage:12,current:6,r1:1,r2:2,view:'both'};$('source').value='voltage';for(const key of Object.keys(limits)){$(key).value=state[key];$(key+'-n').value=state[key];$(key+'-n').setCustomValidity('');}draw()};
$('full').onclick=async()=>{if(root.classList.contains('resistor-expanded')){root.classList.remove('resistor-expanded');document.body.classList.remove('resistor-open');$('full').textContent='Schermo intero';}else if(document.fullscreenElement===root)await document.exitFullscreen();else{try{await root.requestFullscreen();}catch{root.classList.add('resistor-expanded');document.body.classList.add('resistor-open');$('full').textContent='Esci da schermo intero';}}};
document.addEventListener('fullscreenchange',()=>{$('full').textContent=document.fullscreenElement===root?'Esci da schermo intero':'Schermo intero';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('resistor-expanded')){$('full').click();}});
new MutationObserver(()=>setTimeout(draw,100)).observe(document.body,{attributes:true,attributeFilter:['class']});
document.querySelectorAll('link.quarto-color-scheme').forEach(l=>new MutationObserver(()=>setTimeout(draw,100)).observe(l,{attributes:true}));draw();
})();
