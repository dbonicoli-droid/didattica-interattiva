-- Stato di lavorazione della pagina, dichiarato nel front matter:
--
--   stato: da-scrivere | bozza | da-revisionare | completo
--
-- Ogni stato ha una prova che lo distingue dagli altri, così due pagine
-- nella stessa condizione portano sempre la stessa etichetta:
--
--   da-scrivere    c'è solo la struttura: titoli e rimandi, nessuna spiegazione
--   bozza          il testo c'è, ma è un primo getto e non è stato riletto
--   da-revisionare i contenuti sono completi, manca la rilettura
--   completo       contenuti completi e riletti
--
-- Il badge compare accanto al titolo. Una pagina senza campo `stato`
-- non mostra nulla: l'assenza non è un'affermazione.
local ETICHETTE = {
  ["da-scrivere"]    = "Da scrivere",
  ["bozza"]          = "Bozza",
  ["da-revisionare"] = "Da revisionare",
  ["completo"]       = "Completo"
}

local DESCRIZIONI = {
  ["da-scrivere"]    = "C'è solo la struttura della pagina: i contenuti non sono ancora stati scritti.",
  ["bozza"]          = "Il testo c'è, ma è un primo getto e non è ancora stato riletto.",
  ["da-revisionare"] = "Contenuti completi, in attesa di rilettura.",
  ["completo"]       = "Contenuti completi e riletti."
}

function Meta(meta)
  if not quarto.doc.is_format("html") then return nil end
  if not meta.stato then return nil end
  local chiave = pandoc.utils.stringify(meta.stato)
  local etichetta = ETICHETTE[chiave]
  if not etichetta then
    quarto.log.warning("stato non riconosciuto: " .. chiave)
    return nil
  end
  local badge = string.format(
    '<span class="stato stato-%s" title="%s">%s</span>',
    chiave, DESCRIZIONI[chiave], etichetta)
  local titolo = meta.title and pandoc.utils.stringify(meta.title) or ""
  meta.title = pandoc.Inlines({
    pandoc.Str(titolo),
    pandoc.RawInline("html", " " .. badge)
  })
  return meta
end
