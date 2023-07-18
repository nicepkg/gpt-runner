import type { z } from 'zod'
import type { GetModelConfigType } from '../../types'
import { ChatModelType } from '../../types'
import { AnthropicModelConfigSchema, AnthropicSecretsSchema } from './anthropic.zod'
import { HuggingFaceModelConfigSchema, HuggingFaceSecretsSchema } from './hugging-face.zod'
import { OpenaiModelConfigSchema, OpenaiSecretsSchema } from './openai.zod'

export * from './base.zod'
export * from './openai.zod'
export * from './user.config'

export function getModelConfigTypeSchema<T extends ChatModelType>(modelType: T, schemaType: 'config' | 'secrets') {
  const chatModelTypeSchemaMap: {
    [key in ChatModelType]: {
      config: z.ZodType<GetModelConfigType<key, 'config'>>
      secrets: z.ZodType<GetModelConfigType<key, 'secrets'>>
    }
  } = {
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
  }
  return chatModelTypeSchemaMap[modelType][schemaType]
}
