import type { AiPersonTreeItemInfo, AiPersonTreeItemInfoTreeItem, GlobalAiPersonConfig } from '@nicepkg/gpt-runner-shared/common'
import { AiPersonTreeItemType, globalAiPersonConfigWithDefault } from '@nicepkg/gpt-runner-shared/common'
import { FileUtils, PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { parseAiPersonFile } from './parser'
import { getIgnoreFunction } from './gitignore'

export interface GetAiPersonFilesInfoParams {
  globalAiPersonConfig: GlobalAiPersonConfig
}

export interface GetAiPersonFilesInfoResult {
  filesInfo: AiPersonTreeItemInfo[]
  filesInfoTree: AiPersonTreeItemInfoTreeItem[]
}

export async function getGptFilesInfo(params: GetAiPersonFilesInfoParams): Promise<GetAiPersonFilesInfoResult> {
  const { globalAiPersonConfig } = params
  const resolvedGlobalAiPersonConfig = globalAiPersonConfigWithDefault(globalAiPersonConfig)
  const {
    rootPath = '',
    exts,
    includes,
    excludes,
    respectGitIgnore = true,
  } = resolvedGlobalAiPersonConfig

  const isGitIgnore = await getIgnoreFunction({ rootPath })

  const isGitignorePaths = (filePath: string): boolean => {
    if (!respectGitIgnore)
      return false

    if (filePath && filePath.match(/\/\.git\//))
      return true

    return isGitIgnore(filePath)
  }

  const fullRootPath = PathUtils.resolve(rootPath)

  const filesInfo: AiPersonTreeItemInfo[] = []
  const filesInfoTree: AiPersonTreeItemInfoTreeItem[] = []
  const tempTitleFileInfoTMap = new Map<string, AiPersonTreeItemInfoTreeItem>()

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

  const getParent = (title: string): AiPersonTreeItemInfoTreeItem => {
    const parentTitle = getParentTitle(title)
    let parentFileInfo = tempTitleFileInfoTMap.get(parentTitle)

    if (!parentFileInfo) {
      const parentPath = ''
      parentFileInfo = {
        id: parentTitle,
        parentId: null,
        path: parentPath,
        name: getName(parentTitle, parentPath),
        type: AiPersonTreeItemType.Folder,
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
      const aiPersonConfig = await parseAiPersonFile({
        filePath,
        globalAiPersonConfig: resolvedGlobalAiPersonConfig as GlobalAiPersonConfig,
      })
      const title = aiPersonConfig.title || ''
      const name = getName(title, filePath)
      const id = getId(title, name, filePath)
      const parentFileInfo = getParent(title)

      if (!parentFileInfo.children)
        parentFileInfo.children = []

      const fileNodeInfo: AiPersonTreeItemInfo = {
        id,
        parentId: parentFileInfo.id,
        path: filePath,
        name,
        content,
        aiPersonConfig,
        type: AiPersonTreeItemType.File,
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
