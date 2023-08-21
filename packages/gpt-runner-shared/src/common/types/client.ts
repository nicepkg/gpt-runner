import type { SingleChatMessage } from './config'
import type { ChatMessageStatus } from './enum'

export interface SingleChat {
  id: string
  name: string
  inputtingPrompt: string
  systemPrompt: string
  messages: SingleChatMessage[]
  aiPersonFileSourcePath: string
  status: ChatMessageStatus
  createAt: number
}
