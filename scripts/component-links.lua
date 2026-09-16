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
    if c and not is_self(c) then
     if first>last then result:insert(pandoc.Str(el.text:sub(last,first-1))) end
     result:insert(decorate(pandoc.Link(word,target(c)),c))
     last=after
    end
   end
   if last==1 then result:insert(el)
   elseif last<=#el.text then result:insert(pandoc.Str(el.text:sub(last))) end
  elseif el.t=='Link' then
   local c=aliases[pandoc.utils.stringify(el.content):lower()]
   if c and not is_self(c) and el.target:match('glossario%.[^#]+#') then
    el.target=target(c);el=decorate(el,c)
   end
   result:insert(el)
  elseif (el.t=='Span' or el.t=='Strong' or el.t=='Emph' or el.t=='SmallCaps' or el.t=='Strikeout' or el.t=='Quoted') and not excluded(el) then
   el.content=process(el.content);result:insert(el)
  else result:insert(el) end
 end
 return result
end
local function block(el)
 if quarto.doc.is_format('html') then el.content=process(el.content) end
 return el
end
return {{Para=block,Plain=block}}
