import path from 'node:path'
import type { UserConfig } from '../types'
import { getSingleFileConfig, resolveSingleFileConfig } from '../config'
import { gptMdFileParser } from './md'

export interface parseGptFileProps {
  filepath: string
  userConfig: UserConfig
}

export function parseGptFile(props: parseGptFileProps) {
  const { filepath, userConfig } = props

  const ext = path.extname(filepath)

  switch (ext) {
    case '.md':
      return gptMdFileParser({
        filepath,
        userConfig,
      })
    default:
      break
  }

  return resolveSingleFileConfig({
    userConfig,
    singleFileConfig: getSingleFileConfig({}),
  })
}
