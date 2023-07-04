import type { z } from 'zod'
import type { GetModelConfigType } from '../../types'
import { ChatModelType } from '../../types'
import { OpenaiModelConfigSchema, OpenaiSecretsSchema } from './openai.zod'
import { HuggingFaceModelConfigSchema, HuggingFaceSecretsSchema } from './hugging-face.zod'

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
    [ChatModelType.Openai]: {
      config: OpenaiModelConfigSchema,
      secrets: OpenaiSecretsSchema,
    },
    [ChatModelType.HuggingFace]: {
      config: HuggingFaceModelConfigSchema,
      secrets: HuggingFaceSecretsSchema,
    },
  }
  return chatModelTypeSchemaMap[modelType][schemaType]
}
