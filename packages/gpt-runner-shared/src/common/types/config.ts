import type { FilterPattern, ValueOf } from './common'
import type { ChatModelType, ChatRole } from './enum'

export interface BaseModelConfig {
  /**
   * mode type
   */
  type: ValueOf<ChatModelType>

  /**
   * Model name to use
   */
  modelName?: string

  /**
   * some secrets config, that will not send to client
   */
  secrets?: Record<string, any>
}

export interface OpenaiSecrets {
  /**
     * The API key to use for OpenAI API requests.
     */
  apiKey?: string

  /**
   * OpenAI organization id
   */
  organization?: string

  /**
   * OpenAI username
   */
  username?: string

  /**
   * OpenAI password
   */
  password?: string

  /**
   * OpenAI access token
   */
  accessToken?: string

  /**
   * override Chatgpt base path
   */
  basePath?: string
}

export interface OpenaiModelConfig extends BaseModelConfig {
  /**
   * mode type
   */
  type: 'openai'

  /**
   * openai secret config
   */
  secrets?: OpenaiSecrets

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

export type GetModelBaseConfig<T extends BaseModelConfig> = Omit<T, 'type'>
export type OpenaiBaseConfig = GetModelBaseConfig<OpenaiModelConfig>
export type ChatModel = OpenaiModelConfig

export interface UserConfig {
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
}

export interface SingleChatMessage {
  name: ChatRole
  text: string
}

export interface SingleFileConfig {
  model?: Omit<ChatModel, 'secrets'>
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
