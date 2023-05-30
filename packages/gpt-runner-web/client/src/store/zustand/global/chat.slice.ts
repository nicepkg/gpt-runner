import type { StateCreator } from 'zustand'
import type { SingleChat } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus, ChatRole } from '@nicepkg/gpt-runner-shared/common'
import type { GetState } from '../types'
import { fetchChatgptStream } from '../../../networks/chatgpt'

export enum GenerateAnswerType {
  Generate = 'generate',
  Regenerate = 'regenerate',
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
  generateChatAnswer: (id: string, type?: GenerateAnswerType) => Promise<void>
  regenerateLastChatAnswer: (id: string) => Promise<void>
  stopGeneratingChatAnswer: (id: string) => void
}

export type ChatState = GetState<ChatSlice>

function getInitialState() {
  return <ChatState>{
    openaiKey: '',
    chatInstances: [],
  }
}

const chatIdAbortCtrlMap = new Map<string, AbortController>()

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

  async generateChatAnswer(id: string, type = GenerateAnswerType.Generate) {
    const state = get()
    const chatInstance = state.getChatInstance(id)
    if (!chatInstance)
      throw new Error(`Chat instance with id ${id} not found`)

    const { inputtingPrompt, systemPrompt, temperature, messages, status } = chatInstance

    if (status === ChatMessageStatus.Pending)
      return

    const isRegenerate = type === GenerateAnswerType.Regenerate
    const nextStatus = ChatMessageStatus.Pending

    const nextMessages = (() => {
      const finalMessages = [...messages]

      if (!isRegenerate) { // we don't need to add user messages if it's regenerate
        finalMessages.push({
          name: ChatRole.User,
          text: inputtingPrompt,
        })
      }

      finalMessages.push({
        name: ChatRole.ASSISTANT,
        text: '',
      })

      return finalMessages
    })()

    const nextInputtingPrompt = (() => {
      if (isRegenerate) // we don't need to change inputtingPrompt if it's regenerate
        return inputtingPrompt

      return ''
    })()

    const sendMessages = (() => {
      const lastMessage = messages[messages.length - 1]

      if (isRegenerate) { // remove last ai message and move user message into sendInputtingPrompt send if it's regenerate
        if (lastMessage.name === ChatRole.User)
          return messages.slice(0, -1)
        else
          return messages
      }

      return messages
    })()

    const sendInputtingPrompt = (() => {
      const lastMessage = messages[messages.length - 1]

      if (isRegenerate) { // move user message into sendInputtingPrompt send if it's regenerate
        if (lastMessage?.name === ChatRole.User)
          return lastMessage?.text || ''
        else
          return ''
      }

      return inputtingPrompt
    })()

    state.updateChatInstance(id, {
      status: nextStatus,
      inputtingPrompt: nextInputtingPrompt,
      messages: nextMessages,
    }, false)

    const abortCtrl = new AbortController()

    chatIdAbortCtrlMap.set(id, abortCtrl)

    await fetchChatgptStream({
      signal: abortCtrl.signal,
      messages: sendMessages,
      prompt: sendInputtingPrompt,
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
  async regenerateLastChatAnswer(id: string) {
    const state = get()
    const chatInstance = state.getChatInstance(id)

    if (!chatInstance)
      return

    state.updateChatInstance(id, {
      messages: chatInstance.messages.slice(0, -1),
    }, false)

    return await state.generateChatAnswer(id, GenerateAnswerType.Regenerate)
  },
  stopGeneratingChatAnswer(id: string) {
    const state = get()
    const abortCtrl = chatIdAbortCtrlMap.get(id)
    if (abortCtrl)
      abortCtrl.abort()

    state.updateChatInstance(id, {
      status: ChatMessageStatus.Success,
    }, false)
  },
})
