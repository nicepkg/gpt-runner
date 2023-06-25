import { type FC, memo } from 'react'
import clsx from 'clsx'
import type { SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus, ChatRole } from '@nicepkg/gpt-runner-shared/common'
import type { MessageTextViewProps } from '../chat-message-text-view'
import { MessageTextView } from '../chat-message-text-view'
import { Icon } from '../icon'
import { useHover } from '../../hooks/use-hover.hook'
import { MsgAvatarWrapper, MsgContent, MsgContentFooterWrapper, MsgContentWrapper, MsgWrapper } from './chat-message-item.styles'

export interface BuildMessageToolbarState extends SingleChatMessage {
  status: ChatMessageStatus
}
export interface MessageItemProps extends SingleChatMessage, Partial<MessageTextViewProps> {
  status: ChatMessageStatus
  showToolbar?: 'always' | 'hover' | 'never'
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
    showToolbar = 'hover',
    buildCodeToolbar,
    buildMessageToolbar,
    ...messageTextViewProps
  } = props

  const [hoverContentRef, isContentHover] = useHover()
  const contents = status === ChatMessageStatus.Pending ? `${text}\u{258A}` : text

  const renderContent = ({ showToolbar }: Pick<MessageItemProps, 'showToolbar'>) => {
    return <MsgContent
      $showToolbar={showToolbar}
      $isMe={name === ChatRole.User}>

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
  }

  return (
    <MsgWrapper style={style} $isMe={name === ChatRole.User}>
      <MsgAvatarWrapper $showAvatar={showAvatar} $isMe={name === ChatRole.User}>
        <Icon className={clsx(name === ChatRole.User ? 'codicon-account' : 'codicon-github')} />
      </MsgAvatarWrapper>
      <MsgContentWrapper
        ref={hoverContentRef}
        $isMe={name === ChatRole.User}
        style={{
          maxWidth: showAvatar ? 'calc(100% - 6rem)' : '100%',
        }}
      >
        {
          showToolbar === 'hover'
            ? (
              <>
                {/* use absolute position to render a same content with toolbar
                this is helpful to not change height */}
                {renderContent({
                  showToolbar: 'never',
                })}
                {isContentHover && renderContent({
                  showToolbar: 'hover',
                })}
              </>)
            : renderContent({
              showToolbar,
            })
        }
      </MsgContentWrapper>
    </MsgWrapper>
  )
})

MessageItem.displayName = 'MessageItem'
