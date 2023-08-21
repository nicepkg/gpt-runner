import type { FilterPattern } from '../common'
import type { ChatRole } from '../enum'
import type { ChatModel } from './base.config'

export interface GlobalAiPersonConfig {
  /**
   * chat model
   */
  model?: ChatModel

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
  respectGitIgnore?: boolean

  /**
   * custom http request headers for specific urls
   * @default {}
   *
   * @example
   * {
   *  'https://api.openai.com/*': {
   *     modelNames: [
   *       'gpt-3.5-turbo-16k',
   *       'gpt-4',
   *     ],
   *     httpRequestHeader: {
   *       'host': 'api.openai.com',
   *     }
   *  }
   * }
   */
  urlConfig?: {
    [urlMatch: string]: {
      modelNames?: string[]
      httpRequestHeader?: Record<string, string>
    }
  }
}

export type GlobalAiPersonConfigForUser = Omit<GlobalAiPersonConfig, 'rootPath'>

export interface SingleChatMessage {
  name: ChatRole
  text: string
}

type OmitChatModelTypeSecrets<T> = T extends ChatModel ? Omit<T, 'secrets'> : never

export interface AiPersonConfig {
  model?: OmitChatModelTypeSecrets<ChatModel>
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
