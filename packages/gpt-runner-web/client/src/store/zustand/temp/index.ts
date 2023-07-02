import type { StateCreator } from 'zustand'
import type { GetState } from '../types'
import { createStore } from '../utils'
import { FileSidebarTreeItem } from '../global/file-tree.slice'
import { BaseResponse, GetCommonFilesResData, travelTree } from '@nicepkg/gpt-runner-shared/common'
import { useGlobalStore } from '../global'

export interface TempSlice {
  filesTree: FileSidebarTreeItem[]
  fullPathFileMap: Record<string, FileSidebarTreeItem>
  filesRelativePaths: string[]
  updateFilesTree: (filesTree: FileSidebarTreeItem[], updateFullPathFileMap?: boolean) => void
  updateFilesRelativePaths: (filesRelativePaths: string[]) => void
  updateFullPathFileMapFromFileTree: (filesTree: FileSidebarTreeItem[]) => void
  handleFetchCommonFilesTreeResChange: (fetchCommonFilesTreeRes: BaseResponse<GetCommonFilesResData> | undefined) => void
}

export type TempState = GetState<TempSlice>

function getInitialState() {
  return {
    filesTree: [],
    fullPathFileMap: {},
    filesRelativePaths: [],
  } satisfies TempState
}

export const createTempSlice: StateCreator<
  TempSlice,
  [],
  [],
  TempSlice
> = (set, get) => ({
  ...getInitialState(),
  updateFilesTree(filesTree, updateFullPathFileMap = false) {
    const state = get()

    if (updateFullPathFileMap)
      state.updateFullPathFileMapFromFileTree(filesTree)

    set({
      filesTree,
    })
  },
  updateFilesRelativePaths(filesRelativePaths) {
    set({
      filesRelativePaths:  [...new Set(filesRelativePaths)],
     })
  },
  updateFullPathFileMapFromFileTree(filesTree) {
    const result: Record<string, FileSidebarTreeItem> = {}
    travelTree(filesTree, (item) => {
      if (item.otherInfo)
        result[item.otherInfo.fullPath] = item
    })
    set({
      fullPathFileMap: result,
    })
  },
  handleFetchCommonFilesTreeResChange(fetchCommonFilesTreeRes) {
    const filesInfoTree = fetchCommonFilesTreeRes?.data?.filesInfoTree
    const state = get()
    const globalState = useGlobalStore.getState()

    if (globalState.excludeFileExts.length) {
      // update excludeFileExts
      const { includeFileExts = [], allFileExts = [] } = fetchCommonFilesTreeRes?.data || {}
      const excludeFileExts = allFileExts.filter(ext => !includeFileExts.includes(ext))
      globalState.updateExcludeFileExts(excludeFileExts)
    }


    if (!filesInfoTree)
      return

    const filesRelativePaths: string[] = []
    const finalFilesSidebarTree = travelTree(filesInfoTree, (item) => {
      const oldIsExpanded = globalState.expendedFilePaths.includes(item.fullPath)
      const oldIsChecked = globalState.checkedFilePaths.includes(item.fullPath)

      const result: FileSidebarTreeItem = {
        id: item.id,
        name: item.name,
        path: item.fullPath,
        isLeaf: item.isFile,
        otherInfo: {
          ...item,
          checked: oldIsChecked,
        },
        isExpanded: oldIsExpanded,
      }

      item.isFile && filesRelativePaths.push(item.projectRelativePath)

      return result
    })


    state.updateFilesTree(finalFilesSidebarTree, true)
    globalState.updateAllFilePathsPrompt(finalFilesSidebarTree)
    state.updateFilesRelativePaths(filesRelativePaths)
  }
})

export const useTempStore = createStore('TempStore', false)<TempSlice, any>(
  (...args) => ({
    ...createTempSlice(...args),
  })
)
