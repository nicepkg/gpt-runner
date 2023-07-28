import type { BaseLanguageModel } from 'langchain/dist/base_language'
import { ChatModelType, DEFAULT_API_BASE_PATH, STREAM_DONE_FLAG, tryParseJson, tryStringifyJson } from '@nicepkg/gpt-runner-shared/common'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { CallbackManager } from 'langchain/callbacks'
import type { CreateChatCompletionResponse } from 'openai'
import * as uuid from 'uuid'
import type { GetModelParams } from '../type'

export function getOpenaiModel(params: GetModelParams): BaseLanguageModel | null {
  const { streaming, model, buildRequestHeaders, onTokenStream, onComplete, onError } = params

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

    const finalAxiosRequestHeaders = buildRequestHeaders?.(secrets?.basePath || DEFAULT_API_BASE_PATH[ChatModelType.Openai], axiosBaseOptions.headers) || axiosBaseOptions.headers

    const finalAxiosBaseOptions = {
      ...axiosBaseOptions,
      headers: {
        ...finalAxiosRequestHeaders,
      },
    }

    const chatOpenAI = new ChatOpenAI({
      streaming,
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
        baseOptions: finalAxiosBaseOptions,
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

    const oldCompletionWithRetry = chatOpenAI.completionWithRetry
    chatOpenAI.completionWithRetry = async function (request, options) {
      const finalOptions = {
        ...options,
        /**
         * @params e {
         *    data: '{"choices":[{"index":0,"delta":{"content":"hin"},"finish_reason":null}],"model":"gpt-3.5-turbo-0613"}',
         *    event: '',
         *    id: '',
         *    retry: undefined
         *  }
         */
        onmessage(e: any) {
          if (e.data !== STREAM_DONE_FLAG) {
            /**
             * {
             *   "choices":[{
             *      "index":0,
             *      "delta":{
             *         "content":" unterstüt"
             *      },"finish_reason":null
             *   }],
             *   "model": "gpt-4-32k-0613",
             *   "id": "8069ec8f-c3c5-4fc9-9b3c-12031ece228f",
             *   "created":1690540898482,
             *   "usage": {
             *     "prompt_tokens": 0,
             *     "completion_tokens": 0,
             *     "total_tokens": 0
             *   }
             * }
             */
            const finalEventData = tryParseJson(e?.data) as CreateChatCompletionResponse

            // process e as openai response to fix some issue for third-party api
            if (!finalEventData.id)
              finalEventData.id = uuid.v4()

            if (!finalEventData.created)
              finalEventData.created = Date.now()

            if (!finalEventData.usage) {
              finalEventData.usage = {
                prompt_tokens: 0,
                completion_tokens: 0,
                total_tokens: 0,
              }
            }

            e.data = tryStringifyJson(finalEventData)
          }

          return (options as any)?.onmessage?.(e)
        },
      } as typeof options

      return oldCompletionWithRetry.apply(this, [request, finalOptions])
    }

    return chatOpenAI
  }

  return null
}
