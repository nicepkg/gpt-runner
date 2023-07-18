import type { BaseLanguageModel } from 'langchain/dist/base_language'
import { ChatModelType } from '@nicepkg/gpt-runner-shared/common'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { CallbackManager } from 'langchain/callbacks'
import type { GetLLMChainParams } from '../type'

export function getOpenaiLLM(params: GetLLMChainParams): BaseLanguageModel | null {
  const { model, onTokenStream, onComplete, onError } = params

  if (model.type === ChatModelType.Openai) {
    const { secrets, modelName, temperature, maxTokens, topP, frequencyPenalty, presencePenalty } = model
    const hasAccessToken = secrets?.accessToken
    const axiosBaseOptions: Record<string, any> = {
      headers: {},
    }

    if (hasAccessToken) {
      // if user provided an access token, use it even though api key is also provided
      // see: https://github.com/openai/openai-node/blob/dc821be3018c832650e21285bade265099f99efb/common.ts#L70
      axiosBaseOptions.headers.Authorization = `Bearer ${secrets?.accessToken}`
      secrets.apiKey = 'unknown' // tell langchain don't throw error for missing api key
    }

    return new ChatOpenAI({
      streaming: true,
      maxRetries: 1,
      openAIApiKey: secrets?.apiKey,
      modelName,
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
      configuration: {
        ...secrets,
        baseOptions: axiosBaseOptions,
      },
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
