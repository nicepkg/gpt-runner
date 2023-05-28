import type { BaseChatMessage } from 'langchain/schema'
import type { StateCreator } from 'zustand'
import type { GetState } from '../types'
import { fetchChatgptStream } from '../../../networks/chatgpt'

export enum ChatMessageStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

export enum ChatRole {
  User = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export type SingleChatMessage = Pick<BaseChatMessage, 'name' | 'text'> & {
  name: ChatRole
}

export interface SingleChat {
  id: string
  title: string
  inputtingPrompt: string
  systemPrompt: string
  temperature: number
  messages: SingleChatMessage[]
  status: ChatMessageStatus
}

export interface ChatSlice {
  openaiKey: string
  chatInstances: SingleChat[]
  getChatInstance: (id: string) => SingleChat | undefined
  addChatInstance: (chat: SingleChat) => SingleChat
  updateChatInstance: {
    (id: string, chat: Partial<SingleChat>, replace: false): void
    (id: string, chat: SingleChat, replace: true): void
  }
  removeChatInstance: (id: string) => void
  generateChatAnswer: (id: string) => Promise<void>
}

export type ChatState = GetState<ChatSlice>

function getInitialState() {
  return <ChatState>{
    openaiKey: '',
    chatInstances: [],
  }
}

export const createChatSlice: StateCreator<
  ChatSlice,
  [],
  [],
  ChatSlice
> = (set, get) => ({
  ...getInitialState(),
  getChatInstance(id: string) {
    return get().chatInstances.find(chatInstance => chatInstance.id === id)
  },

  addChatInstance(chat: SingleChat) {
    const state = get()
    set(state => ({
      chatInstances: [...state.chatInstances, { ...chat }],
    }))

    return state.getChatInstance(chat.id)!
  },

  updateChatInstance(id: string, chat: SingleChat | Partial<SingleChat>, replace = false) {
    set(state => ({
      chatInstances: state.chatInstances.map((chatInstance) => {
        if (chatInstance.id === id)
          return replace ? chat as SingleChat : Object.assign(chatInstance, chat)

        return chatInstance
      }),
    }))
  },

  removeChatInstance(id: string) {
    set(state => ({
      chatInstances: state.chatInstances.filter(chatInstance => chatInstance.id !== id),
    }))
  },

  async generateChatAnswer(id: string) {
    const state = get()
    const chatInstance = state.getChatInstance(id)
    if (!chatInstance)
      throw new Error(`Chat instance with id ${id} not found`)

    const { inputtingPrompt, systemPrompt, temperature, messages, status } = chatInstance

    if (status === ChatMessageStatus.Pending)
      return

    state.updateChatInstance(id, {
      status: ChatMessageStatus.Pending,
      inputtingPrompt: '',
      messages: [...messages, {
        name: ChatRole.User,
        text: inputtingPrompt,
      }, {
        name: ChatRole.ASSISTANT,
        text: '',
      }],
    }, false)

    const abortCtrl = new AbortController()
    await fetchChatgptStream({
      signal: abortCtrl.signal,
      messages: messages.slice(0, -1),
      prompt: inputtingPrompt,
      systemPrompt,
      temperature,
      openaiKey: state.openaiKey,
      onError(e) {
        console.error('fetchChatgptStream error:', e)
        state.updateChatInstance(id, {
          status: ChatMessageStatus.Error,
        }, false)
        abortCtrl.abort()
      },
      onMessage(event) {
        // const chatInstance = state.getChatInstance(id)!
        const { data } = event
        const res = JSON.parse(data)

        if (res.data === '[DONE]') {
          state.updateChatInstance(id, {
            status: ChatMessageStatus.Success,
          }, false)
          abortCtrl.abort()
        }
        else {
          const prePartMessage = chatInstance.messages
          prePartMessage[prePartMessage.length - 1].text += res.data

          state.updateChatInstance(id, {
            messages: [...prePartMessage],
          }, false)
        }
      },
    })
  },
})
