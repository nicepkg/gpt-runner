import type { StateCreator } from 'zustand'
import type { GptChatInfo, GptFileInfo, GptFileInfoTreeItem, SingleChat } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus, GptFileTreeItemType, travelTree, travelTreeDeepFirst } from '@nicepkg/gpt-runner-shared/common'
import { v4 as uuidv4 } from 'uuid'
import type { GetState } from '../types'
import type { TreeItemBaseState } from '../../../components/tree-item'
import { fetchGptFilesTree } from '../../../networks/gpt-files'
import { DEFAULT_CHAT_NAME } from '../../../helpers/constant'
import type { ChatSlice } from './chat.slice'

export type SidebarTreeItem = TreeItemBaseState<GptFileInfoTreeItem>
export type SidebarTree = SidebarTreeItem[]
export type GptFileTreeItem = TreeItemBaseState<GptFileInfo>

export interface SidebarTreeSlice {
  sidebarTree: SidebarTree
  getChatInfo: (chatIdOrChatInstance: string | SingleChat) => GptChatInfo
  chatInfo2SidebarTreeItem: (chatInfo: GptChatInfo) => SidebarTreeItem
  getSidebarTreeItem: (treeItemId: string) => SidebarTreeItem | undefined
  updateSidebarTree: (sidebarTree: SidebarTree) => void
  updateSidebarTreeItem: (
    treeItemId: string,
    treeItem: Partial<SidebarTreeItem> | ((oldTreeItem: SidebarTreeItem) => SidebarTreeItem)
  ) => void
  updateSidebarTreeFromRemote: (rootPath: string) => Promise<void>
  createChatAndActive: (gptFileId: string) => void
  getGptFileTreeItemFromChatId: (chatId: string) => GptFileTreeItem
  expandChatTreeItem: (chatId: string) => void
}

export type SidebarState = GetState<SidebarTreeSlice>

function getInitialState() {
  return {
    sidebarTree: [],
  } satisfies SidebarState
}

const idTreeItemMap = new Map<string, SidebarTreeItem>()

export const createSidebarTreeSlice: StateCreator<
  SidebarTreeSlice & ChatSlice,
  [],
  [],
  SidebarTreeSlice
> = (set, get) => ({
  ...getInitialState(),
  getChatInfo(chatIdOrChatInstance) {
    const state = get()
    const chatInstance = typeof chatIdOrChatInstance === 'string' ? state.getChatInstance(chatIdOrChatInstance) : chatIdOrChatInstance
    const chatInfo: GptChatInfo = {
      type: GptFileTreeItemType.Chat,
      id: chatInstance?.id || uuidv4(),
      parentId: null,
      path: '',
      name: chatInstance?.name || DEFAULT_CHAT_NAME,
      createAt: chatInstance?.createAt || Date.now(),
    }

    return chatInfo
  },
  chatInfo2SidebarTreeItem(chatInfo) {
    return {
      id: chatInfo.id,
      name: chatInfo.name,
      path: chatInfo.path,
      isLeaf: true,
      otherInfo: chatInfo,
    } satisfies SidebarTreeItem
  },
  getSidebarTreeItem(treeItemId) {
    return idTreeItemMap.get(treeItemId)
  },
  updateSidebarTree(sidebarTree) {
    travelTree(sidebarTree, (treeItem) => {
      idTreeItemMap.set(treeItem.id, treeItem)
    })

    set({ sidebarTree })
  },
  updateSidebarTreeItem(treeItemId, newTreeItem) {
    if (!treeItemId)
      return

    const state = get()
    const { sidebarTree } = state

    const newSidebarTree = travelTree(sidebarTree, (treeItem) => {
      if (treeItem.id === treeItemId) {
        return typeof newTreeItem === 'function'
          ? newTreeItem(treeItem)
          : {
              ...treeItem,
              ...newTreeItem,
            }
      }

      return treeItem
    }) satisfies SidebarTreeItem[]

    state.updateSidebarTree(newSidebarTree)
  },
  async updateSidebarTreeFromRemote(rootPath) {
    if (!rootPath)
      return

    const state = get()

    // refresh map
    state.updateChatInstanceMaps()

    const fetchGptFilesTreeRes = await fetchGptFilesTree({
      rootPath,
    })

    const filesInfoTree = fetchGptFilesTreeRes.data?.filesInfoTree || []
    const gptFilePaths: string[] = []
    const treeItems = travelTree(filesInfoTree, (item) => {
      const oldIsExpanded = idTreeItemMap.get(item.id)?.isExpanded

      const result: SidebarTreeItem = {
        id: item.id,
        name: item.name,
        path: item.path,
        isLeaf: false,
        otherInfo: item,
        isExpanded: oldIsExpanded || item.type === GptFileTreeItemType.Folder,
      }

      if (item.type === GptFileTreeItemType.File) {
        gptFilePaths.push(item.path)

        // const chatIds = currentGptFileIdChatIdsMap.get(item.id) || []
        const chatInstances = state.getChatInstancesByAiPresetFilePath(item.path)

        result.children = chatInstances.map((chatInstance) => {
          const chatInfo = state.getChatInfo(chatInstance)
          chatInfo.parentId = item.id

          return state.chatInfo2SidebarTreeItem(chatInfo)
        })
      }

      return result
    }) satisfies SidebarTreeItem[]

    // remove gptFilePaths that are not in the tree
    const oldGptFilePaths = state.chatInstances.map(chatInstance => chatInstance.aiPresetFilePath)
    oldGptFilePaths.forEach((gptFilePath) => {
      if (!gptFilePaths.includes(gptFilePath)) {
        // remove chat instances that are not in the tree
        const chatInstances = state.getChatInstancesByAiPresetFilePath(gptFilePath)
        chatInstances.forEach((chatInstance) => {
          state.removeChatInstance(chatInstance.id)
        })
      }
    })

    state.updateSidebarTree(treeItems)
  },
  createChatAndActive(gptFileId) {
    const state = get()
    const gptFileTreeItem = state.getSidebarTreeItem(gptFileId) as GptFileTreeItem
    const { chatInstance } = state.addChatInstance(gptFileId, {
      name: DEFAULT_CHAT_NAME,
      inputtingPrompt: gptFileTreeItem?.otherInfo?.aiPresetFileConfig.userPrompt || '',
      systemPrompt: gptFileTreeItem?.otherInfo?.aiPresetFileConfig.systemPrompt || '',
      messages: [],
      aiPresetFilePath: gptFileTreeItem?.path || '',
      status: ChatMessageStatus.Success,
      createAt: Date.now(),
    })

    state.updateActiveChatId(chatInstance.id)
  },
  getGptFileTreeItemFromChatId(chatId) {
    const state = get()
    const { sidebarTree } = state

    let gptFileTreeItem: SidebarTreeItem | undefined

    travelTree(sidebarTree, (treeItem) => {
      if (treeItem.otherInfo?.type === GptFileTreeItemType.File) {
        const childrenContainChatId = treeItem.children?.some(child => child.id === chatId)

        if (childrenContainChatId)
          gptFileTreeItem = treeItem
      }
    })

    return gptFileTreeItem as GptFileTreeItem
  },
  expandChatTreeItem(chatId) {
    const state = get()
    const { sidebarTree } = state

    const gptFileIdMapChildrenHasThisChatId = new Map<string, boolean>()
    const newSidebarTree = travelTreeDeepFirst(sidebarTree, (treeItem) => {
      let childrenContainChatId = false

      // if children contain this chatId, then this treeItem should be expanded
      treeItem.children?.forEach((child) => {
        if (child.id === chatId || gptFileIdMapChildrenHasThisChatId.get(child.id))
          childrenContainChatId = true
      })

      gptFileIdMapChildrenHasThisChatId.set(treeItem.id, childrenContainChatId)
      if (childrenContainChatId)
        return { ...treeItem, isExpanded: childrenContainChatId }
      return { ...treeItem }
    }) satisfies SidebarTreeItem[]

    state.updateSidebarTree(newSidebarTree)
  },
})
