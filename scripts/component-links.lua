-- Collega automaticamente i nomi dei componenti alle pagine condivise.
-- Come per il glossario, solo la prima occorrenza di ogni componente in ogni
-- sezione diventa un collegamento: il contatore riparte a ogni titolo di
-- livello 1 o 2. I titoli non vengono mai trasformati.
local aliases = {
 resistenza='resistore',resistenze='resistore',resistore='resistore',resistori='resistore',
 condensatore='condensatore',condensatori='condensatore',induttore='induttore',induttori='induttore',
 induttanza='induttore',induttanze='induttore',diodo='diodo',diodi='diodo',
 transistor='transistor',transistore='transistor',transistori='transistor'
}
local definitions = {
 resistore='Resistenza elettrica e resistore: legge di Ohm, potenza e comportamento nel tempo e in frequenza.',
 condensatore='Componente che immagazzina energia elettrica: carica, tensione, dinamica RC e trasformate.',
 induttore='Componente che immagazzina energia magnetica: corrente, dinamica RL e trasformate.',
 diodo='Componente non lineare a due terminali: struttura, polarizzazione e applicazioni.',
 transistor='Componente per controllare una corrente: struttura e funzionamento generale di BJT e MOSFET.'
}
local current = (quarto.doc.input_file or PANDOC_STATE.input_files[1]):gsub('\\','/')
local directory = pandoc.system.get_working_directory():gsub('\\','/')
if not current:match('^%a:/') and not current:match('^/') then current=directory..'/'..current end
local function is_self(c) return current:match('/componenti/'..c..'%.qmd$') end
local function target(c) return '/risorse/componenti/'..c..'.qmd' end
local function excluded(el)
 for _,c in ipairs(el.classes or {}) do if c=='no-component-link' then return true end end
 return false
end

local seen = {}

local function decorate(link,c)
 link.classes:insert('component-link')
 if not link.attributes['data-glossary-definition'] then
  link.attributes['data-glossary-title']='Componente · '..c
  link.attributes['data-glossary-definition']=definitions[c]
  link.classes:insert('glossary-link')
 end
 return link
end

local function process(inlines)
 local result=pandoc.List()
 for _,el in ipairs(inlines) do
  if el.t=='Str' then
   local last=1
   for first,word,after in el.text:gmatch('()(%a+)()') do
    local c=aliases[word:lower()]
    if c and not is_self(c) and not seen[c] then
     seen[c]=true
     if first>last then result:insert(pandoc.Str(el.text:sub(last,first-1))) end
     result:insert(decorate(pandoc.Link(word,target(c)),c))
     last=after
    end
   end
   if last==1 then result:insert(el)
   elseif last<=#el.text then result:insert(pandoc.Str(el.text:sub(last))) end
  elseif el.t=='Link' then
   local c=aliases[pandoc.utils.stringify(el.content):lower()]
   -- un rimando al glossario per un nome di componente porta alla pagina del componente
   local dal_glossario = c and el.target:match('glossario[^#]*#')
   -- un collegamento scritto a mano che punta gia` alla pagina del componente:
   -- va lasciato dov'e`, ma merita lo stesso suggerimento di quelli automatici
   local gia_al_componente = c and el.target:match('componenti/'..c..'%.[qh]')
   if c and not is_self(c) and (dal_glossario or gia_al_componente) then
    if seen[c] and dal_glossario then
     result:extend(el.content)
    else
     seen[c]=true
     if dal_glossario then el.target=target(c) end
     result:insert(decorate(el,c))
    end
   else
    result:insert(el)
   end
  elseif (el.t=='Span' or el.t=='Strong' or el.t=='Emph' or el.t=='SmallCaps' or el.t=='Strikeout' or el.t=='Quoted') and not excluded(el) then
   el.content=process(el.content);result:insert(el)
  else result:insert(el) end
 end
 return result
end

-- Un blocco che contiene soltanto il nome di un componente non e` prosa: e`
-- un'etichetta. Quarto fa passare da questo filtro anche le voci della barra
-- laterale e del menu, e agganciarle produrrebbe un collegamento dentro un
-- collegamento, che il browser spezza.
local function e_etichetta(block)
 if block.t~='Para' and block.t~='Plain' then return false end
 local testo=pandoc.utils.stringify(block):gsub('^%s+',''):gsub('%s+$','')
 return aliases[testo:lower()]~=nil
end

function Pandoc(doc)
 if not quarto.doc.is_format('html') then return nil end
 if current:match('/risorse/glossario/index%.qmd$') then return nil end
 local blocks={}
 for _,block in ipairs(doc.blocks) do
  if block.t=='Header' then
   if block.level<=2 then seen={} end
  elseif e_etichetta(block) then
   -- lasciata com'e`
  elseif block.t=='Para' or block.t=='Plain' then
   block.content=process(block.content)
  else
   block=pandoc.walk_block(block,{
    Para=function(b) if e_etichetta(b) then return b end b.content=process(b.content); return b end,
    Plain=function(b) if e_etichetta(b) then return b end b.content=process(b.content); return b end
   })
  end
  blocks[#blocks+1]=block
 end
 return pandoc.Pandoc(blocks,doc.meta)
end
