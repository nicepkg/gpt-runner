import type { BaseLanguageModel } from 'langchain/dist/base_language'
import { ChatModelType } from '@nicepkg/gpt-runner-shared/common'
import { ChatAnthropic } from 'langchain/chat_models/anthropic'
import { CallbackManager } from 'langchain/callbacks'
import type { GetModelParams } from '../type'

export function getAnthropicModel(params: GetModelParams): BaseLanguageModel | null {
  const { streaming, model, onTokenStream, onComplete, onError } = params

  if (model.type === ChatModelType.Anthropic) {
    const { secrets, modelName, temperature, maxTokens, topP, topK } = model

    return new ChatAnthropic({
      streaming,
      maxRetries: 1,
      anthropicApiKey: secrets?.apiKey,
      anthropicApiUrl: secrets?.basePath,
      modelName,
      temperature,
      maxTokensToSample: maxTokens,
      topP,
      topK,
      callbackManager: CallbackManager.fromHandlers({
        handleLLMNewToken: async (token: string) => {
          onTokenStream?.(token)
        },
        handleLLMEnd: async () => {
          onComplete?.()
        },
        handleLLMError: async (e) => {
          console.log('handleLLMError Error: ', e)
          onError?.(e)
        },
        handleChainError: async (err) => {
          if (err.message.includes('Could not parse LLM output: ')) {
            const output = err.message.split('Could not parse LLM output: ')[1]
            onTokenStream?.(`${output} \n\n`)
          }
          else {
            console.log('Chain Error: ', err)
            onError?.(err)
          }
        },
      }),
    })
  }

  return null
}
