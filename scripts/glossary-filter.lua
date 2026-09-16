-- Glossary definitions are read from the course QMD files during rendering.
-- No runtime request and no second glossary to maintain.
local terms = {}
local root = quarto.project.directory
local function load_glossary(course)
  local file = root .. "/corsi/" .. course .. "/glossario.qmd"
  local handle = io.open(file, "r")
  if not handle then return end
  local source = handle:read("*a")
  handle:close()
  local doc = pandoc.read(source, "markdown")
  local current, title, blocks
  local function save()
    if current and #blocks > 0 then
      terms[course .. "#" .. current] = {
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
    elseif current then
      blocks[#blocks + 1] = block
    end
  end
  save()
end
if quarto.doc.is_format("html") then
  for _, course in ipairs(pandoc.system.list_directory(root .. "/corsi")) do
    load_glossary(course)
  end
  quarto.doc.add_html_dependency({
    name = "course-glossary",
    version = "1.0.0",
    scripts = {root .. "/assets/glossary.js"},
    stylesheets = {root .. "/assets/glossary.css"}
  })
end
function Link(el)
  if not quarto.doc.is_format("html") then return nil end
  local id = el.target:match("glossario%.[qh][mt][md][l]?#(gloss%-[%w%-]+)$")
  -- QMD and HTML are both accepted because filter ordering may rewrite targets.
  id = id or el.target:match("glossario%.qmd#(gloss%-[%w%-]+)$")
       or el.target:match("glossario%.html#(gloss%-[%w%-]+)$")
  if not id then return nil end
  local course = el.target:match("corsi/([^/]+)/glossario")
  if not course then
    local input = PANDOC_STATE.input_files[1]:gsub(string.char(92), "/")
    course = input:match("corsi/([^/]+)/")
    if not course then
      local cwd = pandoc.system.get_working_directory():gsub(string.char(92), "/")
      course = cwd:match("corsi/([^/]+)$")
    end
  end
  local entry = course and terms[course .. "#" .. id]
  if entry then
    el.attributes["data-glossary-definition"] = entry.definition
    el.attributes["data-glossary-title"] = entry.title
    el.classes:insert("glossary-link")
  end
  return el
end
