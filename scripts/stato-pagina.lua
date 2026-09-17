-- Stato di lavorazione della pagina, dichiarato nel front matter:
--
--   stato: bozza | in-sviluppo | da-revisionare | completo
--
-- Il badge compare accanto al titolo. Una pagina senza campo `stato`
-- non mostra nulla: l'assenza non è un'affermazione.
local ETICHETTE = {
  ["bozza"]          = "Bozza",
  ["in-sviluppo"]    = "In sviluppo",
  ["da-revisionare"] = "Da revisionare",
  ["completo"]       = "Completo"
}

local DESCRIZIONI = {
  ["bozza"]          = "Appunti iniziali, non ancora rivisti.",
  ["in-sviluppo"]    = "Contenuti in scrittura, si arricchiranno con le lezioni.",
  ["da-revisionare"] = "Contenuti completi, in attesa di revisione.",
  ["completo"]       = "Contenuti completi e rivisti."
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
