import type { ChatModelType } from '../enum'
import type { BaseModelConfig, BaseSecrets } from './base.config'

export interface OpenaiSecrets extends BaseSecrets {
  /**
     * The API key to use for OpenAI API requests.
     */
  apiKey?: string

  /**
   * OpenAI organization id
   */
  organization?: string

  // /**
  //  * OpenAI username
  //  */
  // username?: string

  // /**
  //  * OpenAI password
  //  */
  // password?: string

  /**
   * OpenAI access token
   */
  accessToken?: string
}

export interface OpenaiModelConfig extends BaseModelConfig {
  /**
   * mode type
   */
  type: ChatModelType.Openai

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
