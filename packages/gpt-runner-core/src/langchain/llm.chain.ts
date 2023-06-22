import './fixes'
import {
  ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate,
} from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { type ChatModel, ChatModelType, type SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import { CallbackManager } from 'langchain/callbacks'
import type { BaseLanguageModel } from 'langchain/dist/base_language'
import { mapStoredMessageToChatTemplateMessages } from './helper'
import type { BaseStreamChainParams } from './types'

export interface LlmChainParams extends BaseStreamChainParams<SingleChatMessage> {
  model: ChatModel
}

export async function llmChain(params: LlmChainParams) {
  const {
    messages,
    systemPrompt,
    onTokenStream,
    onError,
    onComplete,
    model,
  } = params

  let llm: BaseLanguageModel | null = null

  if (model.type === ChatModelType.Openai) {
    const { secrets, modelName, temperature, maxTokens, topP, frequencyPenalty, presencePenalty } = model
    llm = new ChatOpenAI({
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

  if (!llm)
    throw new Error(`No LLM provided, model type ${model.type}`)

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt || 'You are a friendly assistant.'),
    ...mapStoredMessageToChatTemplateMessages(messages),
    HumanMessagePromptTemplate.fromTemplate('{global.input}'),
  ])

  const chain = new LLMChain({
    prompt: chatPrompt,
    llm,
  })

  return chain
}
