# Didattica interattiva

Materiali di Daniele Bonicoli per l'ITIS Galileo Galilei di Livorno, A.S. 2026–2027. Sito didattico personale, non sito istituzionale della scuola.

## Lavorare in VS Code
Aprire questa cartella. Sono richiesti Quarto e Git; Node.js serve al controllo e all'esportazione della figura della simulazione RC.

- Anteprima: `quarto preview`
- Generazione: `quarto render`
- Verifica app e rigenerazione figura RC: `node scripts/check_rc.cjs`

I medesimi comandi sono disponibili nelle attività VS Code.

## Struttura
- `corsi/`: sorgenti Quarto delle quattro dispense, suddivisi per argomento.
- `laboratori/`: attività guidate e app HTML autonome.
- `assets/`: schemi, immagini e configurazioni degli esempi.
- `downloads/`: edizioni PDF distribuite agli studenti.
- `documentazione/`: note tecniche non incluse nel sito.

## Pubblicare quando si decide
Salvare e caricare i sorgenti su GitHub non aggiorna automaticamente il sito. Aprire **Actions → Pubblica sito → Run workflow** per generare e pubblicare una nuova versione. Il sito è ospitato da GitHub Pages usando GitHub Actions.

## Contenuti e stato
Le dispense iniziali costituiscono una panoramica del programma. La migrazione web conserva testi, formule e schemi; consultare `documentazione/migrazione.md` per i limiti. Gli appunti OneNote entrano dopo revisione come PDF e immagini. Le fonti dei libri e i dati degli studenti devono rimanere fuori da questo repository pubblico.

I PDF iniziali sono le edizioni precedenti. Il flusso di esportazione dei nuovi moduli e delle raccolte cumulative sarà verificato sul modello editoriale definitivo. L'app RC prevede già il contenuto alternativo statico per PDF.

## Aggiungere un modulo
Creare un file `.qmd` nella cartella del corso, aggiornare l'indice del corso, controllare l'anteprima e i rimandi. Il menu laterale include le pagine del corso. Evitare di rigenerare automaticamente la migrazione dai vecchi TeX dopo avere modificato i nuovi sorgenti.

## Risorse comuni: componenti

Le pagine in `risorse/componenti/` sono condivise dai percorsi. Il filtro `scripts/component-links.lua` collega automaticamente i nomi dei componenti nel testo HTML, anche al plurale; conserva i suggerimenti del glossario. Esclude formule, codice, immagini, titoli, collegamenti espliciti e rimandi alla stessa pagina. Per usi non elettrici scrivere `[resistenza]{.no-component-link}`. I riferimenti PDF non vengono trasformati dal filtro.

Gli schemi si rigenerano con `node scripts/build_component_figures.cjs`.

## Navigazione e aspetto

- `assets/modern.css`: tema, colori dei percorsi e adattamento mobile.
- `scripts/navigation.html`: selezione della barra laterale e contesto delle risorse condivise. Il percorso viene ricavato dall’URL del corso, dal parametro `percorso` o dalla sessione della scheda. La pagina iniziale permette di cambiare percorso e azzera la selezione precedente. Il sito funziona anche se la memoria di sessione è disabilitata; senza JavaScript rimane disponibile l’indice completo.
- `risorse/mappe/` e `risorse/esterne/`: mappe e collegamenti commentati.
- `PROJECT_ROADMAP.md`: funzionalità da progettare, incluse discussioni e interazioni. Non viene pubblicato come pagina del sito.

## Organizzazione autonoma del sito

Il sito non deve riprodurre la struttura delle dispense iniziali. Gli indici dei corsi raccolgono i moduli in blocchi: titolo verso il modulo completo, link separato verso la sintesi. Mappe indica solo mappe concettuali. I richiami iniziali sono integrati nei fondamenti del corso; il vocabolario minimo è parte del glossario. Le vecchie pagine `percorso` e `prima-di-iniziare` conservano gli indirizzi tramite rinvio alla nuova destinazione e sono escluse dalla ricerca.
