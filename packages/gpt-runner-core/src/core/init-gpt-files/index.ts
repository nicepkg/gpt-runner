import { FileUtils, PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { GPT_RUNNER_OFFICIAL_FOLDER } from '@nicepkg/gpt-runner-shared'
import { copilotMdFile } from './copilot.gpt'

export const gptFilesForInit = {
  copilot: copilotMdFile,
} as const

export type GptInitFileName = keyof typeof gptFilesForInit

export interface InitGptFilesParams {
  rootPath: string
  gptFilesNames: GptInitFileName[]
}

/**
 * write some .gpt.md files to the <rootPath>/.gpt-runner folder
 */
export async function initGptFiles(params: InitGptFilesParams) {
  const { rootPath, gptFilesNames } = params
  const generateTargetFolder = PathUtils.join(rootPath, GPT_RUNNER_OFFICIAL_FOLDER)

  for (const gptFileName of gptFilesNames) {
    const filePath = PathUtils.join(generateTargetFolder, `${gptFileName}.gpt.md`)

    if (PathUtils.isFile(filePath))
      continue

    const content = gptFilesForInit[gptFileName]

    await FileUtils.writeFile({ filePath, content, valid: false })
  }

  return generateTargetFolder
}
