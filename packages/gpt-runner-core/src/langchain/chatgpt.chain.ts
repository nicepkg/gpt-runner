import './fixes'
import {
  ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate,
} from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import type { OpenaiBaseConfig, SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import { CallbackManager } from 'langchain/callbacks'
import { mapStoredMessageToChatTemplateMessages } from './helper'
import type { BaseStreamChainParams } from './types'

export interface ChatgptChainParams extends BaseStreamChainParams<SingleChatMessage>, OpenaiBaseConfig {
}

export async function chatgptChain(params: ChatgptChainParams) {
  const {
    messages,
    systemPrompt,
    onTokenStream,
    onError,
    onComplete,

    // OpenaiBaseConfig
    openaiKey,
    temperature,
    maxTokens,
    topP,
    frequencyPenalty,
    presencePenalty,
  } = params

  const chat = new ChatOpenAI({
    streaming: true,
    maxRetries: 1,
    openAIApiKey: openaiKey,
    temperature,
    maxTokens,
    topP,
    frequencyPenalty,
    presencePenalty,
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

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt || 'You are a friendly assistant.'),
    ...mapStoredMessageToChatTemplateMessages(messages),
    HumanMessagePromptTemplate.fromTemplate('{global.input}'),
  ])

  const chain = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
  })

  return chain
}
