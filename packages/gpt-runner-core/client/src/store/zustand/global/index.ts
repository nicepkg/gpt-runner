import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from '../utils'
import type { ChatSlice } from './chat.slice'
import { createChatSlice } from './chat.slice'

export type GlobalState = ChatSlice

export const useGlobalStore = createStore('GlobalStore')<GlobalState, any>(
  persist(
    (...args) => ({
      ...createChatSlice(...args),
    }),

    {
      name: 'global-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)
