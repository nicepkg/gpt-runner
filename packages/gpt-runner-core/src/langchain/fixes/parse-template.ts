// see: https://github.com/hwchase17/langchainjs/blob/main/langchain/src/prompts/template.ts
import type { TemplateFormat } from 'langchain/prompts'
import { PromptTemplate, parseTemplate, renderTemplate } from 'langchain/prompts'
import type { InputValues } from 'langchain/schema'

type ParsedFStringNode =
  | { type: 'literal'; text: string }
  | { type: 'variable'; name: string }

// export function parseFString(template: string): ParsedFStringNode[] {
//   // Core logic replicated from internals of pythons built in Formatter class.
//   // https://github.com/python/cpython/blob/135ec7cefbaffd516b77362ad2b2ad1025af462e/Objects/stringlib/unicode_format.h#L700-L706
//   const chars = template.split('')
//   const nodes: ParsedFStringNode[] = []

//   const nextBracket = (bracket: '}' | '{' | '{}', start: number) => {
//     for (let i = start; i < chars.length; i += 1) {
//       if (bracket.includes(chars[i]))
//         return i
//     }
//     return -1
//   }

//   let i = 0
//   while (i < chars.length) {
//     if (chars[i] === '{' && i + 1 < chars.length && chars[i + 1] === '{') {
//       nodes.push({ type: 'literal', text: '{' })
//       i += 2
//     }
//     else if (
//       chars[i] === '}'
//       && i + 1 < chars.length
//       && chars[i + 1] === '}'
//     ) {
//       nodes.push({ type: 'literal', text: '}' })
//       i += 2
//     }
//     else if (chars[i] === '{') {
//       const j = nextBracket('}', i)
//       if (j < 0) {
//         // throw new Error('Unclosed \'{\' in template.')
//         continue
//       }

//       nodes.push({
//         type: 'variable',
//         name: chars.slice(i + 1, j).join(''),
//       })
//       i = j + 1
//     }
//     else if (chars[i] === '}') {
//       // throw new Error('Single \'}\' in template.')
//     }
//     else {
//       const next = nextBracket('{}', i)
//       const text = (next < 0 ? chars.slice(i) : chars.slice(i, next)).join('')
//       nodes.push({ type: 'literal', text })
//       i = next < 0 ? chars.length : next
//     }
//   }
//   return nodes
// }

export function parseFString(template: string): ParsedFStringNode[] {
  // match { variable } {aa_bb} {aa} {aa-aaa}
  const reg = /(\{)\s*?([a-zA-Z0-9_\-\.]+)\s*?(\})/g
  const nodes: ParsedFStringNode[] = []

  let lastIndex = 0

  for (const match of template.matchAll(reg)) {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const [_, left, name, right, _index] = match
    const index = Number(_index)

    // Add a 'literal' node for the text before the current match
    if (index > lastIndex) {
      nodes.push({
        type: 'literal',
        text: template.slice(lastIndex, index),
      })
    }

    // Add a 'variable' node for the matched variable
    nodes.push({ type: 'variable', name })

    lastIndex = index + _.length
  }

  // Add a 'literal' node for any remaining text after the last match
  if (lastIndex < template.length) {
    nodes.push({
      type: 'literal',
      text: template.slice(lastIndex),
    })
  }

  return nodes
}

// export const interpolateFString = (template, values) => parseFString(template).reduce((res, node) => {
//   if (node.type === "variable") {
//       if (node.name in values) {
//           return res + values[node.name];
//       }
//       throw new Error(`Missing value for input ${node.name}`);
//   }
//   return res + node.text;
// }, "");

function interpolateFString(template: string, values: InputValues) {
  return parseFString(template).reduce((res, node) => {
    if (node.type === 'variable') {
      if (node.name in values) {
        return res + values[node.name]
      }
      else {
        // throw new Error(`Missing value for input ${node.name}`)

        // variable not found, return the original string
        return `${res}{${node.name}}`
      }
    }
    return res + node.text
  }, '')
}

function newParseTemplate(template: string, templateFormat: TemplateFormat) {
  if (templateFormat === 'f-string')
    return parseFString(template)

  return parseTemplate(template, templateFormat)
}

function newRenderTemplate(template: string, templateFormat: TemplateFormat, inputValues: InputValues) {
  if (templateFormat === 'f-string')
    return interpolateFString(template, inputValues)

  return renderTemplate(template, templateFormat, inputValues)
}

PromptTemplate.fromTemplate = function (template, { templateFormat = 'f-string', ...rest } = {}) {
  const names = new Set<string>()
  newParseTemplate(template, templateFormat).forEach((node) => {
    if (node.type === 'variable')
      names.add(node.name)
  })
  return new PromptTemplate({
    inputVariables: [...names],
    templateFormat,
    template,
    ...rest,
    validateTemplate: false, // no need to validate template
  })
}

PromptTemplate.prototype.format = async function (values: InputValues) {
  const allValues = await this.mergePartialAndUserVariables(values)
  return newRenderTemplate(this.template, this.templateFormat, allValues)
}
