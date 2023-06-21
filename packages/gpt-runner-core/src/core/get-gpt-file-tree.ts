import type { GptFileInfo, GptFileInfoTree, GptFileInfoTreeItem, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { GptFileTreeItemType, userConfigWithDefault } from '@nicepkg/gpt-runner-shared/common'
import { FileUtils, PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { parseGptFile } from './parser'
import { getIgnoreFunction } from './gitignore'

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
    respectGitIgnore = true,
  } = resolvedUserConfig

  const isGitIgnore = await getIgnoreFunction({ rootPath })

  const isGitignorePaths = (filePath: string): boolean => {
    if (!respectGitIgnore)
      return false

    if (filePath && filePath.match(/\/\.git\//))
      return true

    return isGitIgnore(filePath)
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

      const name = getName(title, filePath)

      const fileId = [...titleParts.slice(0, -1), name].join('/') || filePath

      const fileInfo: GptFileInfo = {
        id: fileId,
        parentId: null,
        path: filePath,
        name,
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

          parentFileInfo.children.push({ ...fileInfo, parentId: parentFileInfo.id })
        }
        else {
          const parentPath = ''

          const parentFileInfo: GptFileInfoTreeItem = {
            id: parentTitle.endsWith('/') ? parentTitle : `${parentTitle}/`,
            parentId: null,
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
