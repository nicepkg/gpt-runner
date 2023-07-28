import { z } from 'zod'
import type { BaseModelConfig, BaseSecrets } from '../../types'
import { ChatModelTypeSchema } from '../enum.zod'

export const BaseSecretsSchema = z.object({
  basePath: z.string().optional().describe('The base API url'),
}) satisfies z.ZodType<BaseSecrets>

export const BaseModelConfigSchema = z.object({
  type: ChatModelTypeSchema.optional().describe('The type of the model'),
  modelName: z.string().optional().describe('The name of the model'),
  secrets: z.any().optional().describe('The API secrets config'),
}) satisfies z.ZodType<BaseModelConfig>
