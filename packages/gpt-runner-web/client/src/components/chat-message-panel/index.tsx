import type { FC } from 'react'
import type { ChatStreamReqParams } from '../../../../server/src/controllers/chatgpt.controller'
import { FlexColumn } from '../../styles/global.styles'

export interface ChatMessagePanelProps extends ChatStreamReqParams { }
export const ChatMessagePanel: FC<ChatMessagePanelProps> = (props) => {
  const { systemPrompt, messages, prompt, temperature } = props

  return <FlexColumn>

  </FlexColumn>
}
