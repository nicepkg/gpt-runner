import { z } from 'zod'
import type { BaseModelConfig, FilterPattern, FormCheckboxGroupConfig, FormFieldBaseConfig, FormInputConfig, FormItemConfig, FormOption, FormRadioGroupConfig, FormSelectConfig, FormTextareaConfig, OpenaiModelConfig, OpenaiSecrets, SingleChatMessage, SingleFileConfig, UserConfig, UserConfigForUser } from '../types'
import { DEFAULT_OPENAI_API_BASE_PATH } from '../helpers'
import { ChatModelTypeSchema, ChatRoleSchema } from './enum.zod'

export const FilterPatternSchema = z.union([
  z.array(z.union([z.string(), z.instanceof(RegExp)])),
  z.string(),
  z.instanceof(RegExp),
  z.function(z.tuple([z.string()]), z.boolean()).optional(),
  z.null(),
  z.undefined(),
]) satisfies z.ZodType<FilterPattern>

export const BaseModelConfigSchema = z.object({
  type: ChatModelTypeSchema.describe('The type of the model'),
  modelName: z.string().optional().describe('The name of the model'),
  secrets: z.any().optional().describe('The API secrets config'),
}) satisfies z.ZodType<BaseModelConfig>

export const OpenaiSecretsSchema = z.object({
  apiKey: z.string().optional().describe('The OpenAI API key'),
  organization: z.string().optional().describe('The OpenAI organization'),
  username: z.string().optional().describe('The OpenAI username'),
  password: z.string().optional().describe('The OpenAI password'),
  accessToken: z.string().optional().describe('The OpenAI access token'),
  basePath: z.string().optional().default(DEFAULT_OPENAI_API_BASE_PATH).describe('The Chatgpt base path'),
}) satisfies z.ZodType<OpenaiSecrets>

export const OpenaiModelConfigSchema = BaseModelConfigSchema.extend({
  type: z.literal('openai').describe('Use Open AI model'),
  secrets: OpenaiSecretsSchema.optional().describe('The OpenAI API secrets config'),
  temperature: z.number().optional().describe('The temperature for the OpenAI model'),
  maxTokens: z.number().optional().describe('The maximum number of tokens for the OpenAI model'),
  topP: z.number().optional().describe('The top P value for the OpenAI model'),
  frequencyPenalty: z.number().optional().describe('The frequency penalty for the OpenAI model'),
  presencePenalty: z.number().optional().describe('The presence penalty for the OpenAI model'),
}) satisfies z.ZodType<OpenaiModelConfig>

export const OpenaiBaseConfigSchema = OpenaiModelConfigSchema.omit({
  type: true,
})

export const UserConfigSchema = z.object({
  model: OpenaiModelConfigSchema.optional().describe('The LLM model configuration'),
  rootPath: z.string().optional().describe('The root path of the project'),
  exts: z.array(z.string()).optional().default(['.gpt.md']).describe('The file extensions to be used'),
  includes: FilterPatternSchema.optional().default(null).describe('The include patterns for filtering files'),
  excludes: FilterPatternSchema.optional().default(null).describe('The exclude patterns for filtering files'),
  respectGitIgnore: z.boolean().optional().default(true).describe('Whether to respect .gitignore rules'),
}) satisfies z.ZodType<UserConfig>

export const UserConfigForUserSchema = UserConfigSchema.omit({
  rootPath: true,
}) satisfies z.ZodType<UserConfigForUser>

export const SingleChatMessageSchema = z.object({
  name: ChatRoleSchema,
  text: z.string(),
}) satisfies z.ZodType<SingleChatMessage>

export const FormOptionSchema = z.object({
  label: z.string().optional(),
  value: z.string(),
}) satisfies z.ZodType<FormOption>

export const FormFieldBaseConfigSchema = z.object({
  type: z.string(),
  defaultValue: z.any().optional(),
  description: z.string().optional(),
}) satisfies z.ZodType<FormFieldBaseConfig>

export const FormInputConfigSchema = FormFieldBaseConfigSchema.extend({
  type: z.literal('input'),
}) satisfies z.ZodType<FormInputConfig>

export const FormTextareaConfigSchema = FormFieldBaseConfigSchema.extend({
  type: z.literal('textarea'),
  row: z.number().optional(),
}) satisfies z.ZodType<FormTextareaConfig>

export const FormSelectConfigSchema = FormFieldBaseConfigSchema.extend({
  type: z.literal('select'),
  options: z.array(FormOptionSchema),
}) satisfies z.ZodType<FormSelectConfig>

export const FormCheckboxGroupConfigSchema = FormFieldBaseConfigSchema.extend({
  type: z.literal('checkbox-group'),
  options: z.array(FormOptionSchema),
}).refine(config => Array.isArray(config.defaultValue), {
  message: 'defaultValue must be an array of strings for checkbox-group',
  path: ['defaultValue'],
}) satisfies z.ZodType<FormCheckboxGroupConfig>

export const FormRadioGroupConfigSchema = FormFieldBaseConfigSchema.extend({
  type: z.literal('radio-group'),
  options: z.array(FormOptionSchema),
}) satisfies z.ZodType<FormRadioGroupConfig>

export const FormItemConfigSchema = z.union([
  FormInputConfigSchema,
  FormTextareaConfigSchema,
  FormSelectConfigSchema,
  FormCheckboxGroupConfigSchema,
  FormRadioGroupConfigSchema,
]) satisfies z.ZodType<FormItemConfig>

export const SingleFileConfigSchema = z.object({
  model: UserConfigSchema.shape.model,
  title: z.string().optional(),
  userPrompt: z.string().optional(),
  systemPrompt: z.string().optional(),
  messages: z.array(SingleChatMessageSchema).optional(),
  forms: z.record(FormItemConfigSchema).optional(),
}) as z.ZodType<SingleFileConfig>
