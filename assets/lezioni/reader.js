// PDF.js is vendored locally; render long pages in bounded, lazy canvas strips.
const reader=document.querySelector('.lesson-reader');
if(reader){
 const scroll=reader.querySelector('.lesson-scroll'),pages=reader.querySelector('.lesson-pages'),status=reader.querySelector('.lesson-status'),zoom=reader.querySelector('.lesson-zoom');
 let pdf,scale=1,fit=true,generation=0,observer,timer;const jobs=new Set();
 const button=action=>reader.querySelector(`[data-action="${action}"]`);
 function message(text){status.textContent=text;}
 async function layout(preserve=true){
  if(!pdf)return;const version=++generation,ratio=scroll.scrollTop/Math.max(1,pages.scrollHeight);
  observer?.disconnect();for(const job of jobs)job.cancel();jobs.clear();pages.replaceChildren();
  const first=await pdf.getPage(1);if(version!==generation)return;
  if(fit)scale=Math.max(.1,(scroll.clientWidth-24)/first.getViewport({scale:1}).width);
  zoom.textContent=Math.round(scale*100)+'%';button('out').disabled=scale<=.15;button('in').disabled=scale>=4;button('fit').disabled=false;
  const tiles=[];
  for(let n=1;n<=pdf.numPages;n++){
   const page=await pdf.getPage(n);if(version!==generation)return;
   const viewport=page.getViewport({scale}),container=document.createElement('div');container.className='lesson-page';container.style.width=viewport.width+'px';container.setAttribute('aria-label',`Pagina ${n}`);
   for(let top=0;top<Math.ceil(viewport.height);top+=768){
    const height=Math.min(768,Math.ceil(viewport.height)-top),tile=document.createElement('div');tile.className='lesson-tile';tile.style.height=height+'px';container.append(tile);tiles.push({tile,page,viewport,top,height,busy:false,task:null});
   }pages.append(container);
  }
  if(preserve)scroll.scrollTop=ratio*pages.scrollHeight;
  const byElement=new Map(tiles.map(t=>[t.tile,t]));
  observer=new IntersectionObserver(entries=>{for(const entry of entries){const t=byElement.get(entry.target);if(!t)continue;
   if(entry.isIntersecting)render(t,version);else if(!t.busy){t.tile.replaceChildren();}
  }},{root:scroll,rootMargin:'800px 0px'});
  tiles.forEach(t=>observer.observe(t.tile));message(`${pdf.numPages} pagina${pdf.numPages===1?'':'e'} · Scorrimento continuo`);
 }
 async function render(t,version){
  if(t.busy||t.tile.firstChild||version!==generation)return;t.busy=true;
  const canvas=document.createElement('canvas'),dpr=Math.min(window.devicePixelRatio||1,2,4096/t.viewport.width);
  canvas.width=Math.ceil(t.viewport.width*dpr);canvas.height=Math.ceil(t.height*dpr);canvas.style.width='100%';canvas.style.height=t.height+'px';canvas.setAttribute('aria-hidden','true');
  const task=t.page.render({canvasContext:canvas.getContext('2d'),viewport:t.viewport,transform:[dpr,0,0,dpr,0,-t.top*dpr]});t.task=task;jobs.add(task);
  try{await task.promise;if(version===generation)t.tile.append(canvas);}catch(e){if(e.name!=='RenderingCancelledException'){message('Non riesco a visualizzare una parte del documento. Puoi aprire o scaricare il PDF dai pulsanti sopra.');console.error(e);}}finally{jobs.delete(task);t.busy=false;t.task=null;}
 }
 button('in').onclick=()=>{fit=false;scale=Math.min(4,scale*1.25);layout()};
 button('out').onclick=()=>{fit=false;scale=Math.max(.15,scale/1.25);layout()};
 button('fit').onclick=()=>{fit=true;scroll.scrollLeft=0;layout()};
 function fullLabel(){button('full').textContent=document.fullscreenElement===reader||reader.classList.contains('lesson-expanded')?'Esci da schermo intero':'Schermo intero';}
 button('full').onclick=async()=>{
  if(document.fullscreenElement===reader)await document.exitFullscreen();
  else if(reader.classList.contains('lesson-expanded')){reader.classList.remove('lesson-expanded');document.body.classList.remove('lesson-open');}
  else {try{if(!reader.requestFullscreen)throw new Error('fallback');await reader.requestFullscreen();}catch{reader.classList.add('lesson-expanded');document.body.classList.add('lesson-open');}}
  fullLabel();if(pdf)layout();
 };
 document.addEventListener('fullscreenchange',()=>{fullLabel();if(pdf)layout()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&reader.classList.contains('lesson-expanded'))button('full').click()});
 new ResizeObserver(()=>{clearTimeout(timer);timer=setTimeout(()=>{if(pdf&&fit)layout()},180)}).observe(scroll);
 (async()=>{try{
  const lib=await import('../vendor/pdfjs/pdf.mjs');lib.GlobalWorkerOptions.workerSrc=new URL('../vendor/pdfjs/pdf.worker.mjs',import.meta.url).href;
  pdf=await lib.getDocument({url:new URL(reader.dataset.pdf,location.href).href,isEvalSupported:false}).promise;
  await layout(false);
 }catch(e){message('Il lettore non è disponibile in questo browser. Usa «Apri il PDF separatamente» o «Scarica il PDF originale».');console.error(e);}})();
}
