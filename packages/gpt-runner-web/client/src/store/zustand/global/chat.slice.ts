import type { StateCreator } from 'zustand'
import type { SingleChat } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus, ChatRole, STREAM_DONE_FLAG, travelTree } from '@nicepkg/gpt-runner-shared/common'
import { v4 as uuidv4 } from 'uuid'
import type { GetState } from '../types'
import { fetchLlmStream } from '../../../networks/llm'
import { getGlobalConfig } from '../../../helpers/global-config'
import type { SidebarTreeItem, SidebarTreeSlice } from './sidebar-tree.slice'
import type { FileTreeSlice } from './file-tree.slice'

export enum GenerateAnswerType {
  Generate = 'generate',
  Regenerate = 'regenerate',
}

export interface ChatSlice {
  activeChatId: string
  chatInstances: SingleChat[]
  updateActiveChatId: (activeChatId: string) => void
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
    chatInstances: [],
  } satisfies ChatState
}

const chatIdAbortCtrlMap = new Map<string, AbortController>()

export const createChatSlice: StateCreator<
  ChatSlice & SidebarTreeSlice & FileTreeSlice,
  [],
  [],
  ChatSlice
> = (set, get) => ({
  ...getInitialState(),
  updateActiveChatId(activeChatId) {
    set({ activeChatId })
  },
  getChatInstance(chatId) {
    return get().chatInstances.find(chatInstance => chatInstance.id === chatId)
  },

  addChatInstance(gptFileId, instance) {
    const state = get()
    const chatId = uuidv4()
    const gptFileIdTreeItem = state.getSidebarTreeItem(gptFileId)

    const finalInstance: SingleChat = {
      ...instance,
      id: chatId,
      singleFilePath: gptFileIdTreeItem?.otherInfo?.path || '',
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
    const state = get()

    set(state => ({
      chatInstances: state.chatInstances.filter(chatInstance => chatInstance.id !== chatId),
    }))

    const nextSidebarTree = travelTree(state.sidebarTree, (item) => {
      if (item.id === chatId)
        return null

      return item
    })

    state.updateSidebarTree(nextSidebarTree)
  },

  async generateChatAnswer(chatId, type = GenerateAnswerType.Generate) {
    const state = get()
    const chatInstance = state.getChatInstance(chatId)
    if (!chatInstance)
      throw new Error(`Chat instance with id ${chatId} not found`)

    const { inputtingPrompt, singleFilePath, messages, status } = chatInstance

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
        if (lastMessage?.name === ChatRole.User)
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

    const appendSystemPrompt = (() => {
      let result = ''
      if (state.provideFilePathsTreePromptToGpt)
        result += `\n${state.filePathsTreePrompt}`

      return result
    })()

    state.updateChatInstance(chatId, {
      status: nextStatus,
      inputtingPrompt: nextInputtingPrompt,
      messages: nextMessages,
    }, false)

    const abortCtrl = new AbortController()

    chatIdAbortCtrlMap.set(chatId, abortCtrl)

    await fetchLlmStream({
      signal: abortCtrl.signal,
      messages: sendMessages,
      prompt: sendInputtingPrompt,
      appendSystemPrompt,
      singleFilePath,
      contextFilePaths: state.checkedFilePaths,
      rootPath: getGlobalConfig().rootPath,
      onError(e) {
        console.error('fetchLlmStream error:', e)
        state.updateChatInstance(chatId, {
          status: ChatMessageStatus.Error,
        }, false)
        abortCtrl.abort()
      },
      onMessage(event) {
        const { data } = event
        const res = JSON.parse(data)

        if (res.data === STREAM_DONE_FLAG) {
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
