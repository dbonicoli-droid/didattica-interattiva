/* Esercizi locali: nessun salvataggio o invio delle risposte. */
document.querySelectorAll('.classification-exercise').forEach(ex => {
 const table = ex.querySelector('table');
 if (!table) return;
 const solution = ex.querySelector('.classification-solutions');
 const details = solution.querySelector('details');
 const rows = [...table.tBodies[0].rows];
 const labels = [...table.tHead.rows[0].cells].slice(1).map(c=>c.textContent.trim());
 let showing = false, saved;
 const status = document.createElement('p'); status.setAttribute('role','status'); status.className='exercise-status';
 rows.forEach((row, r) => {
   row.querySelectorAll('.answer-cell').forEach((cell,c) => {
     const input=document.createElement('input'); input.type='checkbox';
     input.setAttribute('aria-label',`${labels[c]}: ${row.cells[0].querySelector('strong').textContent}`);
     cell.replaceChildren(input);
     input.addEventListener('change',()=>{row.dataset.confirmed='false'; confirm.textContent='Conferma riga'; result.textContent=''; status.textContent='';});
   });
   const confirm=document.createElement('button'); confirm.type='button'; confirm.className='confirm-row'; confirm.textContent='Conferma riga';
   const result=document.createElement('span'); result.className='row-result'; result.setAttribute('role','status');
   confirm.addEventListener('click',()=>{row.dataset.confirmed='true';confirm.textContent='Riga confermata'; result.textContent='';});
   row.cells[0].append(confirm,result);
 });
 const inputs=[...table.querySelectorAll('input')];
 const toolbar=document.createElement('div'); toolbar.className='exercise-toolbar';
 function button(label,fn) {const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);toolbar.append(b);return b;}
 const verify=button('Verifica risposte',()=>{
   let correct=0, pending=0;
   rows.forEach(row=>{const result=row.querySelector('.row-result'); if(row.dataset.confirmed!=='true'){pending++;result.textContent='Da confermare';return;}
     const ok=[...row.querySelectorAll('.answer-cell')].every(c=>c.querySelector('input').checked===(c.dataset.answer==='true'));
     result.textContent=ok?'✓ Corretto':'Rivedi le proprietà';if(ok)correct++;
   });
   status.textContent=`${correct} righe corrette su ${rows.length}. ${pending ? pending+' ancora da confermare.' : 'Puoi consultare le motivazioni nella soluzione.'}`;
 });
 const toggle=button('Mostra soluzione',()=>{
   if(!showing){saved={values:inputs.map(i=>i.checked),confirmed:rows.map(r=>r.dataset.confirmed)}; inputs.forEach(i=>{i.checked=i.parentElement.dataset.answer==='true';i.disabled=true;});details.open=true;}
   else {inputs.forEach((i,n)=>{i.checked=saved.values[n];i.disabled=false;});rows.forEach((r,n)=>r.dataset.confirmed=saved.confirmed[n]||'false');details.open=false;}
   showing=!showing; verify.disabled=showing;rows.forEach(r=>r.querySelector('.confirm-row').disabled=showing);
   toggle.textContent=showing?'Torna alle mie risposte':'Mostra soluzione';status.textContent=showing?'Soluzione visualizzata. Le tue risposte sono conservate fino al ritorno all’esercizio.':'';
   rows.forEach(r=>r.querySelector('.row-result').textContent='');
 });
 button('Ricomincia',()=>{if(showing)toggle.click();inputs.forEach(i=>i.checked=false);rows.forEach(r=>{r.dataset.confirmed='false';r.querySelector('.confirm-row').textContent='Conferma riga';r.querySelector('.row-result').textContent='';});status.textContent='Esercizio azzerato.';details.open=false;});
 function print(answers) {
   document.getElementById('classification-print')?.remove();
   const sheet=document.createElement('section');sheet.id='classification-print';
   const title=document.createElement('h1');title.textContent=answers?'Classificazione dei sistemi — soluzioni':'Classificazione dei sistemi — esercizio';sheet.append(title);
   const copy=table.cloneNode(true);copy.querySelectorAll('.confirm-row,.row-result').forEach(x=>x.remove());
   copy.querySelectorAll('.answer-cell').forEach(c=>c.textContent=answers?(c.dataset.answer==='true'?'✓':'—'):'□');sheet.append(copy);
   if(answers){const notes=solution.cloneNode(true); notes.querySelector('details').open=true;sheet.append(notes);}
   document.body.append(sheet);document.body.classList.add('printing-classification');
   const cleanup=()=>{document.body.classList.remove('printing-classification');sheet.remove();};
   window.addEventListener('afterprint',cleanup,{once:true});window.print();
 }
 button('Stampa esercizio',()=>print(false));button('Stampa soluzioni',()=>print(true));
 ex.insertBefore(toolbar,table.parentElement.classList.contains('cell-output-display')?table.parentElement:table);toolbar.after(status);
});
