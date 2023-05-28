import type { GptFileInfo } from './get-gpt-files-info'

export interface FileInfo extends Partial<GptFileInfo> {
  path: string
  isDirectory: boolean
}

export interface GptFileInfoTreeItem extends FileInfo {
  children?: GptFileInfoTreeItem[]
}

export interface GptFilesInfoToTreeProps {
  gptFilesInfo: GptFileInfo[]
}

export type GptFilesInfoToTree = GptFileInfoTreeItem[]

export function gptFilesInfoToTree(props: GptFilesInfoToTreeProps): GptFilesInfoToTree {
  const { gptFilesInfo } = props

  const gptFilesInfoTree: GptFileInfoTreeItem[] = []
  const tempMap = new Map<string, GptFileInfoTreeItem>()

  for (const gptFileInfo of gptFilesInfo) {
    const { singleFileConfig } = gptFileInfo
    const { title = '' } = singleFileConfig
    const titleParts = title.split('/')
    const parentTitleParts = titleParts.slice(0, -1)
    const fileInfo: FileInfo = {
      ...gptFileInfo,
      isDirectory: false,
    }

    if (parentTitleParts.length) {
      const parentTitle = parentTitleParts.join('/')
      const parent = tempMap.get(parentTitle)
      if (parent) {
        if (!parent.children)
          parent.children = []

        parent.children.push(fileInfo)
      }
      else {
        const parent: GptFileInfoTreeItem = {
          path: parentTitle,
          isDirectory: true,
          children: [fileInfo],
        }
        tempMap.set(parentTitle, parent)
        gptFilesInfoTree.push(parent)
      }
    }
    else {
      gptFilesInfoTree.push(fileInfo)
    }
  }

  return gptFilesInfoTree
}
