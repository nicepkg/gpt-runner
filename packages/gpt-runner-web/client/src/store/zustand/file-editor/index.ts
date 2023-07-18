import type { StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ClientEventName, getErrorMsg } from '@nicepkg/gpt-runner-shared/common'
import { toast } from 'react-hot-toast'
import type { GetState } from '../types'
import { createStore } from '../utils'
import { CustomStorage } from '../storage'
import { emitter } from '../../../helpers/emitter'
import { IS_SAFE } from '../../../helpers/constant'
import { getFileInfo } from '../../../networks/editor'
import type { FileEditorItemOptions } from './file-editor-item'
import { FileEditorItem } from './file-editor-item'

export interface FileEditorSlice {
  activeFileFullPath?: string
  fileEditorItems: FileEditorItem[]
  updateActiveFileFullPath: (fullPath?: string) => void
  updateFileEditorItems: (items: FileEditorItem[]) => void
  addFileEditorItem: (item: FileEditorItem | FileEditorItemOptions) => Promise<void>
  removeFileEditorItem: (fullPath: string) => void
  updateFileEditorItem: (fullPath: string, item: Partial<FileEditorItem>) => void
  getFileEditorItem: (fullPath: string) => FileEditorItem | undefined
}

export type FileEditorState = GetState<FileEditorSlice>

function getInitialState() {
  return {
    activeFileFullPath: '',
    fileEditorItems: [],
  } satisfies FileEditorState
}

export const createFileEditorSlice: StateCreator<
  FileEditorSlice,
  [],
  [],
  FileEditorSlice
> = (set, get) => ({
  ...getInitialState(),
  updateActiveFileFullPath(fullPath) {
    set({
      activeFileFullPath: fullPath,
    })
  },
  updateFileEditorItems(items) {
    set({
      fileEditorItems: items,
    })
  },
  async addFileEditorItem(item) {
    const state = get()
    const existingItem = state.getFileEditorItem(item.fullPath)

    if (!IS_SAFE)
      return

    try {
      if (!existingItem) {
        // remove all (fixed === false) item
        const oldItems = state.fileEditorItems.filter(item => item.fixed)
        const newItem = item instanceof FileEditorItem ? item : new FileEditorItem(item)

        // update sourceContent for new item
        const newItemFileInfoRes = await getFileInfo({
          fileFullPath: item.fullPath,
        })

        newItem.sourceContent = newItemFileInfoRes?.data?.content ?? ''
        newItem.editingContent = newItem.sourceContent

        set({
          fileEditorItems: [...oldItems, newItem],
        })
      }

      emitter.emit(ClientEventName.OpenFileInFileEditor, {
        fileFullPath: item.fullPath,
      })
    }
    catch (err: any) {
      const errMsg = getErrorMsg(err)
      toast.error(errMsg)
    }
  },
  removeFileEditorItem(fullPath) {
    const state = get()
    const finalFileEditorItems = state.fileEditorItems.filter(item => item.fullPath !== fullPath)

    set({
      fileEditorItems: finalFileEditorItems,
    })

    if (!finalFileEditorItems.length)
      emitter.emit(ClientEventName.GoToChatPanel)
  },
  updateFileEditorItem(fullPath, item) {
    const state = get()

    set({
      fileEditorItems: state.fileEditorItems.map((oldItem) => {
        if (oldItem.fullPath === fullPath) {
          return {
            ...oldItem,
            ...item,
          }
        }

        return oldItem
      }),
    })
  },
  getFileEditorItem(fullPath) {
    const state = get()

    return state.fileEditorItems.find(item => item.fullPath === fullPath)
  },
})

export const useFileEditorStore = createStore('FileEditorStore', false)<FileEditorSlice, any>(
  persist(
    (...args) => ({
      ...createFileEditorSlice(...args),
    }),

    {
      name: 'file-editor-slice', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => new CustomStorage({
        storage: localStorage,
        syncToServer: false,
      })),
    },
  ),
)
