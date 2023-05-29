import type { SingleChatMessage } from './config'
import type { ChatMessageStatus } from './enum'

export interface SingleChat {
  id: string
  title: string
  inputtingPrompt: string
  systemPrompt: string
  temperature: number
  messages: SingleChatMessage[]
  status: ChatMessageStatus
}
