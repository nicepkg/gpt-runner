import { z } from 'zod'
import type { ChatStreamReqParams, GetGptFilesReqParams, GetStorageReqParams, GetUserConfigReqParams, SaveStorageReqParams } from '../types'
import { SingleChatMessageSchema, SingleFileConfigSchema } from './config.zod'
import { ServerStorageNameSchema } from './enum.zod'

export const ChatStreamReqParamsSchema = z.object({
  messages: z.array(SingleChatMessageSchema),
  prompt: z.string(),
  systemPrompt: z.string().optional(),
  singleFileConfig: SingleFileConfigSchema.optional(),
  rootPath: z.string().optional(),
}) satisfies z.ZodType<ChatStreamReqParams>

export const GetGptFilesReqParamsSchema = z.object({
  rootPath: z.string(),
}) satisfies z.ZodType<GetGptFilesReqParams>

export const GetUserConfigReqParamsSchema = z.object({
  rootPath: z.string(),
}) satisfies z.ZodType<GetUserConfigReqParams>

export const GetStorageReqParamsSchema = z.object({
  storageName: ServerStorageNameSchema,
  key: z.string(),
}) satisfies z.ZodType<GetStorageReqParams>

export const SaveStorageReqParamsSchema = z.object({
  storageName: ServerStorageNameSchema,
  key: z.string(),
  value: z.record(z.any()).nullable().optional(),
}) satisfies z.ZodType<SaveStorageReqParams>
