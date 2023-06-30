import type { ChatModelType } from '../enum'
import type { HuggingFaceModelConfig } from './hugging-face.config'
import type { OpenaiModelConfig } from './openai.config'

export interface BaseModelConfig {
  /**
   * mode type
   */
  type?: ChatModelType

  /**
   * Model name to use
   */
  modelName?: string

  /**
   * some secrets config, that will not send to client
   */
  secrets?: Record<string, any>
}

export interface ChatModelTypeMap {
  [ChatModelType.Openai]: OpenaiModelConfig
  [ChatModelType.HuggingFace]: HuggingFaceModelConfig
}

export type GetModelConfigType<T extends ChatModelType, P extends 'config' | 'secrets'> = {
  config: ChatModelTypeMap[T]
  secrets: ChatModelTypeMap[T]['secrets']
}[P]

export type ChatModel = ChatModelTypeMap[ChatModelType]
