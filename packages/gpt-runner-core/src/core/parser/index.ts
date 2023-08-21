import type { AiPersonConfig, GlobalAiPersonConfig } from '@nicepkg/gpt-runner-shared/common'
import { resolveAiPersonConfig } from '@nicepkg/gpt-runner-shared/common'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { gptMdFileParser } from './md'

export interface parseAiPersonFileParams {
  filePath: string
  globalAiPersonConfig: GlobalAiPersonConfig
}

export async function parseAiPersonFile(params: parseAiPersonFileParams): Promise<AiPersonConfig> {
  const { filePath, globalAiPersonConfig } = params

  const ext = PathUtils.extname(filePath)

  switch (ext) {
    case '.md':
      return await gptMdFileParser({
        filePath,
        globalAiPersonConfig,
      })
    default:
      break
  }

  return resolveAiPersonConfig({
    globalAiPersonConfig,
    aiPersonConfig: {},
  })
}
