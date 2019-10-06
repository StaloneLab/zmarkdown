const detab = require('detab')

const defaultMacro = (content, lang) => {
  if (!lang) lang = 'text'
  let param = ''
  if (lang.indexOf('hl_lines=') > -1) {
    let lines = lang.split('hl_lines=')[1].trim()
    if (
      (lines.startsWith('"') && lines.endsWith('"')) ||
      (lines.startsWith("'") && lines.endsWith("'"))
    ) {
      lines = lines.slice(1, -1).trim()
    }
    param += `[][${lines}]`
  }
  lang = lang.split(' ')[0]
  return `\\begin{CodeBlock}${param}{${lang}}\n${content}\n\\end{CodeBlock}\n\n`
}

/* Stringify a Blockquote `node`. */
module.exports = function code (ctx, node) {
  const value = node.value ? detab(`${node.value}\n`) : ''
  const macro = ctx.code || defaultMacro
  return macro(value, node.lang)
}
