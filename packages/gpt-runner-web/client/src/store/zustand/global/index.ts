import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from '../utils'
import { CustomStorage } from '../storage'
import type { GetState } from '../types'
import type { ChatSlice } from './chat.slice'
import { createChatSlice } from './chat.slice'
import { createSidebarTreeSlice } from './sidebar-tree.slice'
import type { SidebarTreeSlice } from './sidebar-tree.slice'

export type GlobalSlice = ChatSlice & SidebarTreeSlice
export type GlobalState = GetState<GlobalSlice>

export const useGlobalStore = createStore('GlobalStore')<GlobalSlice, any>(
  persist(
    (...args) => ({
      ...createChatSlice(...args),
      ...createSidebarTreeSlice(...args),
    }),

    {
      name: 'global-slice', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => new CustomStorage(localStorage)), // (optional) by default, 'localStorage' is used
      // serialize: (store) => {
      //   const rootPath = globalConfig.rootPath
      //   const finalStore = {
      //     ...store,
      //     state: {
      //       [rootPath]: store.state,
      //     },
      //   }

      //   return JSON.stringify(finalStore)
      // },
      // deserialize: (str) => {
      //   const store = JSON.parse(str)
      //   const rootPath = globalConfig.rootPath
      //   const finalStore = {
      //     ...store,
      //     state: store.state[rootPath],
      //   }

      //   return finalStore
      // },
    },
  ),
)
