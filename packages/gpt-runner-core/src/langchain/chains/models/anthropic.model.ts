import type { BaseLanguageModel } from 'langchain/dist/base_language'
import { ChatModelType, DEFAULT_API_BASE_PATH } from '@nicepkg/gpt-runner-shared/common'
import { ChatAnthropic } from 'langchain/chat_models/anthropic'
import { CallbackManager } from 'langchain/callbacks'
import type { Anthropic } from '@anthropic-ai/sdk'
import type { GetModelParams } from '../type'

interface ChatAnthropicInstance extends Omit<InstanceType<typeof ChatAnthropic>, 'batchClient' | 'streamingClient'> {
  batchClient?: Anthropic
  streamingClient?: Anthropic
}

export function getAnthropicModel(params: GetModelParams): BaseLanguageModel | null {
  const { streaming, model, buildRequestHeaders, onTokenStream, onComplete, onError } = params

  if (model.type === ChatModelType.Anthropic) {
    const { secrets, modelName, temperature, maxTokens, topP, topK } = model

    const chatAnthropic = new ChatAnthropic({
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
    }) as unknown as ChatAnthropicInstance

    // langchain not support custom anthropic api request header
    // so we need to rewrite the create method
    const rewriteClientKey = ['batchClient', 'streamingClient'] as const

    rewriteClientKey.forEach((key) => {
      if (chatAnthropic[key]) {
        const oldCreate = chatAnthropic[key]?.completions.create
        chatAnthropic[key]!.completions.create = async function (this: any, body, options) {
          const finalRequestHeaders = buildRequestHeaders?.(secrets?.basePath || DEFAULT_API_BASE_PATH[ChatModelType.Anthropic], options?.headers as any) || options?.headers

          const finalOptions: typeof options = {
            ...options,
            headers: {
              ...finalRequestHeaders,
            },
          }
          const res = await oldCreate?.apply(this, [body, finalOptions] as any)
          return res
        } as Anthropic['completions']['create']
      }
    })

    return chatAnthropic as unknown as InstanceType<typeof ChatAnthropic>
  }

  return null
}
