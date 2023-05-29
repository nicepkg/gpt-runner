import type { FilterPattern, TreeItem } from './common'
import type { ChatRole, GptFileTreeItemType } from './enum'

export interface OpenaiConfig {
  openaiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  topK?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

export interface UserConfig {
  mode?: 'openai'

  openai?: {
    openaiKey: string
    model?: string
    temperature?: number
    maxTokens?: number
    topP?: number
    topK?: number
    frequencyPenalty?: number
    presencePenalty?: number
  }

  /**
   * @default process.cwd()
   */
  rootPath?: string

  /**
   * @default ['.gpt.md']
   */
  exts?: string[]

  /**
   * @default null
   */
  includes?: FilterPattern

  /**
   * @default null
   */
  excludes?: FilterPattern

  /**
     * @default true
     */
  respectGitignore?: boolean
}

export interface GptPathBaseInfo {
  id: string
  path: string
  name: string
  type: GptFileTreeItemType
}

export interface GptFileInfo extends GptPathBaseInfo {
  type: GptFileTreeItemType.File
  content: string
  singleFileConfig: SingleFileConfig
}

export interface GptFolderInfo extends GptPathBaseInfo {
  type: GptFileTreeItemType.Folder
}

export type GptFileInfoTreeItem = TreeItem<GptFolderInfo | GptFileInfo>
export type GptFileInfoTree = GptFileInfoTreeItem[]

export interface SingleChatMessage {
  name: ChatRole
  text: string
}

export interface SingleFileConfig {
  mode?: 'openai'
  openai?: Partial<OpenaiConfig>
  title?: string
  userPrompt?: string
  systemPrompt?: string
  messages?: SingleChatMessage[]
  forms?: Record<string, FormItemConfig & {
    name: string
  }>
}

export interface FormOption {
  label?: string
  value: string
}

export interface FormInputConfig {
  type: 'input'
  defaultValue?: string
}

export interface FormTextareaConfig {
  type: 'textarea'
  defaultValue?: string
  row?: number
}

export interface FormSelectConfig {
  type: 'select'
  defaultValue?: string
  options: FormOption[]
}

export interface FormCheckboxGroupConfig {
  type: 'checkbox-group'
  defaultValue?: string[]
  options: FormOption[]
}

export interface FormRadioGroupConfig {
  type: 'radio-group'
  defaultValue?: string
  options: FormOption[]
}

export type FormItemConfig = FormInputConfig | FormTextareaConfig | FormSelectConfig | FormCheckboxGroupConfig | FormRadioGroupConfig
