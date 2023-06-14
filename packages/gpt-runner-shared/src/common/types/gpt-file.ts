import type { TreeItem } from './common'
import type { SingleFileConfig } from './config'
import type { GptFileTreeItemType } from './enum'

export interface GptPathBaseInfo {
  id: string
  parentId: string | null
  path: string
  name: string
  type: GptFileTreeItemType
}

export interface GptFileInfo extends GptPathBaseInfo {
  type: GptFileTreeItemType.File
  content: string
  singleFileConfig: SingleFileConfig
}

export interface GptFolderInfo extends GptPathBaseInfo {
  type: GptFileTreeItemType.Folder
}

export interface GptChatInfo extends GptPathBaseInfo {
  type: GptFileTreeItemType.Chat
  createAt: number
}

export type GptFileInfoTreeItem = TreeItem<GptFolderInfo | GptFileInfo | GptChatInfo>
export type GptFileInfoTree = GptFileInfoTreeItem[]
