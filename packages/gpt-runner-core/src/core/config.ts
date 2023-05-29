import type { GptFileInfo, GptFileInfoTree, GptFileInfoTreeItem, SingleFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { GptFileTreeItemType } from '@nicepkg/gpt-runner-shared/common'
import { FileUtils, PathUtils } from '@nicepkg/gpt-runner-shared/node'
import type { Ignore } from 'ignore'
import ignore from 'ignore'
import { parseGptFile } from './parser'

export function singleFileConfigWithDefault(singleFileConfig?: Partial<SingleFileConfig>): SingleFileConfig {
  return {
    ...singleFileConfig,
  }
}

export function userConfigWithDefault(userConfig?: Partial<UserConfig>): UserConfig {
  return {
    mode: 'openai',
    rootPath: process.cwd(),
    includes: null,
    excludes: null,
    exts: ['.gpt.md'],
    respectGitignore: true,
    ...userConfig,
    openai: {
      openaiKey: process.env.OPENAI_KEY!,
      model: 'gpt-3.5-turbo',
      temperature: 0.9,
      maxTokens: 2000,
      ...userConfig?.openai,
    },
  }
}

export interface ResolveSingleFileCConfigParams {
  userConfig: UserConfig
  singleFileConfig: SingleFileConfig
}

export function resolveSingleFileConfig(params: ResolveSingleFileCConfigParams): SingleFileConfig {
  const userConfig = userConfigWithDefault(params.userConfig)
  const singleFileConfig = singleFileConfigWithDefault(params.singleFileConfig)

  const resolvedConfig: SingleFileConfig = {
    ...singleFileConfig,
    mode: singleFileConfig.mode ?? userConfig.mode,
    openai: {
      ...userConfig.openai,
      ...singleFileConfig.openai,
    },
  }

  return resolvedConfig
}

export interface GetGptFilesInfoParams {
  userConfig: UserConfig
}

export interface GetGptFilesInfoResult {
  filesInfo: GptFileInfo[]
  filesInfoTree: GptFileInfoTree
}

export async function getGptFilesInfo(params: GetGptFilesInfoParams): Promise<GetGptFilesInfoResult> {
  const { userConfig } = params

  const resolvedUserConfig = userConfigWithDefault(userConfig)

  const {
    rootPath = process.cwd(),
    exts = ['.gpt.md'],
    includes = null,
    excludes = null,
    respectGitignore = true,
  } = resolvedUserConfig

  const ig: Ignore | null = await (async () => {
    const gitignorePath = PathUtils.join(rootPath, '.gitignore')
    const gitignoreContent = await FileUtils.readFile({ filePath: gitignorePath })
    const ig = ignore().add(gitignoreContent)

    return ig
  })()

  const isGitignorePaths = (filePath: string): boolean => {
    if (!respectGitignore)
      return false

    const relativePath = PathUtils.relative(rootPath, filePath)

    return ig?.ignores(relativePath) ?? false
  }

  const fullRootPath = PathUtils.resolve(rootPath)

  const filesInfo: GptFileInfo[] = []
  const filesInfoTree: GptFileInfoTree = []
  const tempTitleFileInfoTMap = new Map<string, GptFileInfoTreeItem>()

  await FileUtils.travelFilesByFilterPattern({
    filePath: fullRootPath,
    exts,
    includes,
    excludes,
    isValidPath: (filePath) => {
      return !isGitignorePaths(filePath)
    },
    callback: async (filePath) => {
      const content = await FileUtils.readFile({ filePath })
      const singleFileConfig = await parseGptFile({
        filePath,
        userConfig: resolvedUserConfig,
      })

      const { title = '' } = singleFileConfig
      const titleParts = title.split('/')

      const getName = (title: string, filePath: string): string => {
        const titleParts = title.split('/')
        const pathParts = filePath.split('/') || []
        const name = titleParts[titleParts.length - 1] || pathParts[pathParts.length - 1] || 'unknown'
        return name
      }

      const parentTitleParts = titleParts.slice(0, -1)

      const fileInfo: GptFileInfo = {
        id: title,
        path: filePath,
        name: getName(title, filePath),
        content,
        singleFileConfig,
        type: GptFileTreeItemType.File,
      }

      if (parentTitleParts.length) {
        const parentTitle = parentTitleParts.join('/')
        const parentFileInfo = tempTitleFileInfoTMap.get(parentTitle)

        if (parentFileInfo) {
          if (!parentFileInfo.children)
            parentFileInfo.children = []

          parentFileInfo.children.push({ ...fileInfo })
        }
        else {
          const parentPath = ''

          const parentFileInfo: GptFileInfoTreeItem = {
            id: parentTitle,
            path: parentPath,
            name: getName(parentTitle, parentPath),
            type: GptFileTreeItemType.Folder,
            children: [{ ...fileInfo }],
          }

          tempTitleFileInfoTMap.set(parentTitle, parentFileInfo)
          filesInfoTree.push(parentFileInfo)
        }
      }
      else {
        filesInfoTree.push({ ...fileInfo })
      }

      filesInfo.push({ ...fileInfo })
    },
  })

  return {
    filesInfo,
    filesInfoTree,
  }
}
