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

Collega **solo la prima occorrenza di ogni componente in ogni sezione**: il contatore riparte a ogni titolo di livello 1 o 2. Le occorrenze successive restano testo normale.

Gli schemi si rigenerano con `node scripts/build_component_figures.cjs`.

## Glossario unico

`risorse/glossario/index.qmd` è l'unica raccolta di termini del sito. Ogni voce ha un identificatore parlante (`#gloss-variabile-booleana`) e un'etichetta che indica in quali percorsi compare. Quando una definizione ha un risvolto specifico di un indirizzo, il testo lo dice esplicitamente e resta leggibile da chiunque: non esistono definizioni diverse dello stesso termine.

Il vocabolario minimo resta scelto percorso per percorso, come sezioni della stessa pagina (`#vocabolario-domotica` e simili). Le vecchie pagine `corsi/*/glossario.qmd` conservano gli indirizzi tramite rinvio.

`scripts/glossary-filter.lua` legge le definizioni a tempo di render e le allega ai collegamenti come suggerimento. Vale la stessa regola dei componenti: **nessun collegamento nei titoli, e nel corpo solo la prima occorrenza per sezione**.

## Stato di lavorazione

Nel front matter di una pagina si può dichiarare `stato: bozza | in-sviluppo | da-revisionare | completo`. `scripts/stato-pagina.lua` mostra il badge accanto al titolo. Una pagina senza il campo non mostra nulla: l'assenza non è un'affermazione.

## Navigazione e aspetto

- `assets/tema.scss`: impaginato, tipografia e componenti, scritti su variabili CSS.
- `assets/tema-scuro.scss` e `assets/tema-chiaro.scss`: le due palette. **Il tema scuro è il predefinito**; l'interruttore nella barra in alto attiva quello chiaro. I colori dei quattro percorsi sono definiti una volta sola in `assets/tema.scss` (`--c-elettronici` e simili) e il JavaScript sceglie quale usare, senza ripeterne i valori.
- Le barre laterali sono native: una per percorso più una per le risorse condivise, dichiarate in `_quarto.yml` con `id:`. Ogni pagina dichiara la propria con `sidebar:` nel front matter. Nessun JavaScript, nessun lampeggio, navigazione corretta anche senza script.
- `scripts/navigation.html`: accento del percorso, rientro dalle risorse condivise, barra di avanzamento della lettura, barra in alto che si compatta allo scorrimento e interruttore **Lettura facilitata** (carattere Atkinson Hyperlegible, righe più corte e più spaziate; la scelta resta nel browser di chi legge).
- `risorse/mappe/` e `risorse/esterne/`: mappe e collegamenti commentati.
- `PROJECT_ROADMAP.md`: funzionalità da progettare, incluse discussioni e interazioni. Non viene pubblicato come pagina del sito.

## Organizzazione autonoma del sito

Il sito non deve riprodurre la struttura delle dispense iniziali. Negli indici dei corsi la sezione **Programma del corso** apre con una frase di orientamento, poi la tabella di ore e periodi, poi i blocchi dei moduli: il titolo del blocco porta al modulo completo, un collegamento separato porta alla sintesi. Finché il modulo completo è in preparazione, la sua pagina mostra il badge di stato, un pulsante **Vai alla sintesi** e, per ogni unità didattica, il rimando alla sezione corrispondente della sintesi.

Lo stesso nome di modulo vale ovunque: tabella, blocchi, indice dei contenuti, barra laterale e titolo della pagina. Mappe indica solo mappe concettuali. I richiami iniziali sono integrati nei fondamenti del corso. Le vecchie pagine `percorso`, `prima-di-iniziare` e `glossario` conservano gli indirizzi tramite rinvio alla nuova destinazione e sono escluse dalla ricerca.
