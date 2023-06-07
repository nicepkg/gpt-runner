import type { GptFileInfo, GptFileInfoTree, SingleChatMessage, SingleFileConfig, UserConfig } from './config'
import type { ServerStorageName } from './enum'

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

export interface GptFilesTreeResData {
  filesInfo: GptFileInfo[]
  filesInfoTree: GptFileInfoTree
}

export interface GetUserConfigReqParams {
  rootPath: string
}

export interface GetUserConfigResData {
  userConfig: UserConfig
}

export interface GetStorageReqParams {
  storageName: ServerStorageName
  key: string
}

export type ServerStorageValue = Record<string, any> | null | undefined

export interface GetStorageResData {
  value: ServerStorageValue
  cacheDir: string
}

export interface SaveStorageReqParams {
  storageName: ServerStorageName
  key: string
  value?: ServerStorageValue
}

export type SaveStorageResData = null
