import type { OpenaiBaseConfig, SingleChatMessage } from './config'

export interface BaseResponse<T = any> {
  type: 'Success' | 'Fail'
  status?: number
  message?: string
  data?: T
}

export type SuccessResponse<T = any> = Omit<BaseResponse<T>, 'type'> & { type: 'Success' }
export type FailResponse<T = any> = Omit<BaseResponse<T>, 'type'> & { type: 'Fail' }

export interface ChatStreamReqParams extends Partial<OpenaiBaseConfig> {
  messages: SingleChatMessage[]
  prompt: string
  systemPrompt?: string
}

export interface GetGptFilesReqParams {
  rootPath: string
}
