import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from '../utils'
import { globalConfig } from '../../../helpers/global-config'
import type { ChatSlice } from './chat.slice'
import { createChatSlice } from './chat.slice'
import { createSidebarTreeSlice } from './sidebar-tree.slice'
import type { SidebarTreeSlice } from './sidebar-tree.slice'

export type GlobalState = ChatSlice & SidebarTreeSlice

export const useGlobalStore = createStore('GlobalStore')<GlobalState, any>(
  persist(
    (...args) => ({
      ...createChatSlice(...args),
      ...createSidebarTreeSlice(...args),
    }),

    {
      name: 'gpt-runner-global-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      serialize: (store) => {
        const rootPath = globalConfig.rootPath
        const finalStore = {
          ...store,
          state: {
            [rootPath]: store.state,
          },
        }

        return JSON.stringify(finalStore)
      },
      deserialize: (str) => {
        const store = JSON.parse(str)
        const rootPath = globalConfig.rootPath
        const finalStore = {
          ...store,
          state: store.state[rootPath],
        }

        return finalStore
      },
    },
  ),
)
