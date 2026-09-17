# Struttura, navigazione e interattività

## Prima revisione
- Navigazione generale in alto, ricerca evidente, percorso attivo e risorse comuni nella barra laterale.
- Contesto conservato entrando nelle risorse condivise; scelta di un altro percorso dalla pagina iniziale.
- Titoli distinti per prerequisiti, richiami del corso e schede di approfondimento.
- Sezioni Mappe e Risorse esterne con materiali iniziali.
- Nessun blocco obbligatorio di prerequisiti e prosecuzione ripetuto in ogni pagina.

## Revisione di struttura e aspetto, fatto
- Glossario unico del sito, con vocabolario minimo per percorso e nessuna definizione divergente.
- Barre laterali native, una per percorso più una per le risorse condivise: nessun JavaScript per nasconderle.
- Tema scuro predefinito con alternativa chiara; un solo foglio di stile, colori dei percorsi definiti una volta sola.
- Rimandi al glossario e ai componenti solo alla prima occorrenza per sezione, mai nei titoli.
- Badge di stato per pagina (`stato:` nel front matter).
- Interruttore "Lettura facilitata" per chi fatica a seguire il rigo.
- Denominazione unica dei moduli in tabella, blocchi, indice, barra laterale e titolo di pagina.

## Da progettare
- [ ] Forum: decidere accesso, visibilità, moderazione e piattaforma prima dell’attivazione.
- [ ] Tag sulle singole sezioni: classe consigliata, essenziale/facoltativo, prerequisiti. Confermare l’assegnazione per ciascun percorso; non dedurre la classe dal solo argomento.
- [ ] Selettore della classe e generazione di PDF per livello dai medesimi metadati.
- [ ] Mappe concettuali con relazioni etichettate, versione stampabile e indice testuale accessibile; estendere la prima mappa dei componenti e realizzare quelle dei quattro percorsi, oggi segnaposto.
- [ ] Attività Prevedi → prova → spiega. Prevedere fin dall'inizio l'alternativa per chi ha difficoltà di lettura: consegna anche a voce, risposta a scelta multipla accanto a quella scritta, nessun vincolo di lunghezza del testo.
- [ ] Esercizi con aiuti progressivi e soluzioni commentate.
- [ ] Quiz autocorretti in fondo ai moduli, con una spiegazione per ogni opzione sbagliata. HTML e JavaScript locali, nessun servizio esterno.
- [ ] Trova l’errore negli schemi, nei grafici e nelle unità di misura.
- [ ] Derivazioni guidate a passaggi.
- [ ] URL delle simulazioni con parametri riproducibili e immagine equivalente nei PDF.
- [ ] Simulatore di porte logiche sul modello del laboratorio RC, per il modulo 3 di TPSEE Elettronici.
- [ ] Tempo di lettura stimato sotto il titolo dei moduli.
- [ ] Segnalibri locali: riprendere da dove si era rimasti, senza che alcun dato esca dal browser.
- [ ] Catalogo filtrabile per percorso, classe e tipo di risorsa; sinonimi nella ricerca.

### Da decidere
- [ ] Salti di livello nei titoli: circa cento punti in cui un `##` è seguito da un `####` senza `###` intermedio. Quei sottotitoli non compaiono nel sommario di pagina e la gerarchia risulta incoerente per chi naviga con lettore di schermo. La correzione è meccanica (`####` → `###`) ma cambia la resa tipografica di molte pagine: da valutare insieme.
- [ ] Monte ore di Sistemi automatici: la somma dei sei moduli dà 163 ore. Da confrontare con la programmazione di classe.
- [ ] Educazione civica per TPSEE Elettronici: argomento e ore non ancora definiti, unico percorso senza.

Le parti comuni mantengono un’unica sorgente. Forum e dati degli studenti non fanno parte della prima revisione.

## Organizzazione dei contenuti
- Struttura del sito autonoma dalle dispense; PDF come raccolte editoriali successive.
- Moduli del percorso integrati negli indici; Mappe riservato ai collegamenti concettuali.
- Sicurezza con accesso dedicato; richiami iniziali nei fondamenti; vocabolario minimo nel glossario unico.
- Il materiale mancante si segnala dove manca, una volta sola: icona alla dimensione del testo accanto al titolo interessato, senza avvisi ripetuti in cima alle pagine.
