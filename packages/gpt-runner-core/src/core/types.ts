export type Rule = string | RegExp | ((filePath: string) => boolean)

export enum ChatRole {
  User = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

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

  rootPath?: string
  includes?: Rule[]
  excludes?: Rule[]
  exts?: string[]
  respectGitignore?: boolean
}

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
