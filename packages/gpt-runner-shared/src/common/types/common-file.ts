import type { TreeItem } from './common'

export interface FileBaseInfo {
  id: string
  parentId: string | null
  projectRelativePath: string
  fullPath: string
  name: string
}

export interface FileInfo extends FileBaseInfo {
  isFile: true
  ext: string
}

export interface FolderInfo extends FileBaseInfo {
  isFile: false
}

export type FileInfoTreeItem = TreeItem<FolderInfo | FileInfo>
export type FileInfoTree = FileInfoTreeItem[]
