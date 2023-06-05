import type { FC } from 'react'
import clsx from 'clsx'
import type { SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus, ChatRole } from '@nicepkg/gpt-runner-shared/common'
import { MessageTextView } from '../chat-message-text-view'
import { Icon } from '../icon'
import { useHover } from '../../hooks/use-hover.hook'
import type { MessageCodeBlockProps } from '../chat-message-code-block'
import { MsgAvatarWrapper, MsgContent, MsgContentFooterWrapper, MsgContentWrapper, MsgWrapper } from './chat-message-item.styles'

export interface BuildMessageToolbarState extends SingleChatMessage {
  status: ChatMessageStatus
}
export interface MessageItemProps extends SingleChatMessage, Partial<MessageCodeBlockProps> {
  status: ChatMessageStatus
  showToolbar?: 'always' | 'hover' | 'never'
  buildMessageToolbar?: (state: BuildMessageToolbarState) => React.ReactNode
}

export const MessageItem: FC<MessageItemProps> = (props) => {
  const {
    name,
    text,
    status,
    showToolbar = 'hover',
    buildCodeToolbar,
    buildMessageToolbar,
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
    <MsgWrapper $isMe={name === ChatRole.User}>
      <MsgAvatarWrapper $isMe={name === ChatRole.User}>
        <Icon className={clsx(name === ChatRole.User ? 'codicon-account' : 'codicon-github')} />
      </MsgAvatarWrapper>
      <MsgContentWrapper ref={hoverContentRef} $isMe={name === ChatRole.User}>
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
}
