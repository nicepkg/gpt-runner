import { ChatOpenAI } from 'langchain/chat_models/openai'
import { CallbackManager } from 'langchain/callbacks'
import { BufferMemory, ChatMessageHistory } from 'langchain/memory'
import type { BaseChatMessage } from 'langchain/schema'
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from 'langchain/schema'
import { ConversationChain } from 'langchain/chains'
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from 'langchain/prompts'

export enum ChatRole {
  User = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

function mapStoredMessagesToChatMessages(
  messages: BaseChatMessage[],
): BaseChatMessage[] {
  return messages.map((message) => {
    switch (message.name) {
      case ChatRole.User:
        return new HumanChatMessage(message.text)
      case ChatRole.ASSISTANT:
        return new AIChatMessage(message.text)
      case ChatRole.SYSTEM:
        return new SystemChatMessage(message.text)
      default:
        throw new Error('Role must be defined for generic messages')
    }
  })
}

export interface ChatgptChainParams {
  messages: BaseChatMessage[]
  systemPrompt?: string
  temperature?: number
  openaiKey: string
  onTokenStream?: (token: string) => void
  onComplete?: () => void
  onError?: (err: any) => void
}

export async function chatgptChain(params: ChatgptChainParams) {
  const {
    messages,
    systemPrompt,
    temperature,
    openaiKey,
    onTokenStream,
    onError,
    onComplete,
  } = params

  const chat = new ChatOpenAI({
    streaming: true,
    maxRetries: 1,
    temperature,
    openAIApiKey: openaiKey,
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
    HumanMessagePromptTemplate.fromTemplate('{input}'),
  ])

  const chain = new ConversationChain({
    memory,
    llm: chat,
    prompt: chatPrompt,
  })

  return chain
}
