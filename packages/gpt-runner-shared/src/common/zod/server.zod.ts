import { z } from 'zod'
import type { ChatStreamReqParams, GetGptFilesReqParams, GetUserConfigReqParams } from '../types'
import { SingleChatMessageSchema, SingleFileConfigSchema } from './config.zod'

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

export const GetStateReqParamsSchema = z.object({
  key: z.string(),
})

export const SaveStateReqParamsSchema = z.object({
  key: z.string(),
  state: z.record(z.any()).nullable().optional(),
})
