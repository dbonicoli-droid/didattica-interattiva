-- Glossario unico del sito: risorse/glossario/index.qmd.
-- Le definizioni sono lette a tempo di render: nessuna richiesta a runtime
-- e nessun secondo glossario da mantenere allineato.
--
-- Regole di collegamento, per non trasformare il testo in un tappeto di link:
--   * nei titoli il termine non diventa mai un collegamento;
--   * nel corpo si collega solo la prima occorrenza di ogni termine in ogni sezione
--     (il contatore riparte a ogni titolo di livello 1 o 2);
--   * le occorrenze successive restano testo normale, con il suggerimento affidato
--     alla prima.
local terms = {}
local root = quarto.project.directory

local function has_class(el, name)
  for _, c in ipairs(el.classes or {}) do if c == name then return true end end
  return false
end

-- Fuori dal suggerimento a comparsa restano due cose: l'etichetta dei percorsi,
-- che è già visibile sulla pagina del glossario, e le note rivolte a una parte
-- dei lettori, che allungherebbero il riquadro per tutti gli altri.
local function is_aside(block)
  if block.t == "Div" and has_class(block, "gloss-nota") then return true end
  if block.t == "Para" and #block.content == 1 then
    local el = block.content[1]
    if el.t == "Span" and has_class(el, "gloss-scope") then return true end
  end
  return false
end

local function load_glossary()
  local handle = io.open(root .. "/risorse/glossario/index.qmd", "r")
  if not handle then return end
  local source = handle:read("*a")
  handle:close()
  local doc = pandoc.read(source, "markdown")
  local current, title, blocks
  local function save()
    if current and #blocks > 0 then
      terms[current] = {
        title = title,
        definition = pandoc.utils.stringify(pandoc.Div(blocks))
      }
    end
  end
  for _, block in ipairs(doc.blocks) do
    if block.t == "Header" then
      save()
      if block.identifier:match("^gloss%-") then
        current, title, blocks = block.identifier, pandoc.utils.stringify(block.content), {}
      else
        current, title, blocks = nil, nil, {}
      end
    elseif current and not is_aside(block) then
      blocks[#blocks + 1] = block
    end
  end
  save()
end

local input = (PANDOC_STATE.input_files[1] or ""):gsub("\\", "/")
local on_glossary_page = input:match("risorse/glossario/index%.qmd$") ~= nil

if quarto.doc.is_format("html") then
  load_glossary()
  quarto.doc.add_html_dependency({
    name = "course-glossary",
    version = "2.0.0",
    scripts = { root .. "/assets/glossary.js" },
    stylesheets = { root .. "/assets/glossary.css" }
  })
end

local function gloss_id(target)
  if not target:match("glossario") then return nil end
  return target:match("#(gloss%-[%w%-]+)$")
end

local function strip(el)
  local id = gloss_id(el.target)
  if id then return el.content end
  return nil
end

function Pandoc(doc)
  if not quarto.doc.is_format("html") or on_glossary_page then return nil end
  local seen = {}
  local blocks = {}
  for _, block in ipairs(doc.blocks) do
    if block.t == "Header" then
      if block.level <= 2 then seen = {} end
      block = pandoc.walk_block(block, { Link = strip })
    else
      block = pandoc.walk_block(block, {
        Link = function(el)
          local id = gloss_id(el.target)
          if not id then return nil end
          local entry = terms[id]
          if not entry then return nil end
          if seen[id] then return el.content end
          seen[id] = true
          el.attributes["data-glossary-definition"] = entry.definition
          el.attributes["data-glossary-title"] = entry.title
          el.classes:insert("glossary-link")
          return el
        end
      })
    end
    blocks[#blocks + 1] = block
  end
  return pandoc.Pandoc(blocks, doc.meta)
end
