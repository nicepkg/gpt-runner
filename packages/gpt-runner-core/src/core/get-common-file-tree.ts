import type { FileInfoTreeItem } from '@nicepkg/gpt-runner-shared/common'
import { travelTreeDeepFirst } from '@nicepkg/gpt-runner-shared/common'
import type { TravelFilesByFilterPatternParams } from '@nicepkg/gpt-runner-shared/node'
import { FileUtils, PathUtils } from '@nicepkg/gpt-runner-shared/node'
import { countFileTokens } from './count-tokens'
import { getIgnoreFunction } from './gitignore'

interface CreateFileTreeParams {
  rootPath: string
  filePaths: string[]
  parentId?: string
}

interface CreateFileTreeReturns {
  tree: FileInfoTreeItem[]
  includeFileExts: string[]
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

    const ext = PathUtils.extname(filePath)

    if (ext)
      exts.add(ext)

    parts.forEach((part, index) => {
      currentPath += `/${part}`
      const isFile = index === parts.length - 1

      if (!pathMap.get(currentPath)) {
        const relativePath = PathUtils.relative(rootPath, currentPath)

        const tokenNum = isFile ? countFileTokens(currentPath) : 0
        const item = {
          id: currentPath,
          parentId: currentParentId || null,
          projectRelativePath: relativePath,
          fullPath: currentPath,
          name: part,
          isFile,
          ext: isFile ? ext : undefined,
          tokenNum,
          children: [],
        } as FileInfoTreeItem

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
    return treeItem
  }

  let finalTree = travelTreeDeepFirst(tree, (item) => {
    if (!item.isFile && item.children) {
      item.children = sortTree(item.children)
      item.tokenNum = item.children.reduce((sum, child) => sum + child.tokenNum, 0)
    }
    return item
  })

  finalTree = sortTree(finalTree)

  return {
    tree: finalTree,
    includeFileExts: [...exts],
  }
}

export interface GetCommonFileTreeParams extends Omit<TravelFilesByFilterPatternParams, 'filePath' | 'callback'> {
  rootPath: string
  respectGitIgnore?: boolean
}

export type GetCommonFileTreeReturns = CreateFileTreeReturns

export async function getCommonFileTree(params: GetCommonFileTreeParams): Promise<GetCommonFileTreeReturns> {
  const { rootPath, respectGitIgnore = true, isValidPath, ...othersParams } = params

  const isGitIgnore = await getIgnoreFunction({ rootPath })

  const isGitignorePaths = (filePath: string): boolean => {
    if (!respectGitIgnore)
      return false

    if (filePath && filePath.match(/\/\.git\//))
      return true

    return isGitIgnore(filePath)
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

  const { tree, includeFileExts } = createFileTree({ rootPath, filePaths })

  return { tree, includeFileExts }
}

export interface CreateFileContextParams {
  rootPath: string
  filePaths: string[]
}

export async function createFileContext(params: CreateFileContextParams) {
  const { rootPath, filePaths } = params

  const baseTips = `Please answer the user's question based on the user's file path and file content.
  The file path and file content will be separated by five single quotes.
  This is the file path and file content that the user is currently asking:
`

  let tips = baseTips

  for (const filePath of filePaths) {
    const relativePath = PathUtils.relative(rootPath, filePath)
    const content = await FileUtils.readFile({ filePath })

    const fileTips = `'''''
[file path]
${relativePath}

[file content]
${content}
'''''

`

    tips += fileTips
  }

  tips += `\nWhen you want to create/modify/delete a file or talk about a file, you should always return the full path of the file.

For example, if user provide you with a file path \`src/component/button.ts\`, you should return \`src/component/button.ts\` instead of \`button.ts\ when you talk about it.

Return full path is very important !!!
`

  return tips
}
