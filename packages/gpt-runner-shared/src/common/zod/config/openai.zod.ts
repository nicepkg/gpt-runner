import { z } from 'zod'
import { ChatModelType, type OpenaiModelConfig, type OpenaiSecrets } from '../../types'
import { DEFAULT_OPENAI_API_BASE_PATH } from '../../helpers'
import { BaseModelConfigSchema } from './base.zod'

export const OpenaiSecretsSchema = z.object({
  apiKey: z.string().optional().describe('The OpenAI API key'),
  organization: z.string().optional().describe('The OpenAI organization'),
  // username: z.string().optional().describe('The OpenAI username'),
  // password: z.string().optional().describe('The OpenAI password'),
  accessToken: z.string().optional().describe('The OpenAI access token'),
  basePath: z.string().optional().default(DEFAULT_OPENAI_API_BASE_PATH).describe('The OpenAI base API path'),
}) satisfies z.ZodType<OpenaiSecrets>

export const OpenaiModelConfigSchema = BaseModelConfigSchema.extend({
  type: z.literal(ChatModelType.Openai).describe('Use OpenAI model'),
  secrets: OpenaiSecretsSchema.optional().describe('The OpenAI API secrets config'),
  temperature: z.number().optional().describe('The temperature for the OpenAI model'),
  maxTokens: z.number().optional().describe('The maximum number of tokens for the OpenAI model'),
  topP: z.number().optional().describe('The top P value for the OpenAI model'),
  frequencyPenalty: z.number().optional().describe('The frequency penalty for the OpenAI model'),
  presencePenalty: z.number().optional().describe('The presence penalty for the OpenAI model'),
}) satisfies z.ZodType<OpenaiModelConfig>
