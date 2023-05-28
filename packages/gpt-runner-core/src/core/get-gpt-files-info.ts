import { existsSync, promises as fs } from 'node:fs'
import type { SingleFileConfig, UserConfig } from './types'
import { parseGptFile } from './parser'

export interface GetGptFilesInfoProps {
  filepaths: string[]
  userConfig: UserConfig
}

export interface GptFileInfo {
  path: string
  content: string
  singleFileConfig: SingleFileConfig
}

export async function getGptFilesInfo(props: GetGptFilesInfoProps): Promise<GptFileInfo[]> {
  const { filepaths, userConfig } = props
  const gptFilesInfo: GptFileInfo[] = []

  for (const filepath of filepaths) {
    const isExit = existsSync(filepath)
    if (!isExit)
      continue

    const content = await fs.readFile(filepath, 'utf-8')
    const singleFileConfig = await parseGptFile({
      filepath,
      userConfig,
    })

    gptFilesInfo.push({
      path: filepath,
      content,
      singleFileConfig,
    })
  }

  return gptFilesInfo
}
