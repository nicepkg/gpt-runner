import type { CurrentAppConfig, MarkedAsVisitedType } from './app-config'
import type { FileInfoTree } from './common-file'
import type { AiPresetFileConfig, PartialChatModelTypeMap, SingleChatMessage, UserConfig } from './config'
import type { ChatModelType, LocaleLang, ServerStorageName } from './enum'
import type { GptFileInfo, GptFileInfoTree } from './ai-preset-file'

export interface BaseResponse<T = any> {
  type: 'Success' | 'Fail'
  status?: number
  message?: string
  data?: T
}

export type SuccessResponse<T = any> = Omit<BaseResponse<T>, 'type'> & { type: 'Success' }
export type FailResponse<T = any> = Omit<BaseResponse<T>, 'type'> & { type: 'Fail' }

export interface ProxySecrets {
  proxyUrl: string
}

export type ModelTypeVendorNameMap = {
  [K in ChatModelType]?: string
}

export interface ChatStreamReqParams {
  messages: SingleChatMessage[]
  prompt: string

  /**
   * most times we don't use systemPrompt, we parse .gpt.md file
   * and get the real time systemPrompt and then provide  systemPrompt + appendSystemPrompt to LangchainJs
   */
  systemPrompt?: string
  appendSystemPrompt?: string

  /**
   * send system prompt as user prompt
   * @default false
   */
  systemPromptAsUserPrompt?: boolean
  aiPresetFilePath?: string

  /**
   * most times we don't use aiPresetFileConfig, we parse .gpt.md file
   * and get the real time aiPresetFileConfig and then provide aiPresetFileConfig to LangchainJs
   */
  aiPresetFileConfig?: AiPresetFileConfig
  overrideModelType?: ChatModelType
  overrideModelsConfig?: PartialChatModelTypeMap

  /**
   * models type vendor name map
   */
  modelTypeVendorNameMap?: ModelTypeVendorNameMap

  contextFilePaths?: string[]
  editingFilePath?: string
  rootPath?: string
}

export interface GetModelNamesForChooseReqParams {
  rootPath: string
  modelType: ChatModelType
  modelTypeVendorNameMap?: ModelTypeVendorNameMap
}

export interface GetModelNamesForChooseResData {
  modelNames: string[]
}

export interface GetGptFilesReqParams {
  rootPath: string
}

export interface GetGptFilesResData {
  filesInfo: GptFileInfo[]
  filesInfoTree: GptFileInfoTree
}

export interface GetGptFileInfoReqParams {
  rootPath: string
  filePath: string
}

export interface GetGptFileInfoResData {
  userConfig: UserConfig
  aiPresetFileConfig: AiPresetFileConfig
}

export interface InitGptFilesReqParams {
  rootPath: string
  gptFilesNames: string[]
}

export type InitGptFilesResData = null

export type GetProjectConfigReqParams = null
export interface GetProjectConfigResData {
  gptRunnerVersion: string
  nodeVersion: string
  nodeVersionValidMessage: string
}

export interface GetAppConfigReqParams {
  langId?: LocaleLang
}

export type GetAppConfigResData = CurrentAppConfig

export interface MarkAsVisitedAppConfigReqParams {
  types: MarkedAsVisitedType[]
}

export type MarkAsVisitedAppConfigResData = null

export interface GetUserConfigReqParams {
  rootPath: string
}

export interface GetUserConfigResData {
  userConfig: UserConfig
}

export interface StorageGetItemReqParams {
  storageName: ServerStorageName
  key: string
}

export type ServerStorageValue = Record<string, any> | null | undefined

export interface StorageGetItemResData {
  value: ServerStorageValue
  cacheDir: string
}

export interface StorageSetItemReqParams {
  storageName: ServerStorageName
  key: string
  value?: ServerStorageValue
}

export type StorageSetItemResData = null

export interface StorageRemoveItemReqParams {
  storageName: ServerStorageName
  key: string
}

export type StorageRemoveItemResData = null

export interface StorageClearReqParams {
  storageName: ServerStorageName
}

export type StorageClearResData = null

export interface GetCommonFilesReqParams {
  rootPath: string
  excludeExts?: string[]
}

export interface GetCommonFilesResData {
  filesInfoTree: FileInfoTree
  includeFileExts: string[]
  allFileExts: string[]
}

export interface OpenEditorReqParams {
  rootPath?: string
  path: string
  matchContent?: string
}

export type OpenEditorResData = null

export interface CreateFilePathReqParams {
  fileFullPath: string
  isDir: boolean
}

export type CreateFilePathResData = null

export interface RenameFilePathReqParams {
  oldFileFullPath: string
  newFileFullPath: string
}

export type RenameFilePathResData = null

export interface DeleteFilePathReqParams {
  fileFullPath: string
}

export type DeleteFilePathResData = null

export interface GetFileInfoReqParams {
  fileFullPath: string
}

export interface GetFileInfoResData {
  content: string
  isDir: boolean
}

export interface SaveFileContentReqParams {
  fileFullPath: string
  content: string
}

export type SaveFileContentResData = null
