import type { TreeItem } from './common'
import type { AiPresetFileConfig } from './config'
import type { AiPresetTreeItemType } from './enum'

export interface AiPresetBaseInfo {
  groupPath: string
  name: string
  type: AiPresetTreeItemType
}

export interface AiPresetFileInfo extends AiPresetBaseInfo {
  sourcePath: string
  type: AiPresetTreeItemType.File
  content: string
  aiPresetFileConfig: AiPresetFileConfig
}

export interface AiPresetGroupInfo extends AiPresetBaseInfo {
  type: AiPresetTreeItemType.Folder
}

export type AiPresetInfo = AiPresetFileInfo | AiPresetGroupInfo

export type AiPresetInfoTreeItem = TreeItem<AiPresetInfo>
