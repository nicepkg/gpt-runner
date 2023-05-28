import type { FC } from 'react'
import { useCallback } from 'react'
import clsx from 'clsx'
import { MessageTextView } from '../chat-message-text-view'
import type { SingleChatMessage } from '../../store/zustand/global/chat.slice'
import { ChatMessageStatus, ChatRole } from '../../store/zustand/global/chat.slice'
import { Icon } from '../icon'
import { IconButton } from '../icon-button'
import { useHover } from '../../hooks/use-hover.hook'
import { MsgAvatarWrapper, MsgContent, MsgContentFooterWrapper, MsgContentWrapper, MsgWrapper } from './chat-message-item.styles'

export interface MessageItemProps extends SingleChatMessage {
  status: ChatMessageStatus
  showToolbar?: 'always' | 'hover' | 'never'
  showRegenerateIcon?: boolean
}

export const MessageItem: FC<MessageItemProps> = (props) => {
  const { name, text, status, showToolbar = 'hover', showRegenerateIcon = false } = props
  const [hoverContentRef, isContentHover] = useHover()
  const contents = status === ChatMessageStatus.Pending ? `${text}\u{258A}` : text

  const renderContent = useCallback(({ showToolbar }: Pick<MessageItemProps, 'showToolbar'>) => {
    return <MsgContent $showToolbar={showToolbar}
      $isMe={name === ChatRole.User}
    >
      <MessageTextView
        contents={contents}
      />

      <MsgContentFooterWrapper className='msg-content-footer'>
        <IconButton
          text='Copy'
          iconClassName='codicon-copy'
        >
        </IconButton>

        <IconButton
          text='Edit'
          iconClassName='codicon-edit'
          style={{
            marginLeft: '0.5rem',
          }}
        >
        </IconButton>

        {showRegenerateIcon && <IconButton
          style={{
            marginLeft: '0.5rem',
          }}
          text={status === ChatMessageStatus.Error ? 'Retry' : 'Regenerate'}
          iconClassName='codicon-sync'
          disabled={[ChatMessageStatus.Pending, ChatMessageStatus.Idle].includes(status)}
        ></IconButton>}

        <IconButton
          text='Delete'
          iconClassName='codicon-trash'
          style={{
            marginLeft: '0.5rem',
          }}
        >
        </IconButton>

      </MsgContentFooterWrapper>
    </MsgContent>
  }, [name, contents, showToolbar, showRegenerateIcon, status])

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
