import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const source=process.argv[2]||'C:/Users/dboni/Documents/GitHub/Insegnamento/ITIS_2026/Programmi';
const courses=[['tpsee-elettronici','TPSEE · Elettronici','3C ELETTRONICI/TPSEE/TPSEE_3C_ENC_Dispensa.tex'],['tpsee-elettrotecnici','TPSEE · Elettrotecnici','3A ELETTROTECNICI/TPSEE/TPSEE_3A_ETC_Dispensa.tex'],['sistemi-automatici','Sistemi automatici','3A ELETTROTECNICI/SISTEMI AUTOMATICI/Sistemi_Automatici_3A_ETC_Dispensa.tex'],['domotica','Domotica e automazione','5B ELETTROTECNICI/DOMOTICA E AUTOMAZIONE/Domotica_Automazione_5A_ETC_Dispensa.tex']];
const pandoc='C:/Users/dboni/AppData/Local/Programs/Quarto/bin/tools/pandoc.exe';
const latex='D:/Programmi/MikTex/miktex/bin/x64/pdflatex.exe';
const cairo='D:/Programmi/MikTex/miktex/bin/x64/pdftocairo.exe';
function arg(s,p,open='{',close='}') {while(/\s/.test(s[p]||'')&&p<s.length)p++; if(s[p]!==open)return null;let start=++p,d=1;for(;p<s.length;p++){if(s[p]==='\\'){p++;continue}if(s[p]===open)d++;if(s[p]===close&&!--d)return [s.slice(start,p),p+1]}return null;}
function cmd(s,name,n,fn,opt=false){let re=new RegExp('\\\\'+name+'(?![A-Za-z])','g'),out='',last=0,m;while((m=re.exec(s))){let p=re.lastIndex,a=[];if(opt){let o=arg(s,p,'[',']');if(o)p=o[1];}for(let k=0;k<n;k++){let q=arg(s,p);if(!q)break;a.push(q[0]);p=q[1]}if(a.length!==n)continue;out+=s.slice(last,m.index)+fn(...a);last=p;re.lastIndex=p;}return out+s.slice(last)}
function plain(s){return s.replace(/\\[A-Za-z]+\*?/g,'').replace(/[{}]/g,'').replace(/\s+/g,' ').trim()}
function md(s){let r=spawnSync(pandoc,['-f','latex','-t','markdown-raw_tex','--wrap=none'],{input:s,encoding:'utf8',maxBuffer:20e6});if(r.status)throw Error(r.stderr);return r.stdout;}
const report=[];
for(const [slug,title,file] of courses){
 const src=path.join(source,file),tex=fs.readFileSync(src,'utf8'),preamble=tex.split('\\begin{document}')[0];
 const dir=path.join(root,'corsi',slug),assets=path.join(root,'assets','dispense',slug);fs.mkdirSync(dir,{recursive:true});fs.mkdirSync(assets,{recursive:true});
 let gloss={};cmd(preamble,'GlossDeclare',3,(id,name,def)=>{gloss[id]={name,def};return ''});
 let body=tex.split('\\end{titlepage}')[1]||tex.split('\\begin{document}')[1];body=body.split('\\IfFileExists{Guida_Fanucchi')[0].split('\\IfFileExists{TPSEE_Inserto')[0].split('\\end{document}')[0];
 body=body.replace(/(?<!\\)%[^\n]*/g,'');
 body=body.replace(/\\begin\{Form\}|\\end\{Form\}/g,'');
 // Remove the original print-only contents box, with obsolete Drive link.
 body=body.replace(/\\begin\{tcolorbox\}[\s\S]*?\\end\{tcolorbox\}/g,'');
 // Safety chapters explicitly marked for adaptation are not teaching resources ready for publication.
 body=body.replace(/\\section\[\s*Sicurezza[\s\S]*?(?=\\modulo\{1\})/g,'');
 const figs=[];
 body=body.replace(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}|\\GateRow\{[^}]+\}/g,x=>{figs.push(x);return '\\par FIGURETOKEN'+figs.length+'ENDTOKEN \\par';});
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dispense-figures-'));
 if(figs.length){
 let minimal='\\documentclass[tikz,multi,border=3pt]{standalone}\\usepackage[T1]{fontenc}\\usepackage[utf8]{inputenc}\\usepackage{amsmath,amssymb,graphicx}\\usetikzlibrary{arrows.meta,positioning,calc,shapes.geometric,shapes.gates.logic.US,shapes.gates.logic.IEC,circuits.ee.IEC}'+(preamble.match(/\\definecolor\{[^\n]+/g)||[]).join('\n')+(preamble.match(/\\tikzset\{[^\n]+/g)||[]).join('\n')+'\\newcommand{\\GlossTerm}[2]{#2}\\newcommand{\\udref}[1]{U.D. #1}'; let gate=preamble.indexOf('\\newcommand{\\GateRow}');if(gate>=0){let ga=arg(preamble,gate+'\\newcommand{\\GateRow}[1]'.length);if(ga)minimal+='\\newcommand{\\GateRow}[1]{'+ga[0]+'}';}minimal+='\\graphicspath{{assets/}}'+(preamble.match(/\\newcommand\{\\(?:NO|NC|COIL)\}[^\n]+/g)||[]).join('\n');let pre=minimal+'\n\\renewcommand{\\GlossTerm}[2]{#2}\n';
 fs.writeFileSync(path.join(tmp,'figures.tex'),pre+'\\begin{document}\n'+figs.join('\n')+'\n\\end{document}');
 const r=spawnSync(latex,['--disable-installer','-interaction=nonstopmode','-halt-on-error','-output-directory='+tmp,path.join(tmp,'figures.tex')],{cwd:path.dirname(src),encoding:'utf8',timeout:120000,maxBuffer:10e6});
 if(r.status===0) {let rr=spawnSync(cairo,['-png','-r','140',path.join(tmp,'figures.pdf'),path.join(tmp,'figure')],{encoding:'utf8',timeout:120000});if(rr.status!==0)console.log(rr.stderr);}
 else console.log(slug+' FIGURES FAILED '+r.stdout?.slice(-1400));
 }
 const pngs=fs.readdirSync(tmp).filter(x=>/^figure-\d+\.png$/.test(x)).sort((a,b)=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0]));
 if(pngs.length===figs.length)pngs.forEach((x,i)=>fs.copyFileSync(path.join(tmp,x),path.join(assets,'figura-'+(i+1)+'.png')));
 const imagesOK=pngs.length===figs.length;
 body=cmd(body,'GlossTerm',2,(id,text)=>'\\href{glossario.qmd\\#gloss-'+id+'}{'+text+'}');
 body=cmd(body,'GlossRow',1,()=> '');
 body=body.replace(/\\section\*\{Glossario[\s\S]*?(?=\\section(?:\{|\[)|\\modulo)/,'');
 body=cmd(body,'modulo',3,(id,t,sub)=>'\n\\section{Modulo '+id+' / '+t+'}\\label{mod:'+id+'}\n\\textbf{'+sub+'}\n');
 body=cmd(body,'ud',2,(id,t)=>'\\subsection{U.D. '+id+' / '+t+'}\\label{ud:'+id+'}');
 body=cmd(body,'udref',1,id=>'\\hyperref[ud:'+id+']{U.D. '+id+'}');
 body=cmd(body,'thematicsection',1,t=>'\\subsection{'+t+'}');
 body=cmd(body,'capfig',1,t=>'\\par\\emph{'+t+'}\\par');
 body=cmd(body,'setcurrentmodule',1,()=> '');body=cmd(body,'addcontentsline',3,()=> '');body=cmd(body,'pdfbookmark',2,()=>'',true);
 for(let name of ['hypersetup','Needspace','setlength','renewcommand'])body=cmd(body,name,name==='setlength'||name==='renewcommand'?2:1,()=> '');
 body=body.replace(/\\(?:CourseCartoonBackground)\{[^}]*\}|\\(?:CourseCartoonPage|tableofcontents|clearpage|newpage|phantomsection|begingroup|endgroup)\b/g,'');
 body=body.replace(/\\begin\{(idea|esempio)\}(?:\[([^\]]*)\])?/g,(_,e,t)=>'\n\\paragraph{'+(t||(e==='idea'?'Idea chiave':'Esempio guidato'))+'}\n');
 body=body.replace(/\\begin\{laboratorio\}\{([^}]*)\}/g,'\n\\paragraph{$1}\n').replace(/\\end\{(?:idea|esempio|laboratorio)\}/g,'\n');
 let converted=md(body);converted=converted.replace(/\\href\{glossario\.qmd#[^}]+\}\{([^}]+)\}/g,'$1');
 converted=converted.replace(/FIGURETOKEN(\d+)ENDTOKEN/g,(_,n)=>imagesOK?'![Schema didattico '+n+'](/assets/dispense/'+slug+'/figura-'+n+'.png){fig-alt="Schema didattico '+n+' della dispensa '+title+'"}':'**Schema '+n+':** consulta la figura nella [dispensa PDF](/downloads/'+slug+'.pdf).');
 // Pandoc retains LaTeX hyperref targets as internal links. Repoint across page boundaries below.
 let sections=converted.split(/(?=^# )/m).filter(x=>x.trim());let pages=[];
 for(let section of sections){let h=section.match(/^# (.*?)(?:\s*\{([^}]*)\})?\s*$/m);if(!h)continue;let t=h[1].replace(/\[([^\]]+)\]\([^)]*\)/g,'$1');let mod=t.match(/^Modulo (\d+)/);let stem=mod?'modulo-'+mod[1]:t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');if(stem.startsWith('la-mappa'))stem='percorso';pages.push({file:stem+'.qmd',title:t,body:section});}
 let targets={};for(let page of pages)for(let m of page.body.matchAll(/\{#([^}\s]+)[^}]*\}/g))targets[m[1]]=page.file;
 for(let page of pages){let text=page.body.replace(/\]\(#([^)]*)\)/g,(all,id)=>targets[id]?']('+targets[id]+'#'+id+')':all);text=text.replace(/glossario\.qmd\\?#/g,'glossario.qmd#');text=text.replace(/^\s*# [^\n]*\r?\n/,heading=>{const id=heading.match(/\{#([^}\s]+)/);return id?'[]{#'+id[1]+'}\n':'';});text=text.replace(/\]\(#app:sicurezza-itp\)/g,'](/downloads/'+slug+'.pdf)');fs.writeFileSync(path.join(dir,page.file),'---\ntitle: '+JSON.stringify(page.title)+'\n---\n\n[← Panoramica del corso](index.qmd) · [PDF completo](/downloads/'+slug+'.pdf)\n\n'+text);}
 let gtext='---\ntitle: Glossario\n---\n\n[← Panoramica del corso](index.qmd)\n\n';for(let [id,g] of Object.entries(gloss)){gtext+='## '+plain(g.name)+' {#gloss-'+id+'}\n\n'+md(g.def)+'\n';}fs.writeFileSync(path.join(dir,'glossario.qmd'),gtext);
 fs.writeFileSync(path.join(dir,'index.qmd'),'---\ntitle: '+JSON.stringify(title)+'\n---\n\nPanoramica del programma e materiali di riferimento per il corso. Questa versione ipertestuale riprende i contenuti della dispensa: unità didattiche, esempi, esercizi e approfondimenti. I moduli saranno ampliati durante l’anno.\n\n[Scarica la dispensa PDF](/downloads/'+slug+'.pdf){.btn .btn-primary}\n\n## Percorso di lettura\n\n'+pages.map(p=>'- ['+p.title+']('+p.file+')').join('\n')+'\n- [Glossario](glossario.qmd)\n');
 report.push({slug,pages:pages.length,glossary:Object.keys(gloss).length,figures:figs.length,rendered:imagesOK?pngs.length:0,temporary:tmp});console.log(JSON.stringify(report.at(-1)));
}
fs.mkdirSync(path.join(root,'documentazione'),{recursive:true});fs.writeFileSync(path.join(root,'documentazione','migrazione.md'),'# Migrazione delle dispense\n\nConversione dei contenuti LaTeX in pagine Quarto modulari. Le formule, gli esempi, gli esercizi, le soluzioni e le definizioni sono ripresi dai sorgenti.\n\n'+report.map(r=>'- '+r.slug+': '+r.pages+' sezioni, '+r.glossary+' definizioni, '+r.rendered+'/'+r.figures+' figure convertite.').join('\n')+'\n\n## Limiti e scelte editoriali\n\n- La guida ITP allegata alla dispensa di Elettronica resta consultabile nel PDF originale; non viene convertita in testo web.\n- Copertine, schede personali dei docenti e segnaposto delle guide di laboratorio non sono importati nelle pagine web.\n- Le sezioni di sicurezza esplicitamente marcate “Da riadattare” nei sorgenti non sono pubblicate come materiale definitivo.\n- Le figure sono immagini raster derivate dagli schemi originali, non ancora diagrammi accessibili con descrizioni dettagliate.\n- Gli elementi di impaginazione esclusivi del PDF (colonne, sfondi, intermezzi, intestazioni e sommari duplicati) sono sostituiti dalla navigazione web.\n- I PDF scaricabili restano le edizioni originali: il nuovo PDF dalla sorgente comune sarà configurato separatamente.\n');


