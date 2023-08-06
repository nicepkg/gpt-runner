import { type FC, memo } from 'react'
import clsx from 'clsx'
import type { SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus, ChatRole } from '@nicepkg/gpt-runner-shared/common'
import type { MessageTextViewProps } from '../chat-message-text-view'
import { MessageTextView } from '../chat-message-text-view'
import { Icon } from '../icon'
import { MsgAvatarWrapper, MsgContent, MsgContentFooterWrapper, MsgContentWrapper, MsgWrapper } from './chat-message-item.styles'

export interface BuildMessageToolbarState extends SingleChatMessage {
  status: ChatMessageStatus
}
export interface MessageItemProps extends SingleChatMessage, Partial<MessageTextViewProps> {
  status: ChatMessageStatus
  showAvatar?: boolean
  style?: React.CSSProperties
  buildMessageToolbar?: (state: BuildMessageToolbarState) => React.ReactNode
}

export const MessageItem: FC<MessageItemProps> = memo((props) => {
  const {
    name,
    text,
    status,
    style,
    showAvatar = false,
    buildCodeToolbar,
    buildMessageToolbar,
    ...messageTextViewProps
  } = props

  const contents = status === ChatMessageStatus.Pending ? `${text}\u{258A}` : text

  return (
    <MsgWrapper style={style} $isMe={name === ChatRole.User}>
      <MsgAvatarWrapper $showAvatar={showAvatar} $isMe={name === ChatRole.User}>
        <Icon className={clsx(name === ChatRole.User ? 'codicon-account' : 'codicon-github')} />
      </MsgAvatarWrapper>
      <MsgContentWrapper
        $isMe={name === ChatRole.User}
        style={{
          maxWidth: showAvatar ? 'calc(100% - 6rem)' : '100%',
        }}
      >
        <MsgContent $isMe={name === ChatRole.User}>
          <MessageTextView
            contents={contents}
            buildCodeToolbar={buildCodeToolbar}
            {...messageTextViewProps}
          />

          <MsgContentFooterWrapper className='msg-content-footer'>
            {buildMessageToolbar?.({
              name,
              text,
              status,
            })}
          </MsgContentFooterWrapper>
        </MsgContent>
      </MsgContentWrapper>
    </MsgWrapper>
  )
})

MessageItem.displayName = 'MessageItem'
