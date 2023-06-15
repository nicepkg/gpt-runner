import fs from 'node:fs'
import { Tiktoken } from 'tiktoken/lite'
import cl100kBase from 'tiktoken/encoders/cl100k_base.json'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'

// slow but accurate
export function countTokens(text: string) {
  const encoding = new Tiktoken(
    cl100kBase.bpe_ranks,
    cl100kBase.special_tokens,
    cl100kBase.pat_str,
  )
  const tokens = encoding.encode(text)
  encoding.free()
  return tokens.length
}

// fast but inaccurate
export function countTokenQuick(text: string) {
  // int
  return Math.floor(text.length / 3.5)
}

export function countFileTokens(filePath: string, quick = true) {
  if (!PathUtils.isFile(filePath))
    return 0
  const content = fs.readFileSync(filePath, 'utf-8')
  return quick ? countTokenQuick(content) : countTokens(content)
}
