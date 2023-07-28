import type { ChatModelType } from '../enum'
import type { BaseModelConfig, BaseSecrets } from './base.config'

export interface AnthropicSecrets extends BaseSecrets {
  /**
     * The API key to use for Anthropic API requests.
     */
  apiKey?: string
}

export interface AnthropicModelConfig extends BaseModelConfig {
  /**
   * mode type
   */
  type: ChatModelType.Anthropic

  /**
   * openai secret config
   */
  secrets?: AnthropicSecrets

  /** Amount of randomness injected into the response. Ranges
   * from 0 to 1. Use temp closer to 0 for analytical /
   * multiple choice, and temp closer to 1 for creative
   * and generative tasks.
   */
  temperature?: number

  /**
   * Maximum number of tokens to generate in the completion. -1 returns as many
   * tokens as possible given the prompt and the model's maximum context size.
   */
  maxTokens?: number

  /** Does nucleus sampling, in which we compute the
   * cumulative distribution over all the options for each
   * subsequent token in decreasing probability order and
   * cut it off once it reaches a particular probability
   * specified by top_p. Defaults to -1, which disables it.
   * Note that you should either alter temperature or top_p,
   * but not both.
   */
  topP?: number

  /**
   * Only sample from the top K options for each subsequent
   * token. Used to remove "long tail" low probability
   * responses. Defaults to -1, which disables it.
   */
  topK?: number
}
