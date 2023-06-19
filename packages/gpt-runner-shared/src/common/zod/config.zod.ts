import { z } from 'zod'
import type { BaseModelConfig, FilterPattern, FormCheckboxGroupConfig, FormFieldBaseConfig, FormInputConfig, FormItemConfig, FormOption, FormRadioGroupConfig, FormSelectConfig, FormTextareaConfig, OpenaiBaseConfig, OpenaiConfig, SingleChatMessage, SingleFileConfig, UserConfig } from '../types'
import { ChatRoleSchema } from './enum.zod'

export const FilterPatternSchema = z.union([
  z.array(z.union([z.string(), z.instanceof(RegExp)])),
  z.string(),
  z.instanceof(RegExp),
  z.function(z.tuple([z.string()]), z.boolean()).optional(),
  z.null(),
  z.undefined(),
]) satisfies z.ZodType<FilterPattern>

export const BaseModelConfigSchema = z.object({
  type: z.string(),
  modelName: z.string().optional(),
}) satisfies z.ZodType<BaseModelConfig>

export const OpenaiBaseConfigSchema = BaseModelConfigSchema.extend({
  type: z.literal('openai'),
  openaiKey: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  topP: z.number().optional(),
  frequencyPenalty: z.number().optional(),
  presencePenalty: z.number().optional(),
}) satisfies z.ZodType<OpenaiBaseConfig>

export const OpenaiConfigSchema = OpenaiBaseConfigSchema.extend({
  type: z.literal('openai'),
}) satisfies z.ZodType<OpenaiConfig>

export const UserConfigSchema = z.object({
  model: OpenaiConfigSchema.optional(),
  rootPath: z.string().optional(),
  exts: z.array(z.string()).optional().default(['.gpt.md']),
  includes: FilterPatternSchema.optional().default(null),
  excludes: FilterPatternSchema.optional().default(null),
  respectGitIgnore: z.boolean().optional().default(true),
}) satisfies z.ZodType<UserConfig>

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
  model: OpenaiBaseConfigSchema.optional(),
  title: z.string().optional(),
  userPrompt: z.string().optional(),
  systemPrompt: z.string().optional(),
  messages: z.array(SingleChatMessageSchema).optional(),
  forms: z.record(FormItemConfigSchema).optional(),
}) as z.ZodType<SingleFileConfig>
