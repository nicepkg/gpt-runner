import fs from 'node:fs'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { isChineseCharacter } from '@nicepkg/gpt-runner-shared'

export function countTokenQuick(text: string): number {
  let chineseCount = 0
  let otherCount = 0

  for (const char of text) {
    if (isChineseCharacter(char))
      chineseCount += 1

    else
      otherCount += 1
  }

  return chineseCount * 2 + (otherCount / 3.5)
}

export function countFileTokens(filePath: string, quick = true) {
  if (!PathUtils.isFile(filePath))
    return 0
  const content = fs.readFileSync(filePath, 'utf-8')
  // return quick ? countTokenQuick(content) : countTokens(content)

  return countTokenQuick(content)
}
