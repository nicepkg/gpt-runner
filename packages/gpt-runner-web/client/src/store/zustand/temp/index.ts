import type { StateCreator } from 'zustand'
import type { GetState } from '../types'
import { createStore } from '../utils'

export interface TempSlice {
  filesRelativePaths: string[]
  updateFilesRelativePaths: (filesRelativePaths: string[]) => void
}

export type TempState = GetState<TempSlice>

function getInitialState() {
  return {
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
  updateFilesRelativePaths(filesRelativePaths: string[]) {
    set({
      filesRelativePaths:  [...new Set(filesRelativePaths)],
     })
  }
})

export const useTempStore = createStore('TempStore')<TempSlice, any>(
  (...args) => ({
    ...createTempSlice(...args),
  })
)
