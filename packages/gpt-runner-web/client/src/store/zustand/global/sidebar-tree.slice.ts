import type { StateCreator } from 'zustand'
import type { GptChatInfo, GptFileInfoTreeItem, SingleChat } from '@nicepkg/gpt-runner-shared/common'
import { GptFileTreeItemType, travelTree } from '@nicepkg/gpt-runner-shared/common'
import { v4 as uuidv4 } from 'uuid'
import type { GetState } from '../types'
import type { TreeItemBaseState } from '../../../components/tree-item'
import { fetchGptFilesTree } from '../../../networks/gpt-files'
import type { ChatSlice } from './chat.slice'

export type SidebarTreeItem = TreeItemBaseState<GptFileInfoTreeItem>
export type SidebarTree = SidebarTreeItem[]

export interface SidebarTreeSlice {
  sidebarTree: SidebarTree
  gptFileIdChatIdsMap: Record<string, string[]>
  getChatInfo: (chatIdOrChatInstance: string | SingleChat) => GptChatInfo
  chatInfo2SidebarTreeItem: (chatInfo: GptChatInfo) => SidebarTreeItem
  getSidebarTreeItem: (treeItemId: string) => SidebarTreeItem | undefined
  updateSidebarTree: (sidebarTree: SidebarTree) => void
  updateSidebarTreeItem: (
    treeItemId: string,
    treeItem: Partial<SidebarTreeItem> | ((oldTreeItem: SidebarTreeItem) => SidebarTreeItem)
  ) => void
  updateSidebarTreeFromRemote: (rootPath: string) => Promise<void>
  updateChatIdsByGptFileId: (gptFileId: string, buildChatIds: (oldChatIds: string[]) => string[]) => void
  refreshSidebarTree: () => Promise<void>
}

export type SidebarState = GetState<SidebarTreeSlice>

function getInitialState() {
  return {
    sidebarTree: [],
    gptFileIdChatIdsMap: {},
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
      name: chatInstance?.name || 'New Chat',
      singleFileConfig: chatInstance?.singleFileConfig || {},
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

    const fetchGptFilesTreeRes = await fetchGptFilesTree({
      rootPath,
    })

    const filesInfoTree = fetchGptFilesTreeRes.data?.filesInfoTree || []

    const gptFileIds: string[] = []
    const treeItems = travelTree(filesInfoTree, (item) => {
      const result: SidebarTreeItem = {
        id: item.id,
        name: item.name,
        path: item.path,
        isLeaf: false,
        otherInfo: item,
        defaultIsExpanded: item.type === GptFileTreeItemType.Folder,
      }

      gptFileIds.push(item.id)

      if (item.type === GptFileTreeItemType.File) {
        const chatIds = state.gptFileIdChatIdsMap[item.id] || []
        result.children = chatIds.map((chatId) => {
          const chatInfo = state.getChatInfo(chatId)
          chatInfo.parentId = item.id

          return {
            id: chatInfo.id,
            name: chatInfo.name,
            path: chatInfo.path,
            isLeaf: true,
            otherInfo: chatInfo,
          } satisfies SidebarTreeItem
        })
      }

      return result
    }) satisfies SidebarTreeItem[]

    // remove gptFileIds that are not in the tree
    const finalGptFileIdChatIdsMap: Record<string, string[]> = {}

    Object.entries(state.gptFileIdChatIdsMap).forEach(([gptFileId, chatIds]) => {
      if (gptFileIds.includes(gptFileId)) {
        finalGptFileIdChatIdsMap[gptFileId] = chatIds
      }
      else {
        // remove chat instances that are not in the tree
        chatIds.forEach((chatId) => {
          state.removeChatInstance(chatId)
        })
      }
    })

    set({ gptFileIdChatIdsMap: finalGptFileIdChatIdsMap })

    state.updateSidebarTree(treeItems)
  },
  updateChatIdsByGptFileId(gptFileId, buildChatIds) {
    const state = get()
    const { gptFileIdChatIdsMap } = state

    const newChatIds = buildChatIds(gptFileIdChatIdsMap[gptFileId] || [])

    set({
      gptFileIdChatIdsMap: {
        ...gptFileIdChatIdsMap,
        [gptFileId]: newChatIds,
      },
    })
  },
  async refreshSidebarTree() {
    const state = get()
    const { sidebarTree } = state
    const gptFileIds: string[] = []

    const treeItems = travelTree(sidebarTree, (item) => {
      gptFileIds.push(item.id)

      if (item.otherInfo?.type === GptFileTreeItemType.File) {
        const chatIds = state.gptFileIdChatIdsMap[item.id] || []
        item.children = chatIds.map((chatId) => {
          const chatInfo = state.getChatInfo(chatId)
          chatInfo.parentId = item.id

          return {
            id: chatInfo.id,
            name: chatInfo.name,
            path: chatInfo.path,
            isLeaf: true,
            otherInfo: chatInfo,
          } satisfies SidebarTreeItem
        })
      }

      return item
    }) satisfies SidebarTreeItem[]

    // remove gptFileIds that are not in the tree
    const finalGptFileIdChatIdsMap: Record<string, string[]> = {}

    Object.entries(state.gptFileIdChatIdsMap).forEach(([gptFileId, chatIds]) => {
      if (gptFileIds.includes(gptFileId)) {
        finalGptFileIdChatIdsMap[gptFileId] = chatIds
      }
      else {
        // remove chat instances that are not in the tree
        chatIds.forEach((chatId) => {
          state.removeChatInstance(chatId)
        })
      }
    })

    set({ gptFileIdChatIdsMap: finalGptFileIdChatIdsMap })

    state.updateSidebarTree(treeItems)
  },
})
