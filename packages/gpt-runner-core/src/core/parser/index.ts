import type { AiPresetFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { resolveAiPresetFileConfig } from '@nicepkg/gpt-runner-shared/common'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { gptMdFileParser } from './md'

export interface parseGptFileParams {
  filePath: string
  userConfig: UserConfig
}

export async function parseGptFile(params: parseGptFileParams): Promise<AiPresetFileConfig> {
  const { filePath, userConfig } = params

  const ext = PathUtils.extname(filePath)

  switch (ext) {
    case '.md':
      return await gptMdFileParser({
        filePath,
        userConfig,
      })
    default:
      break
  }

  return resolveAiPresetFileConfig({
    userConfig,
    aiPresetFileConfig: {},
  })
}
