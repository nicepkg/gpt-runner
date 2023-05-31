import type { StateCreator } from 'zustand'
import type { GptFileInfo, SingleChat, SingleFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus, ChatRole, resolveSingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
import { v4 as uuidv4 } from 'uuid'
import type { GetState } from '../types'
import { fetchChatgptStream } from '../../../networks/chatgpt'
import { fetchUserConfig } from '../../../networks/config'
import type { SidebarTreeItem, SidebarTreeSlice } from './sidebar-tree.slice'

export enum GenerateAnswerType {
  Generate = 'generate',
  Regenerate = 'regenerate',
}

export interface ChatSlice {
  activeChatId: string
  userConfig: UserConfig
  chatInstances: SingleChat[]
  updateActiveChatId: (activeChatId: string) => void
  updateUserConfig: (userConfig: Partial<UserConfig>) => void
  updateUserConfigFromRemote: (rootPath: string) => Promise<void>
  resolveSingleFileConfig: (singleFileConfig: SingleFileConfig) => SingleFileConfig
  getChatInstance: (chatId: string) => SingleChat | undefined
  addChatInstance: (gptFileId: string, instance: Omit<SingleChat, 'id'>) => {
    chatSidebarTreeItem: SidebarTreeItem
    chatInstance: SingleChat
  }
  updateChatInstance: {
    (chatId: string, chat: Partial<SingleChat>, replace: false): void
    (chatId: string, chat: SingleChat, replace: true): void
  }
  removeChatInstance: (chatId: string) => void
  generateChatAnswer: (chatId: string, type?: GenerateAnswerType) => Promise<void>
  regenerateLastChatAnswer: (chatId: string) => Promise<void>
  stopGeneratingChatAnswer: (chatId: string) => void
}

export type ChatState = GetState<ChatSlice>

function getInitialState() {
  return {
    activeChatId: '',
    userConfig: {},
    chatInstances: [],
  } satisfies ChatState
}

const chatIdAbortCtrlMap = new Map<string, AbortController>()

export const createChatSlice: StateCreator<
  ChatSlice & SidebarTreeSlice,
  [],
  [],
  ChatSlice
> = (set, get) => ({
  ...getInitialState(),
  updateActiveChatId(activeChatId) {
    set({ activeChatId })
  },
  updateUserConfig(userConfig) {
    set(state => ({
      userConfig: {
        ...state.userConfig,
        ...userConfig,
      },
    }))
  },
  async updateUserConfigFromRemote(rootPath: string) {
    const state = get()
    const res = await fetchUserConfig({
      rootPath,
    })

    state.updateUserConfig(res.data?.userConfig || {})
  },
  resolveSingleFileConfig(singleFileConfig) {
    const state = get()
    const { userConfig } = state
    return resolveSingleFileConfig({
      userConfig,
      singleFileConfig,
    }, false)
  },
  getChatInstance(chatId) {
    return get().chatInstances.find(chatInstance => chatInstance.id === chatId)
  },

  addChatInstance(gptFileId, instance) {
    const state = get()
    const chatId = uuidv4()
    const gptFileIdTreeItem = state.getSidebarTreeItem(gptFileId)
    const mergedSingleFileConfig = {
      ...(gptFileIdTreeItem as GptFileInfo | undefined)?.singleFileConfig || {},
      ...instance.singleFileConfig,
    }

    const finalInstance: SingleChat = {
      ...instance,
      id: chatId,
      singleFileConfig: mergedSingleFileConfig,
    }

    const chatInfo = state.getChatInfo(finalInstance)
    chatInfo.parentId = gptFileId
    const chatSidebarTreeItem = state.chatInfo2SidebarTreeItem(chatInfo)

    state.updateSidebarTreeItem(gptFileId, (oldItem) => {
      if (!oldItem.children)
        oldItem.children = []

      oldItem.children.push(chatSidebarTreeItem)

      return oldItem
    })

    state.updateChatIdsByGptFileId(gptFileId, (oldChatIds) => {
      if (oldChatIds.includes(chatId))
        return oldChatIds

      return [...oldChatIds, chatId]
    })

    set(state => ({
      chatInstances: [...state.chatInstances, finalInstance],
    }))

    return {
      chatSidebarTreeItem,
      chatInstance: state.getChatInstance(chatId)!,
    }
  },

  updateChatInstance(chatId, chat, replace = false) {
    set(state => ({
      chatInstances: state.chatInstances.map((chatInstance) => {
        if (chatInstance.id === chatId)
          return replace ? chat as SingleChat : Object.assign(chatInstance, chat)

        return chatInstance
      }),
    }))
  },

  removeChatInstance(chatId) {
    set(state => ({
      chatInstances: state.chatInstances.filter(chatInstance => chatInstance.id !== chatId),
    }))
  },

  async generateChatAnswer(chatId, type = GenerateAnswerType.Generate) {
    const state = get()
    const chatInstance = state.getChatInstance(chatId)
    if (!chatInstance)
      throw new Error(`Chat instance with id ${chatId} not found`)

    const { inputtingPrompt, systemPrompt, singleFileConfig, messages, status } = chatInstance

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

    const sendSingleFileConfig = state.resolveSingleFileConfig(singleFileConfig)

    state.updateChatInstance(chatId, {
      status: nextStatus,
      inputtingPrompt: nextInputtingPrompt,
      messages: nextMessages,
    }, false)

    const abortCtrl = new AbortController()

    chatIdAbortCtrlMap.set(chatId, abortCtrl)

    await fetchChatgptStream({
      signal: abortCtrl.signal,
      messages: sendMessages,
      prompt: sendInputtingPrompt,
      systemPrompt,
      singleFileConfig: sendSingleFileConfig,
      onError(e) {
        console.error('fetchChatgptStream error:', e)
        state.updateChatInstance(chatId, {
          status: ChatMessageStatus.Error,
        }, false)
        abortCtrl.abort()
      },
      onMessage(event) {
        // const chatInstance = state.getChatInstance(id)!
        const { data } = event
        const res = JSON.parse(data)

        if (res.data === '[DONE]') {
          state.updateChatInstance(chatId, {
            status: ChatMessageStatus.Success,
          }, false)
          abortCtrl.abort()
        }
        else {
          const prePartMessage = chatInstance.messages
          prePartMessage[prePartMessage.length - 1].text += res.data

          state.updateChatInstance(chatId, {
            messages: [...prePartMessage],
          }, false)
        }
      },
    })
  },
  async regenerateLastChatAnswer(chatId) {
    const state = get()
    const chatInstance = state.getChatInstance(chatId)

    if (!chatInstance)
      return

    state.updateChatInstance(chatId, {
      messages: chatInstance.messages.slice(0, -1),
    }, false)

    return await state.generateChatAnswer(chatId, GenerateAnswerType.Regenerate)
  },
  stopGeneratingChatAnswer(chatId) {
    const state = get()
    const abortCtrl = chatIdAbortCtrlMap.get(chatId)
    if (abortCtrl)
      abortCtrl.abort()

    state.updateChatInstance(chatId, {
      status: ChatMessageStatus.Success,
    }, false)
  },
})
