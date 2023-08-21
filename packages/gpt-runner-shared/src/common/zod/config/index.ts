import type { z } from 'zod'
import type { GetModelConfigType } from '../../types'
import { ChatModelType } from '../../types'
import { AnthropicModelConfigSchema, AnthropicSecretsSchema } from './anthropic.zod'
import { HuggingFaceModelConfigSchema, HuggingFaceSecretsSchema } from './hugging-face.zod'
import { OpenaiModelConfigSchema, OpenaiSecretsSchema } from './openai.zod'

export * from './base.zod'
export * from './openai.zod'
export * from './ai-person.zod'

interface ModelConfig<T extends ChatModelType> {
  config: z.ZodType<GetModelConfigType<T, 'config'>>
  secrets: z.ZodType<GetModelConfigType<T, 'secrets'>>
}

export function getModelConfig<T extends ChatModelType, K extends keyof ModelConfig<T>>(modelType: T, key: K) {
  const chatModelConfigMap = ({
    [ChatModelType.Anthropic]: {
      config: AnthropicModelConfigSchema,
      secrets: AnthropicSecretsSchema,
    },
    [ChatModelType.HuggingFace]: {
      config: HuggingFaceModelConfigSchema,
      secrets: HuggingFaceSecretsSchema,
    },
    [ChatModelType.Openai]: {
      config: OpenaiModelConfigSchema,
      secrets: OpenaiSecretsSchema,
    },
  } as const) satisfies {
    [Key in ChatModelType]: ModelConfig<Key>
  }

  return chatModelConfigMap[modelType][key]
}
