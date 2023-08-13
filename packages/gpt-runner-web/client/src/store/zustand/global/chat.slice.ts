import type { StateCreator } from 'zustand'
import type { ChatModelType, PartialChatModelTypeMap, SingleChat } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus, ChatRole, STREAM_DONE_FLAG, travelTree } from '@nicepkg/gpt-runner-shared/common'
import { v4 as uuidv4 } from 'uuid'
import type { GetState } from '../types'
import { fetchLlmStream } from '../../../networks/llm'
import { getGlobalConfig } from '../../../helpers/global-config'
import { useTempStore } from '../temp'
import type { SidebarTreeItem, SidebarTreeSlice } from './sidebar-tree.slice'
import type { FileTreeSlice } from './file-tree.slice'
import type { GeneralSlice } from './general.slice'

export enum GenerateAnswerType {
  Generate = 'generate',
  Regenerate = 'regenerate',
}

export type OverrideModelType = ChatModelType | ''

export interface ChatSlice {
  activeChatId: string
  chatInstances: SingleChat[]
  systemPromptAsUserPrompt: boolean
  overrideModelType: OverrideModelType
  overrideModelsConfig: PartialChatModelTypeMap
  updateActiveChatId: (activeChatId: string) => void

  /**
   * Switch to next chat in the same level file of current active chat
   */
  switchToNewActiveChatId: (oldActiveInstance?: SingleChat) => void
  getChatInstance: (chatId: string) => SingleChat | undefined
  getChatInstancesByAiPresetFilePath: (aiPresetFilePath: string) => SingleChat[]
  addChatInstance: (gptFileId: string, instance: Omit<SingleChat, 'id'>) => {
    chatSidebarTreeItem: SidebarTreeItem
    chatInstance: SingleChat
  }
  updateChatInstance: {
    (chatId: string, chat: Partial<SingleChat>, replace: false): void
    (chatId: string, chat: SingleChat, replace: true): void
  }
  updateChatInstances: (chatInstances: SingleChat[] | ((oldChatInstances: SingleChat[]) => SingleChat[])) => void
  updateChatInstanceMaps: (chatInstances?: SingleChat[]) => void
  removeChatInstance: (chatId: string) => void
  generateChatAnswer: (chatId: string, type?: GenerateAnswerType) => Promise<void>
  regenerateLastChatAnswer: (chatId: string) => Promise<void>
  stopGeneratingChatAnswer: (chatId: string) => void
  updateOverrideModelType: (overrideModelType: OverrideModelType) => void
  updateOverrideModelsConfig: (overrideModelsConfig: PartialChatModelTypeMap | ((oldModelOverrideConfig: PartialChatModelTypeMap) => PartialChatModelTypeMap)) => void
  getContextFilePaths: () => string[]
  updateSystemPromptAsUserPrompt: (systemPromptAsUserPrompt: boolean) => void
}

export type ChatState = GetState<ChatSlice>

function getInitialState() {
  return {
    activeChatId: '',
    chatInstances: [],
    systemPromptAsUserPrompt: false,
    overrideModelType: '',
    overrideModelsConfig: {},
  } satisfies ChatState
}

const chatIdAbortCtrlMap = new Map<string, AbortController>()
const chatIdChatInstanceMap = new Map<string, SingleChat>()
const aiPresetFilePathChatInstancesMap = new Map<string, SingleChat[]>()

export const createChatSlice: StateCreator<
  ChatSlice & SidebarTreeSlice & FileTreeSlice & GeneralSlice,
  [],
  [],
  ChatSlice
> = (set, get) => ({
  ...getInitialState(),
  updateActiveChatId(activeChatId) {
    set({ activeChatId })
  },
  switchToNewActiveChatId(_oldActiveInstance) {
    const state = get()
    const oldActiveInstance = _oldActiveInstance || state.getChatInstance(state.activeChatId)
    const sameLevelChatInstances = state.getChatInstancesByAiPresetFilePath(oldActiveInstance?.aiPresetFilePath ?? '')

    if (!oldActiveInstance || !chatIdChatInstanceMap.has(oldActiveInstance.id) && sameLevelChatInstances.length === 0) {
      state.updateActiveChatId('')
      return
    }

    const nextChatInstance = sameLevelChatInstances.sort((a, b) => b.createAt - a.createAt)
      .find(chatInstance => chatInstance.id !== state.activeChatId)

    if (nextChatInstance && nextChatInstance.id !== state.activeChatId)
      state.updateActiveChatId(nextChatInstance.id)
  },

  getChatInstance(chatId) {
    const state = get()

    state.updateChatInstanceMaps()

    return chatIdChatInstanceMap.get(chatId)
  },
  getChatInstancesByAiPresetFilePath(aiPresetFilePath) {
    if (!aiPresetFilePath)
      return []
    return aiPresetFilePathChatInstancesMap.get(aiPresetFilePath) || []
  },
  addChatInstance(gptFileId, instance) {
    const state = get()
    const chatId = uuidv4()
    const gptFileIdTreeItem = state.getSidebarTreeItem(gptFileId)

    const finalInstance: SingleChat = {
      ...instance,
      id: chatId,
      aiPresetFilePath: gptFileIdTreeItem?.path || '',
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

    state.updateChatInstances(preState => [...preState, finalInstance])

    return {
      chatSidebarTreeItem,
      chatInstance: finalInstance,
    }
  },

  updateChatInstance(chatId, chat, replace = false) {
    const state = get()

    set((preState) => {
      const finalInstances = preState.chatInstances.map((chatInstance) => {
        if (chatInstance.id === chatId) {
          const newChatInstance = replace ? chat as SingleChat : Object.assign(chatInstance, chat)
          return newChatInstance
        }
        return chatInstance
      })

      state.updateChatInstanceMaps(finalInstances)

      return {
        chatInstances: finalInstances,
      }
    })
  },
  updateChatInstances(chatInstances) {
    const state = get()
    const finalChatInstances = typeof chatInstances === 'function' ? chatInstances(get().chatInstances) : chatInstances

    state.updateChatInstanceMaps(finalChatInstances)
    set({ chatInstances: finalChatInstances })
  },
  updateChatInstanceMaps(_chatInstances) {
    const state = get()
    const chatInstances = _chatInstances || state.chatInstances || []

    if (chatInstances.length !== chatIdChatInstanceMap.size || chatInstances.length !== aiPresetFilePathChatInstancesMap.size) {
      chatIdChatInstanceMap.clear()
      aiPresetFilePathChatInstancesMap.clear()
      chatInstances.forEach((chatInstance) => {
        chatIdChatInstanceMap.set(chatInstance.id, chatInstance)
        const aiPresetFilePathChatInstances = aiPresetFilePathChatInstancesMap.get(chatInstance.aiPresetFilePath) || []
        aiPresetFilePathChatInstances.push(chatInstance)
        aiPresetFilePathChatInstancesMap.set(chatInstance.aiPresetFilePath, aiPresetFilePathChatInstances)
      })
    }
  },
  removeChatInstance(chatId) {
    const state = get()

    let targetChatInstance: SingleChat | undefined
    state.updateChatInstances((chatInstances) => {
      const finalChatInstances = chatInstances.filter((chatInstance) => {
        const notTargetChatInstance = chatInstance.id !== chatId

        if (!notTargetChatInstance)
          targetChatInstance = chatInstance

        return notTargetChatInstance
      })

      state.updateChatInstanceMaps(finalChatInstances)

      return finalChatInstances
    })

    if (targetChatInstance && targetChatInstance.id === state.activeChatId)
      state.switchToNewActiveChatId(targetChatInstance)

    const nextSidebarTree = travelTree(state.sidebarTree, (item) => {
      if (item.id === chatId)
        return null

      return item
    })

    state.updateSidebarTree(nextSidebarTree)
  },

  async generateChatAnswer(chatId, type = GenerateAnswerType.Generate) {
    const state = get()
    const tempState = useTempStore.getState()
    const chatInstance = state.getChatInstance(chatId)
    if (!chatInstance)
      throw new Error(`Chat instance with id ${chatId} not found`)

    const { inputtingPrompt, aiPresetFilePath, messages, status } = chatInstance

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
        name: ChatRole.Assistant,
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

      if (state.provideFileInfoToGptMap.allFilePaths)
        result += `\n${state.provideFileInfoPromptMap.allFilePathsPrompt}`

      if (state.provideFileInfoToGptMap.userSelectedText)
        result += tempState.getUserSelectTextPrompt()

      return result
    })()

    state.updateChatInstance(chatId, {
      status: nextStatus,
      inputtingPrompt: nextInputtingPrompt,
      messages: nextMessages,
    }, false)

    const abortCtrl = new AbortController()

    chatIdAbortCtrlMap.set(chatId, abortCtrl)

    const contextFilePaths = state.getContextFilePaths()
    const shouldProvideEditingPath = state.provideFileInfoToGptMap.activeIdeFileContents || state.provideFileInfoToGptMap.openingIdeFileContents

    await fetchLlmStream({
      signal: abortCtrl.signal,
      messages: sendMessages,
      prompt: sendInputtingPrompt,
      appendSystemPrompt,
      systemPromptAsUserPrompt: state.systemPromptAsUserPrompt,
      aiPresetFilePath,
      contextFilePaths,
      editingFilePath: shouldProvideEditingPath ? tempState.ideActiveFilePath : undefined,
      overrideModelType: state.overrideModelType || undefined,
      overrideModelsConfig: state.overrideModelsConfig,
      modelTypeVendorNameMap: state.modelTypeVendorNameMap,
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
  updateOverrideModelType(overrideModelType) {
    set({ overrideModelType })
  },
  updateOverrideModelsConfig(overrideModelsConfig) {
    const state = get()
    const finalModelOverrideConfig = typeof overrideModelsConfig === 'function' ? overrideModelsConfig(state.overrideModelsConfig) : overrideModelsConfig

    set({ overrideModelsConfig: finalModelOverrideConfig })
  },
  getContextFilePaths() {
    const state = get()
    const tempState = useTempStore.getState()
    const contextPaths: string[] = []
    const { checkedFileContents, activeIdeFileContents, openingIdeFileContents } = state.provideFileInfoToGptMap

    if (checkedFileContents)
      contextPaths.push(...state.checkedFilePaths)

    if (activeIdeFileContents)
      contextPaths.push(tempState.ideActiveFilePath)

    if (openingIdeFileContents)
      contextPaths.push(...tempState.ideOpeningFilePaths)

    return [...new Set(contextPaths)]
  },
  updateSystemPromptAsUserPrompt(systemPromptAsUserPrompt) {
    set({ systemPromptAsUserPrompt })
  },
})
