import type { FilterPattern, TreeItem } from './common'
import type { ChatRole, GptFileTreeItemType } from './enum'

export interface BaseModelConfig {
  /**
   * mode type
   */
  type: string

  /**
   * Model name to use
   */
  modelName?: string
}

export interface OpenaiConfig extends BaseModelConfig {
  /**
   * mode type
   */
  type: 'openai'

  /**
   * The API key to use for OpenAI API requests.
   */
  openaiKey: string

  /**
   * Sampling temperature to use
   */
  temperature?: number

  /**
   * Maximum number of tokens to generate in the completion. -1 returns as many
   * tokens as possible given the prompt and the model's maximum context size.
   */
  maxTokens?: number

  /**
   * Total probability mass of tokens to consider at each step
   */
  topP?: number

  /**
   * Penalizes repeated tokens according to frequency
   */
  frequencyPenalty?: number

  /**
   * Penalizes repeated tokens
   */
  presencePenalty?: number
}

export type OpenaiBaseConfig = Omit<OpenaiConfig, 'type'>

export interface UserConfig {
  /**
   * chat model
   */
  model?: OpenaiConfig

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
  parentId: string | null
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

export interface GptChatInfo extends GptPathBaseInfo {
  type: GptFileTreeItemType.Chat
  singleFileConfig: SingleFileConfig
}

export type GptFileInfoTreeItem = TreeItem<GptFolderInfo | GptFileInfo | GptChatInfo>
export type GptFileInfoTree = GptFileInfoTreeItem[]

export interface SingleChatMessage {
  name: ChatRole
  text: string
}

export interface SingleFileConfig {
  model?: UserConfig['model']
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

export interface FormFieldBaseConfig<DefaultValue = string> {
  type: string
  defaultValue?: DefaultValue
  description?: string
}

export interface FormInputConfig extends FormFieldBaseConfig {
  type: 'input'
}

export interface FormTextareaConfig extends FormFieldBaseConfig {
  type: 'textarea'
  row?: number
}

export interface FormSelectConfig extends FormFieldBaseConfig {
  type: 'select'
  options: FormOption[]
}

export interface FormCheckboxGroupConfig extends FormFieldBaseConfig<string[]> {
  type: 'checkbox-group'
  options: FormOption[]
}

export interface FormRadioGroupConfig extends FormFieldBaseConfig {
  type: 'radio-group'
  options: FormOption[]
}

export type FormItemConfig = FormInputConfig | FormTextareaConfig | FormSelectConfig | FormCheckboxGroupConfig | FormRadioGroupConfig
