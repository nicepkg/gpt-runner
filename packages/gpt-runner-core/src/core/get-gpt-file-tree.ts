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
    rootPath = '',
    exts,
    includes,
    excludes,
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

  const startWithRoot = (path: string) => {
    return path.startsWith('/') ? path : `/${path}`
  }

  const getName = (title: string, filePath: string): string => {
    const titleParts = title.split('/')
    const pathParts = filePath.split('/') || []
    const name = titleParts[titleParts.length - 1] || pathParts[pathParts.length - 1] || 'unknown'
    return name
  }

  const getId = (title: string, name: string, filePath: string): string => {
    const titleParts = title.split('/')
    return startWithRoot([...titleParts.slice(0, -1), name].join('/') || filePath)
  }

  const getParentTitle = (title: string): string => {
    const titleParts = title.split('/')
    const parentTitleParts = titleParts.slice(0, -1)
    return startWithRoot(parentTitleParts.join('/').replace(/\/$/, ''))
  }

  const getParent = (title: string): GptFileInfoTreeItem => {
    const parentTitle = getParentTitle(title)
    let parentFileInfo = tempTitleFileInfoTMap.get(parentTitle)

    if (!parentFileInfo) {
      const parentPath = ''
      parentFileInfo = {
        id: parentTitle,
        parentId: null,
        path: parentPath,
        name: getName(parentTitle, parentPath),
        type: GptFileTreeItemType.Folder,
        children: [],
      }

      tempTitleFileInfoTMap.set(parentTitle, parentFileInfo)

      if (parentTitle && parentTitle !== '/') {
        // init parent
        const parentOfParent = getParent(parentTitle)

        if (!parentOfParent.children)
          parentOfParent.children = []

        parentOfParent.children.push(parentFileInfo)
      }
    }

    return parentFileInfo
  }

  const processFilePath = async (filePath: string) => {
    try {
      const content = await FileUtils.readFile({ filePath })
      const aiPresetFileConfig = await parseGptFile({
        filePath,
        userConfig: resolvedUserConfig as UserConfig,
      })
      const title = aiPresetFileConfig.title || ''
      const name = getName(title, filePath)
      const id = getId(title, name, filePath)
      const parentFileInfo = getParent(title)

      if (!parentFileInfo.children)
        parentFileInfo.children = []

      const fileNodeInfo: GptFileInfo = {
        id,
        parentId: parentFileInfo.id,
        path: filePath,
        name,
        content,
        aiPresetFileConfig,
        type: GptFileTreeItemType.File,
      }

      parentFileInfo.children.push(fileNodeInfo)
      filesInfo.push(fileNodeInfo)
    }
    catch (error) {
      console.log('processFilePath error', error)
    }
  }

  await FileUtils.travelFilesByFilterPattern({
    filePath: fullRootPath,
    exts: [...exts],
    includes,
    excludes,
    isValidPath: (filePath) => {
      return !isGitignorePaths(filePath)
    },
    callback: async (filePath) => {
      await processFilePath(filePath)
    },
  })

  filesInfoTree.push(...tempTitleFileInfoTMap.get('/')?.children || [])

  return {
    filesInfo,
    filesInfoTree,
  }
}
