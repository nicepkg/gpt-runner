import type { ChatModelType } from '../enum'
import type { BaseModelConfig } from './base.config'

export interface HuggingFaceSecrets {
  /**
     * The API key to use for Hugging Face API requests.
     */
  apiKey?: string
}

export interface HuggingFaceModelConfig extends BaseModelConfig {
  /**
   * mode type
   */
  type: ChatModelType.HuggingFace

  /**
   * huggingFace secret config
   */
  secrets?: HuggingFaceSecrets

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
   * Integer to define the top tokens considered within the sample operation to create new text.
   */
  topK?: number

  /**
   * Penalizes repeated tokens according to frequency
   */
  frequencyPenalty?: number
}
