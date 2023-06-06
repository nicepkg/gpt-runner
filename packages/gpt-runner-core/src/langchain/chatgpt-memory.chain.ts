import './fixes'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { CallbackManager } from 'langchain/callbacks'
import { BufferMemory, ChatMessageHistory } from 'langchain/memory'
import { ConversationChain } from 'langchain/chains'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'
import type { OpenaiBaseConfig, SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import { mapStoredMessagesToChatMessages } from './helper'
import type { BaseStreamChainParams } from './types'

export interface ChatgptMemoryChainParams extends BaseStreamChainParams<SingleChatMessage>, OpenaiBaseConfig {
}

export async function chatgptMemoryChain(params: ChatgptMemoryChainParams) {
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

  const lcChatMessageHistory = new ChatMessageHistory(
    mapStoredMessagesToChatMessages(messages),
  )
  const memory = new BufferMemory({
    chatHistory: lcChatMessageHistory,
    returnMessages: true,
    memoryKey: 'history',
  })

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt || 'You are a friendly assistant.'),
    new MessagesPlaceholder('history'),
    HumanMessagePromptTemplate.fromTemplate('{global.input}'),
  ])

  const chain = new ConversationChain({
    memory,
    llm: chat,
    prompt: chatPrompt,
  })

  return chain
}
