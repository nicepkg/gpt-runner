import type { BaseLanguageModel } from 'langchain/dist/base_language'
import { ChatModelType } from '@nicepkg/gpt-runner-shared/common'
import { CallbackManager } from 'langchain/callbacks'
import { HuggingFaceInference } from 'langchain/llms/hf'
import type { GetLLMChainParams } from '../type'

export function getHuggingFaceLLM(params: GetLLMChainParams): BaseLanguageModel | null {
  const { model, onTokenStream, onComplete, onError } = params

  if (model.type === ChatModelType.HuggingFace) {
    const { secrets, modelName, temperature, maxTokens, topP, topK, frequencyPenalty } = model

    return new HuggingFaceInference({
      // streaming: true,
      maxRetries: 1,
      apiKey: secrets?.apiKey,
      model: modelName,
      temperature,
      maxTokens,
      topP,
      topK,
      frequencyPenalty,
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
