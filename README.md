# Didattica interattiva

Materiali di Daniele Bonicoli per l'ITIS Galileo Galilei di Livorno, A.S. 2026–2027. Sito didattico personale, non sito istituzionale della scuola.

## Lavorare in VS Code
Aprire questa cartella. Sono richiesti Quarto e Git; Node.js serve al controllo e all'esportazione della figura del laboratorio RC.

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
