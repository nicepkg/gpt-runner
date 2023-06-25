import { forwardRef, memo } from 'react'
import type { MessageItemProps } from '../chat-message-item'
import { MessageItem } from '../chat-message-item'
import { Panel } from './chat-message-panel.styles'

export interface ChatMessagePanelProps {
  messageItems: MessageItemProps[]
}

// Define the ref type for the component
export type ChatMessagePanelRef = HTMLDivElement

// Use ForwardRefRenderFunction to define the component with an explicit ref parameter
export const ChatMessagePanel = memo(forwardRef<ChatMessagePanelRef, ChatMessagePanelProps>((props, ref) => {
  const { messageItems } = props

  return (
    <Panel ref={ref}>
      {messageItems.map((item, index) => {
        return <MessageItem key={index} {...item}></MessageItem>
      })}
    </Panel>
  )
}))

ChatMessagePanel.displayName = 'ChatMessagePanel'
