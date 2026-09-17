# Regole del progetto
- Scrivere in italiano; preservare correttezza matematica, unità e leggibilità in aula.
- Le sorgenti dei contenuti sono i file Quarto. La struttura del sito è autonoma dalle dispense iniziali: privilegiare navigazione e apprendimento. Le raccolte PDF possono selezionare e ordinare i contenuti del sito senza imporne l’architettura.
- Non pubblicare materiale da libri, dati studenti, credenziali o report di sessione privati.
- Pubblicare per default dopo una modifica, senza chiedere conferma; fermarsi al commit solo se l'utente lo dice esplicitamente.
- Non dare per pubblicato un push: verificare che l'esecuzione del workflow sia partita sul commit appena spinto (`curl -s "https://api.github.com/repos/dbonicoli-droid/didattica-interattiva/actions/runs?per_page=3"`, confrontando `head_sha`).
- Le app devono funzionare senza servizi AI. RC resta un singolo HTML offline.
- Prima di pubblicare: quarto render, verifica link, node scripts/check_rc.cjs e controllo visivo pagine/app.
- Non sovrascrivere modifiche ai QMD rilanciando la migrazione dalle vecchie dispense.

- Quando una spiegazione, un esempio o una simulazione riguarda un circuito, includere lo schema elettrico prima della formula o insieme ad essa: componenti e valori, alimentazione, polarità delle tensioni e versi delle correnti pertinenti. Usare gli stessi simboli nei controlli, nel grafico e nel testo. Per app autonome includere lo schema anche nel file offline; prevedere una figura statica per il PDF.

## Metodo comune a tutti i percorsi
- Le decisioni su struttura, navigazione, terminologia e interazioni valgono per tutti i percorsi, salvo eccezioni esplicite dell'utente. Gli esempi riferiti a Elettronica illustrano il metodo generale e non ne limitano l'ambito.
- Prima di considerare conclusa una modifica trasversale, verificare TPSEE Elettronici, TPSEE Elettrotecnici, Sistemi automatici e Domotica, anche nel passaggio alle risorse condivise.
- Conservare le differenze didattiche pertinenti: argomenti, prerequisiti, numero di moduli, livello e stato provvisorio delle guide. Coerenza del metodo non significa copiare gli stessi contenuti in tutti i corsi.
- Distinguere nel resoconto ciò che è applicato a tutti i corsi, ciò che è condiviso, le eccezioni motivate e le funzionalità ancora da realizzare.

## Regole stabilite nella revisione di struttura e aspetto
- Glossario unico in `risorse/glossario/index.qmd`: un termine, una definizione. Le specificità di un indirizzo si scrivono dentro la stessa voce, in chiaro ("Nel linguaggio Ladder…"), non in una definizione parallela.
- Rimandi al glossario e ai componenti: mai nei titoli, e nel corpo solo alla prima occorrenza per sezione. Se ne occupano i filtri Lua; non aggirarli a mano.
- Denominazione unica dei moduli: lo stesso nome in tabella, blocchi, indice dei contenuti, barra laterale e titolo della pagina.
- Il materiale mancante si segnala dove manca, una volta sola: `![](/assets/lavori-in-corso.svg){.wip-icon}` accanto al titolo interessato. Niente avvisi generici ripetuti in cima alle pagine, niente cartelli a piena larghezza.
- Colori, spaziature e caratteri stanno solo in `assets/tema*.scss`, come variabili CSS. Nessun valore di colore ripetuto in JavaScript o nei QMD.
- Ogni pagina dichiara la propria barra laterale con `sidebar:` nel front matter. La navigazione deve restare corretta senza JavaScript.
- Nelle pagine pubbliche non compaiono nomi di colleghi legati a impegni non ancora presi: quelle note stanno in `PROJECT_ROADMAP.md`.
