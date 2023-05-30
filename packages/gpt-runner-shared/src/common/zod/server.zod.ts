import { z } from 'zod'
import type { ChatStreamReqParams, GetGptFilesReqParams } from '../types'
import { OpenaiBaseConfigSchema, SingleChatMessageSchema } from './config.zod'

export const ChatStreamReqParamsSchema = z.object({
  ...OpenaiBaseConfigSchema.partial().shape,
  messages: z.array(SingleChatMessageSchema),
  prompt: z.string(),
  systemPrompt: z.string().optional(),
}) satisfies z.ZodType<ChatStreamReqParams>

export const GetGptFilesReqParamsSchema = z.object({
  rootPath: z.string(),
}) satisfies z.ZodType<GetGptFilesReqParams>
