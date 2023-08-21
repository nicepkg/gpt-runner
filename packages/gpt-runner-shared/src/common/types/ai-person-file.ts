import type { TreeItem } from './common'
import type { AiPersonConfig } from './config'
import type { AiPersonTreeItemType } from './enum'

export interface AiPersonBaseInfo {
  categoryPath: string
  name: string
  type: AiPersonTreeItemType
}

export interface AiPersonFileInfo extends AiPersonBaseInfo {
  sourcePath: string
  type: AiPersonTreeItemType.File
  content: string
  aiPersonConfig: AiPersonConfig
}

export interface AiPersonGroupInfo extends AiPersonBaseInfo {
  type: AiPersonTreeItemType.Folder
}

export type AiPersonTreeItemInfo = AiPersonFileInfo | AiPersonGroupInfo

export type AiPersonTreeItemInfoTreeItem = TreeItem<AiPersonTreeItemInfo>
