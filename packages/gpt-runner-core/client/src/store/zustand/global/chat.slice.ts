import type { StateCreator } from 'zustand'

export interface ChatState {
  // 会话列表
  chatInstances: []
}

export interface ChatActions {
}

export type ChatSlice = ChatState & ChatActions

function getInitialState() {
  return <ChatState>{
    chatInstances: [],
  }
}

export const createChatSlice: StateCreator<
  ChatSlice,
  [],
  [],
  ChatSlice
> = set => ({
  ...getInitialState(),
})
