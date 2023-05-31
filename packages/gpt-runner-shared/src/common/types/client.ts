import type { SingleChatMessage, SingleFileConfig } from './config'
import type { ChatMessageStatus } from './enum'

export interface SingleChat {
  id: string
  name: string
  inputtingPrompt: string
  systemPrompt: string
  messages: SingleChatMessage[]
  singleFileConfig: SingleFileConfig
  status: ChatMessageStatus
}
