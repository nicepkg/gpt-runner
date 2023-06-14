import type { SingleFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { resolveSingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
import { PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { gptMdFileParser } from './md'

export interface parseGptFileParams {
  filePath: string
  userConfig: UserConfig
}

export async function parseGptFile(params: parseGptFileParams): Promise<SingleFileConfig> {
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

  return resolveSingleFileConfig({
    userConfig,
    singleFileConfig: {},
  })
}
