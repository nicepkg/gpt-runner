import type { SingleChatMessage, SingleFileConfig } from './config'
import type { ChatMessageStatus } from './enum'

export interface SingleChat {
  id: string
  name: string
  inputtingPrompt: string
  systemPrompt: string
  messages: SingleChatMessage[]
  singleFilePath: string
  singleFileConfig: SingleFileConfig
  status: ChatMessageStatus
  createAt: number
}
