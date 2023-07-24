import { z } from 'zod'
import type { ChatStreamReqParams, CreateFilePathReqParams, DeleteFilePathReqParams, GetAppConfigReqParams, GetCommonFilesReqParams, GetFileInfoReqParams, GetGptFileInfoReqParams, GetGptFilesReqParams, GetUserConfigReqParams, InitGptFilesReqParams, MarkAsVisitedAppConfigReqParams, OpenEditorReqParams, RenameFilePathReqParams, SaveFileContentReqParams, StorageClearReqParams, StorageGetItemReqParams, StorageRemoveItemReqParams, StorageSetItemReqParams } from '../types'
import { PartialChatModelTypeMapSchema, SingleChatMessageSchema, SingleFileConfigSchema } from './config'
import { ChatModelTypeSchema, LocaleLangSchema, ServerStorageNameSchema } from './enum.zod'

export const ChatStreamReqParamsSchema = z.object({
  messages: z.array(SingleChatMessageSchema),
  prompt: z.string(),
  systemPrompt: z.string().optional(),
  appendSystemPrompt: z.string().optional(),
  systemPromptAsUserPrompt: z.boolean().optional(),
  singleFilePath: z.string().optional(),
  singleFileConfig: SingleFileConfigSchema.optional(),
  overrideModelType: ChatModelTypeSchema.optional(),
  overrideModelsConfig: PartialChatModelTypeMapSchema.optional(),
  modelTypeVendorNameMap: z.record(z.string()).optional(),
  contextFilePaths: z.array(z.string()).optional(),
  editingFilePath: z.string().optional(),
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

export const CreateFilePathReqParamsSchema = z.object({
  fileFullPath: z.string(),
  isDir: z.boolean(),
}) satisfies z.ZodType<CreateFilePathReqParams>

export const RenameFilePathReqParamsSchema = z.object({
  oldFileFullPath: z.string(),
  newFileFullPath: z.string(),
}) satisfies z.ZodType<RenameFilePathReqParams>

export const DeleteFilePathReqParamsSchema = z.object({
  fileFullPath: z.string(),
}) satisfies z.ZodType<DeleteFilePathReqParams>

export const GetFileInfoReqParamsSchema = z.object({
  fileFullPath: z.string(),
}) satisfies z.ZodType<GetFileInfoReqParams>

export const SaveFileContentReqParamsSchema = z.object({
  fileFullPath: z.string(),
  content: z.string(),
}) satisfies z.ZodType<SaveFileContentReqParams>

export const GetAppConfigReqParamsSchema = z.object({
  langId: LocaleLangSchema.optional(),
}) satisfies z.ZodType<GetAppConfigReqParams>

export const MarkAsVisitedAppConfigReqParamsSchema = z.object({
  types: z.array(z.union([
    z.literal('notificationDate'),
    z.literal('releaseDate'),
  ])),
}) satisfies z.ZodType<MarkAsVisitedAppConfigReqParams>
