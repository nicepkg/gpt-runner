import { z } from 'zod'
import { ChatModelType, type HuggingFaceModelConfig, type HuggingFaceSecrets } from '../../types'
import { BaseModelConfigSchema, BaseSecretsSchema } from './base.zod'

export const HuggingFaceSecretsSchema = BaseSecretsSchema.extend({
  apiKey: z.string().optional().describe('The HuggingFace API key'),
}) satisfies z.ZodType<HuggingFaceSecrets>

export const HuggingFaceModelConfigSchema = BaseModelConfigSchema.extend({
  type: z.literal(ChatModelType.HuggingFace).describe('Use Open AI model'),
  secrets: HuggingFaceSecretsSchema.optional().describe('The HuggingFace API secrets config'),
  temperature: z.number().optional().describe('The temperature for the HuggingFace model'),
  maxTokens: z.number().optional().describe('The maximum number of tokens for the HuggingFace model'),
  topP: z.number().optional().describe('The top P value for the HuggingFace model'),
  topK: z.number().optional().describe('The top K value for the HuggingFace model'),
  frequencyPenalty: z.number().optional().describe('The frequency penalty for the HuggingFace model'),
}) satisfies z.ZodType<HuggingFaceModelConfig>
