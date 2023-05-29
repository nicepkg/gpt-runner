import type { ChatRole } from './enum'

export interface BaseResponse<T = any> {
  type: 'Success' | 'Fail'
  status?: number
  message?: string
  data?: T
}

export type SuccessResponse<T = any> = Omit<BaseResponse<T>, 'type'> & { type: 'Success' }
export type FailResponse<T = any> = Omit<BaseResponse<T>, 'type'> & { type: 'Fail' }

export interface ChatMessage {
  name: ChatRole
  text: string
}

export interface ChatStreamReqParams {
  messages: ChatMessage[]
  prompt: string
  openaiKey?: string
  systemPrompt?: string
  temperature?: number
}
