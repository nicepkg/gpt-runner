import type { FileInfoTree } from './common-file'
import type { SingleChatMessage, SingleFileConfig, UserConfig } from './config'
import type { ServerStorageName } from './enum'
import type { GptFileInfo, GptFileInfoTree } from './gpt-file'

export interface BaseResponse<T = any> {
  type: 'Success' | 'Fail'
  status?: number
  message?: string
  data?: T
}

export type SuccessResponse<T = any> = Omit<BaseResponse<T>, 'type'> & { type: 'Success' }
export type FailResponse<T = any> = Omit<BaseResponse<T>, 'type'> & { type: 'Fail' }

export interface ChatStreamReqParams {
  messages: SingleChatMessage[]
  prompt: string
  systemPrompt?: string
  singleFileConfig?: SingleFileConfig
  rootPath?: string
}

export interface GetGptFilesReqParams {
  rootPath: string
}

export interface GetGptFilesTreeResData {
  filesInfo: GptFileInfo[]
  filesInfoTree: GptFileInfoTree
}

export interface GetUserConfigReqParams {
  rootPath: string
}

export interface GetUserConfigResData {
  userConfig: UserConfig
}

export interface StorageGetItemReqParams {
  storageName: ServerStorageName
  key: string
}

export type ServerStorageValue = Record<string, any> | null | undefined

export interface StorageGetItemResData {
  value: ServerStorageValue
  cacheDir: string
}

export interface StorageSetItemReqParams {
  storageName: ServerStorageName
  key: string
  value?: ServerStorageValue
}

export type StorageSetItemResData = null

export interface StorageRemoveItemReqParams {
  storageName: ServerStorageName
  key: string
}

export type StorageRemoveItemResData = null

export interface StorageClearReqParams {
  storageName: ServerStorageName
}

export type StorageClearResData = null

export interface GetCommonFilesReqParams {
  rootPath: string
  excludeExts?: string[]
}

export interface GetCommonFilesResData {
  filesInfoTree: FileInfoTree
  fileExts: string[]
}
