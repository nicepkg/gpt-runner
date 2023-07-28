import { z } from 'zod'
import { type AnthropicModelConfig, type AnthropicSecrets, ChatModelType } from '../../types'
import { DEFAULT_API_BASE_PATH } from '../../helpers'
import { BaseModelConfigSchema, BaseSecretsSchema } from './base.zod'

export const AnthropicSecretsSchema = BaseSecretsSchema.extend({
  apiKey: z.string().optional().describe('The Anthropic API key'),
  basePath: z.string().optional().default(DEFAULT_API_BASE_PATH[ChatModelType.Anthropic]).describe('The Anthropic base API url'),
}) satisfies z.ZodType<AnthropicSecrets>

export const AnthropicModelConfigSchema = BaseModelConfigSchema.extend({
  type: z.literal(ChatModelType.Anthropic).describe('Use Anthropic model'),
  secrets: AnthropicSecretsSchema.optional().describe('The Anthropic API secrets config'),
  temperature: z.number().optional().describe('The temperature for the Anthropic model'),
  maxTokens: z.number().optional().describe('The maximum number of tokens for the Anthropic model'),
  topP: z.number().optional().describe('The top P value for the Anthropic model'),
  topK: z.number().optional().describe('The top K value for the Anthropic model'),
}) satisfies z.ZodType<AnthropicModelConfig>
