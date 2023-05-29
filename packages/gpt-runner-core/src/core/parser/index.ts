import path from 'node:path'
import type { SingleFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { resolveSingleFileConfig } from '../config'
import { gptMdFileParser } from './md'

export interface parseGptFileParams {
  filePath: string
  userConfig: UserConfig
}

export async function parseGptFile(params: parseGptFileParams): Promise<SingleFileConfig> {
  const { filePath, userConfig } = params

  const ext = path.extname(filePath)

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
