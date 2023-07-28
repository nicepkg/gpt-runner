import type { ChatModelType } from '../enum'
import type { AnthropicModelConfig } from './anthropic.config'
import type { HuggingFaceModelConfig } from './hugging-face.config'
import type { OpenaiModelConfig } from './openai.config'

export interface BaseSecrets {
  /**
   * override api request base url
   */
  basePath?: string
}

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
  [ChatModelType.Anthropic]: AnthropicModelConfig
  [ChatModelType.HuggingFace]: HuggingFaceModelConfig
  [ChatModelType.Openai]: OpenaiModelConfig
}

export type PartialChatModelTypeMap = Partial<ChatModelTypeMap>

export type GetModelConfigType<T extends ChatModelType, P extends 'config' | 'secrets'> = {
  config: ChatModelTypeMap[T]
  secrets: ChatModelTypeMap[T]['secrets']
}[P]

export type ChatModel = ChatModelTypeMap[ChatModelType]
