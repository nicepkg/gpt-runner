import type { StateCreator } from 'zustand'
import type { GetState } from '../types'
import type { ChatSlice } from './chat.slice'

export interface FileTreeSlice {
  expendedFilePaths: string[]
  checkedFilePaths: string[]
  updateExpendedFilePaths: (expendedFilePaths: string[] | ((oldExpendedFilePaths: string[]) => string[])) => void
  updateCheckedFilePaths: (checkedFilePaths: string[] | ((oldCheckedFilePaths: string[]) => string[])) => void
}

export type FileTreeState = GetState<FileTreeSlice>

function getInitialState() {
  return {
    expendedFilePaths: [],
    checkedFilePaths: [],
  } satisfies FileTreeState
}

export const createFileTreeSlice: StateCreator<
  FileTreeSlice & ChatSlice,
  [],
  [],
  FileTreeSlice
> = (set, get) => ({
  ...getInitialState(),
  updateExpendedFilePaths(expendedFilePaths) {
    const result = typeof expendedFilePaths === 'function' ? expendedFilePaths(get().expendedFilePaths) : expendedFilePaths
    set({ expendedFilePaths: result })
  },
  updateCheckedFilePaths(checkedFilePaths) {
    const result = typeof checkedFilePaths === 'function' ? checkedFilePaths(get().checkedFilePaths) : checkedFilePaths
    set({ checkedFilePaths: result })
  },
})
