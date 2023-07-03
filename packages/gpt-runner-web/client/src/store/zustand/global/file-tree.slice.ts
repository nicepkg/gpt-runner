import type { StateCreator } from 'zustand'
import { type FileInfoTreeItem, travelTree } from '@nicepkg/gpt-runner-shared/common'
import type { GetState } from '../types'
import type { TreeItemBaseState } from '../../../components/tree-item'
import type { ChatSlice } from './chat.slice'

export type FileInfoSidebarTreeItem = FileInfoTreeItem & {
  checked: boolean
}

export type FileSidebarTreeItem = TreeItemBaseState<FileInfoSidebarTreeItem>

export interface FileTreeSlice {
  expendedFilePaths: string[]
  checkedFilePaths: string[]
  excludeFileExts: string[]
  provideFileInfoToGptMap: {
    allFilePaths: boolean
    checkedFileContents: boolean
    activeIdeFileContents: boolean
    openingIdeFileContents: boolean
    userSelectedText: boolean
  }
  provideFileInfoPromptMap: {
    allFilePathsPrompt: string
  }
  updateExcludeFileExts: (excludeFileExts: string[] | ((oldExcludeFileExts: string[]) => string[])) => void
  updateExpendedFilePaths: (expendedFilePaths: string[] | ((oldExpendedFilePaths: string[]) => string[])) => void
  updateCheckedFilePaths: (checkedFilePaths: string[] | ((oldCheckedFilePaths: string[]) => string[])) => void
  updateProvideFileInfoToGptMap: (provideFileInfoToGptMap: Partial<FileTreeSlice['provideFileInfoToGptMap']>) => void
  updateProvideFileInfoPromptMap: (provideFileInfoPromptMap: Partial<FileTreeSlice['provideFileInfoPromptMap']>) => void
  updateAllFilePathsPrompt: (allFilePathsPromptOrFileTreeItem: string | FileSidebarTreeItem[]) => void
}

export type FileTreeState = GetState<FileTreeSlice>

function getInitialState() {
  return {
    expendedFilePaths: [],
    checkedFilePaths: [],
    excludeFileExts: [],
    provideFileInfoToGptMap: {
      allFilePaths: false,
      checkedFileContents: true,
      activeIdeFileContents: false,
      openingIdeFileContents: true,
      userSelectedText: true,
    },
    provideFileInfoPromptMap: {
      allFilePathsPrompt: '',
    },
  } satisfies FileTreeState
}

export const createFileTreeSlice: StateCreator<
  FileTreeSlice & ChatSlice,
  [],
  [],
  FileTreeSlice
> = (set, get) => ({
  ...getInitialState(),
  updateExcludeFileExts(excludeFileExts) {
    const _excludeFileExts = typeof excludeFileExts === 'function' ? excludeFileExts(get().excludeFileExts) : excludeFileExts

    set({
      excludeFileExts: [...new Set(_excludeFileExts)],
    })
  },
  updateProvideFileInfoToGptMap(provideFileInfoToGptMap) {
    set({
      provideFileInfoToGptMap: {
        ...get().provideFileInfoToGptMap,
        ...provideFileInfoToGptMap,
      },
    })
  },
  updateProvideFileInfoPromptMap(provideFileInfoPromptMap) {
    set({
      provideFileInfoPromptMap: {
        ...get().provideFileInfoPromptMap,
        ...provideFileInfoPromptMap,
      },
    })
  },
  updateAllFilePathsPrompt(promptOrFileTreeItem) {
    const state = get()

    let result = ''

    if (typeof promptOrFileTreeItem === 'string')
      result = promptOrFileTreeItem

    if (Array.isArray(promptOrFileTreeItem)) {
      result += 'Note that these are the paths to the project the user is working on, and each path will be enclosed in single double quotes.'
      travelTree(promptOrFileTreeItem, (treeItem) => {
        if (treeItem.isLeaf && treeItem.otherInfo)
          result += `\n".${treeItem.otherInfo.projectRelativePath}"`
      })
    }

    state.updateProvideFileInfoPromptMap({
      allFilePathsPrompt: result,
    })
  },
  updateExpendedFilePaths(expendedFilePaths) {
    const result = typeof expendedFilePaths === 'function' ? expendedFilePaths(get().expendedFilePaths) : expendedFilePaths
    set({ expendedFilePaths: result })
  },
  updateCheckedFilePaths(checkedFilePaths) {
    const result = typeof checkedFilePaths === 'function' ? checkedFilePaths(get().checkedFilePaths) : checkedFilePaths
    set({ checkedFilePaths: result })
  },
})
