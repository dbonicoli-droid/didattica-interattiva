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

- Stato delle pagine: `da-scrivere` (solo struttura), `bozza` (primo getto), `da-revisionare` (completo ma non riletto), `completo`. Assegnare solo quando i fatti lo sostengono; niente campo significa nessuna affermazione.

## Struttura delle pagine dei moduli
- Lo **scheletro della pagina segue l'apprendimento**, non la numerazione del programma: i titoli dicono che cosa si impara. Le unità didattiche restano tracciabili tramite le ancore `{#ud:N.M}`, che viaggiano con la sezione in cui quel materiale vive davvero, e una tabella «Corrispondenza con il programma» in fondo alla pagina.
- Tutti gli argomenti del programma devono avere una sezione che li tratta; non è richiesto che le sezioni coincidano una a una con le unità didattiche.
- Diffidare delle unità che sono **contenitori** e non argomenti («Classificazione…», «Esercitazioni…»): assorbono contenuto senza limite. Dichiarare quanti oggetti si insegnano e fermarsi lì.
- Ciò che esce dal programma dell'anno **non resta nel modulo**: va nelle schede di approfondimento del corso, con un richiamo di una riga nel punto in cui se ne sente la mancanza. I riquadri a comparsa servono per gli strumenti (una derivata, una formula), non per argomenti interi.
- Preferire qualità e semplicità alla quantità. Si riduce il numero di concetti chiesti insieme, non la precisione di quelli che restano.
- Gli esempi fisici scelgono il linguaggio dell'indirizzo: per gli elettrotecnici contattore, relè, trasformatore e saturazione prima di diodo e transistor.

## Schede di approfondimento ed esercizi
- Una scheda entra in `approfondimenti.qmd` solo per uno di **due motivi dichiarati**, che sono anche le sezioni della pagina: *Oltre il programma* (corretto ma non richiesto quest'anno) e *Schede di consultazione* (materiale da cercare, non da leggere di seguito).
- **Il conto per esteso resta nel modulo**, in un riquadro a comparsa accanto al risultato: mandare il lettore su un'altra pagina per vedere come si è arrivati a un numero spezza il discorso più del riquadro.
- **Gli esercizi hanno una pagina propria** (`esercizi.qmd`), divisa per modulo, con le soluzioni in riquadri a comparsa attaccati al proprio gruppo. Non si mescolano con gli approfondimenti. Restano nel modulo solo gli esercizi interattivi che esercitano la teoria immediatamente precedente.
- Ogni scheda e ogni gruppo di esercizi dichiara la **provenienza** (`::: {.provenienza}` con il rimando al modulo), e il modulo li richiama. Il collegamento è sempre nei due sensi: niente materiale senza casa.
- La pagina apre con un indice che per ogni scheda dice motivo e modulo di provenienza.
- Identificatori parlanti: niente `#app:old-...` ereditati dalle migrazioni.
