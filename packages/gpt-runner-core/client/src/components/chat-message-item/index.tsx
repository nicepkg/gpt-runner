import type { FC } from 'react'
import { MessageTextView } from '../chat-message-text-view'
import { IndeterminateProgressBar } from '../indeterminate-progress-bar'

export interface MessageItemProps {
  contents: string
  isReply: boolean
  isFinished: boolean
}

export const MessageItem: FC<MessageItemProps> = (props) => {
  const { contents, isReply, isFinished } = props
  return (
    <div className={`chat-msg ${isReply ? 'reply' : ''}`}>
      <div className="chat-msg-contents">
        <MessageTextView
          contents={
            contents + (isReply && !isFinished ? '\u{258A}' : '')
          }
        />
      </div>
      {isReply && !isFinished ? <IndeterminateProgressBar /> : null}
    </div>
  )
}
