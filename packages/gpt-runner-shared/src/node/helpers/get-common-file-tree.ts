import type { Ignore } from 'ignore'
import ignore from 'ignore'
import type { FileInfoTreeItem } from '../../common/types'
import { PathUtils } from './path-utils'
import type { TravelFilesByFilterPatternParams } from './file-utils'
import { FileUtils } from './file-utils'

interface CreateFileTreeParams {
  rootPath: string
  filePaths: string[]
  parentId?: string
}

interface CreateFileTreeReturns {
  tree: FileInfoTreeItem[]
  exts: string[]
}

function createFileTree(params: CreateFileTreeParams): CreateFileTreeReturns {
  const { rootPath, filePaths, parentId } = params
  const pathMap: Map<string, FileInfoTreeItem> = new Map()
  const exts = new Set<string>()

  filePaths.forEach((filePath) => {
    const projectRelativePath = filePath.replace(rootPath, '')
    const parts = projectRelativePath.split('/').filter(part => part.length > 0)

    let currentPath = rootPath
    let currentParentId = parentId

    parts.forEach((part, index) => {
      currentPath += `/${part}`
      const isFile = index === parts.length - 1

      if (!pathMap.get(currentPath)) {
        const ext = isFile ? part.split('.').length > 1 ? part.split('.').pop() : '' : undefined
        const item = {
          id: currentPath,
          parentId: currentParentId || null,
          projectRelativePath: currentPath.replace(rootPath, ''),
          fullPath: currentPath,
          name: part,
          isFile,
          ext,
          children: [],
        } as FileInfoTreeItem

        if (ext)
          exts.add(ext)

        pathMap.set(currentPath, item)
      }

      if (!isFile)
        currentParentId = pathMap.get(currentPath)?.id || undefined
    })
  })

  const tree: FileInfoTreeItem[] = []

  Array.from(pathMap.values()).forEach((item) => {
    if (item.parentId) {
      const parent = pathMap.get(item.parentId)
      if (parent && parent.children)
        parent.children.push(item)
    }
    else {
      tree.push(item)
    }
  })

  const sortTree = (treeItem: FileInfoTreeItem[]) => {
    treeItem.sort((a, b) => {
      if (a.isFile === b.isFile)
        return a.name.localeCompare(b.name)

      return a.isFile ? 1 : -1
    })

    treeItem.forEach((item) => {
      if (item.children)
        sortTree(item.children)
    })
  }

  sortTree(tree)

  return {
    tree,
    exts: Array.from(exts),
  }
}

export interface GetCommonFileTreeParams extends Omit<TravelFilesByFilterPatternParams, 'filePath' | 'callback'> {
  rootPath: string
  respectGitIgnore?: boolean
}

export type GetCommonFileTreeReturns = CreateFileTreeReturns

export async function getCommonFileTree(params: GetCommonFileTreeParams): Promise<GetCommonFileTreeReturns> {
  const { rootPath, respectGitIgnore = true, isValidPath, ...othersParams } = params

  const ig: Ignore | null = await (async () => {
    const gitignorePath = PathUtils.join(rootPath, '.gitignore')
    const gitignoreContent = await FileUtils.readFile({ filePath: gitignorePath })
    const ig = ignore().add(gitignoreContent)

    return ig
  })()

  const isGitignorePaths = (filePath: string): boolean => {
    if (!respectGitIgnore)
      return false

    if (filePath && filePath.match(/\/\.git\//))
      return true

    const relativePath = PathUtils.relative(rootPath, filePath)
    return ig?.ignores(relativePath) ?? false
  }

  const filePaths: string[] = []

  await FileUtils.travelFilesByFilterPattern({
    ...othersParams,
    filePath: rootPath,
    isValidPath: (filePath) => {
      return !isGitignorePaths(filePath) && isValidPath?.(filePath)
    },
    callback: async (filePath) => {
      filePaths.push(filePath)
    },
  })

  const { tree, exts } = createFileTree({ rootPath, filePaths })

  return { tree, exts }
}
