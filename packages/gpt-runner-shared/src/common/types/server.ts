import type { GptFileInfo, GptFileInfoTree, SingleChatMessage, SingleFileConfig, UserConfig } from './config'

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

export interface GetStateReqParams {
  key: string
}

export type FrontendState = Record<string, any> | null | undefined

export interface GetStateResData {
  state: FrontendState
}

export interface SaveStateReqParams {
  key: string
  state: FrontendState
}

export type SaveStateResData = null
