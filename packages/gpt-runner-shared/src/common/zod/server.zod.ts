import { z } from 'zod'
import type { ChatStreamReqParams, GetCommonFilesReqParams, GetGptFileInfoReqParams, GetGptFilesReqParams, GetUserConfigReqParams, InitGptFilesReqParams, OpenEditorReqParams, StorageClearReqParams, StorageGetItemReqParams, StorageRemoveItemReqParams, StorageSetItemReqParams } from '../types'
import { SingleChatMessageSchema, SingleFileConfigSchema } from './config'
import { ServerStorageNameSchema } from './enum.zod'

export const ChatStreamReqParamsSchema = z.object({
  messages: z.array(SingleChatMessageSchema),
  prompt: z.string(),
  systemPrompt: z.string().optional(),
  appendSystemPrompt: z.string().optional(),
  singleFilePath: z.string().optional(),
  singleFileConfig: SingleFileConfigSchema.optional(),
  contextFilePaths: z.array(z.string()).optional(),
  rootPath: z.string().optional(),
}) satisfies z.ZodType<ChatStreamReqParams>

export const GetGptFilesReqParamsSchema = z.object({
  rootPath: z.string(),
}) satisfies z.ZodType<GetGptFilesReqParams>

export const GetGptFileInfoReqParamsSchema = z.object({
  rootPath: z.string(),
  filePath: z.string(),
}) satisfies z.ZodType<GetGptFileInfoReqParams>

export const InitGptFilesReqParamsSchema = z.object({
  rootPath: z.string(),
  gptFilesNames: z.array(z.string()),
}) satisfies z.ZodType<InitGptFilesReqParams>

export const GetUserConfigReqParamsSchema = z.object({
  rootPath: z.string(),
}) satisfies z.ZodType<GetUserConfigReqParams>

export const StorageGetItemReqParamsSchema = z.object({
  storageName: ServerStorageNameSchema,
  key: z.string(),
}) satisfies z.ZodType<StorageGetItemReqParams>

export const StorageSetItemReqParamsSchema = z.object({
  storageName: ServerStorageNameSchema,
  key: z.string(),
  value: z.record(z.any()).nullable().optional(),
}) satisfies z.ZodType<StorageSetItemReqParams>

export const StorageRemoveItemReqParamsSchema = z.object({
  storageName: ServerStorageNameSchema,
  key: z.string(),
}) satisfies z.ZodType<StorageRemoveItemReqParams>

export const StorageClearReqParamsSchema = z.object({
  storageName: ServerStorageNameSchema,
}) satisfies z.ZodType<StorageClearReqParams>

export const GetCommonFilesReqParamsSchema = z.object({
  rootPath: z.string(),
  excludeExts: z.array(z.string()).optional(),
}) satisfies z.ZodType<GetCommonFilesReqParams>

export const OpenEditorReqParamsSchema = z.object({
  rootPath: z.string().optional(),
  path: z.string(),
  matchContent: z.string().optional(),
}) satisfies z.ZodType<OpenEditorReqParams>
