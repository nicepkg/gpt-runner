import { z } from 'zod'
import { type AiPersonConfig, type ChatModel, ChatModelType, type FilterPattern, type FormCheckboxGroupConfig, type FormFieldBaseConfig, type FormInputConfig, type FormItemConfig, type FormOption, type FormRadioGroupConfig, type FormSelectConfig, type FormTextareaConfig, type GlobalAiPersonConfig, type GlobalAiPersonConfigForUser, type SingleChatMessage } from '../../types'
import { ChatRoleSchema } from '../enum.zod'
import type { PartialChatModelTypeMap } from '../../types/config/base.config'
import { AnthropicModelConfigSchema } from './anthropic.zod'
import { HuggingFaceModelConfigSchema } from './hugging-face.zod'
import { OpenaiModelConfigSchema } from './openai.zod'

export const FilterPatternSchema = z.union([
  z.array(z.union([z.string(), z.instanceof(RegExp)])),
  z.string(),
  z.instanceof(RegExp),
  z.function(z.tuple([z.string()]), z.boolean()).optional(),
  z.null(),
  z.undefined(),
]) satisfies z.ZodType<FilterPattern>

export const ChatModelSchema = z.union([
  AnthropicModelConfigSchema,
  HuggingFaceModelConfigSchema,
  OpenaiModelConfigSchema,
]) satisfies z.ZodType<ChatModel>

export const PartialChatModelTypeMapSchema = z.object({
  [ChatModelType.Anthropic]: AnthropicModelConfigSchema.optional(),
  [ChatModelType.HuggingFace]: HuggingFaceModelConfigSchema.optional(),
  [ChatModelType.Openai]: OpenaiModelConfigSchema.optional(),
}) satisfies z.ZodType<PartialChatModelTypeMap>

export const GlobalAiPersonConfigSchema = z.object({
  model: ChatModelSchema.optional().describe('The LLM model configuration'),
  rootPath: z.string().optional().describe('The root path of the project'),
  exts: z.array(z.string()).optional().default(['.gpt.md']).describe('The file extensions to be used'),
  includes: FilterPatternSchema.optional().default(null).describe('The include patterns for filtering files'),
  excludes: FilterPatternSchema.optional().default(null).describe('The exclude patterns for filtering files'),
  respectGitIgnore: z.boolean().optional().default(true).describe('Whether to respect .gitignore rules'),
  urlConfig: z.record(z.object({
    modelNames: z.array(z.string()).optional().describe('The model name that will be displayed in the model selector'),
    httpRequestHeader: z.record(z.string()).optional().describe('Additional request headers are required'),
  })).optional().default({}).describe('Custom http request headers and models names for specific urls'),
}) satisfies z.ZodType<GlobalAiPersonConfig>

export const GlobalAiPersonConfigForUserSchema = GlobalAiPersonConfigSchema.omit({
  rootPath: true,
  exts: true,
}) satisfies z.ZodType<GlobalAiPersonConfigForUser>

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

export const AiPersonConfigSchema = z.object({
  model: GlobalAiPersonConfigSchema.shape.model,
  title: z.string().optional(),
  userPrompt: z.string().optional(),
  systemPrompt: z.string().optional(),
  messages: z.array(SingleChatMessageSchema).optional(),
  forms: z.record(FormItemConfigSchema).optional(),
}) as z.ZodType<AiPersonConfig>
