import type { FC } from 'react'
import { useCallback } from 'react'
import clsx from 'clsx'
import type { SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus, ChatRole } from '@nicepkg/gpt-runner-shared/common'
import { MessageTextView } from '../chat-message-text-view'
import { Icon } from '../icon'
import { IconButton } from '../icon-button'
import { useHover } from '../../hooks/use-hover.hook'
import type { MessageCodeBlockProps } from '../chat-message-code-block'
import { MsgAvatarWrapper, MsgContent, MsgContentFooterWrapper, MsgContentWrapper, MsgWrapper } from './chat-message-item.styles'

export interface MessageItemProps extends SingleChatMessage, Partial<MessageCodeBlockProps> {
  status: ChatMessageStatus
  showToolbar?: 'always' | 'hover' | 'never'
  showRegenerateIcon?: boolean
  onCopyMessage?: (value: string) => void
  onEditMessage?: (value: string) => void
  onRegenerateMessage?: () => void
  onDeleteMessage?: () => void
}

export const MessageItem: FC<MessageItemProps> = (props) => {
  const {
    name,
    text,
    status,
    showToolbar = 'hover',
    showRegenerateIcon = false,
    onCopyMessage,
    onEditMessage,
    onRegenerateMessage,
    onDeleteMessage,
    onCopyCode,
    onDiffCode,
    onInsertCode,
  } = props

  const [hoverContentRef, isContentHover] = useHover()
  const contents = status === ChatMessageStatus.Pending ? `${text}\u{258A}` : text

  const handleCopyMessage = useCallback(() => {
    onCopyMessage?.(text)
  }, [text, onCopyMessage])

  const handleEditMessage = useCallback(() => {
    onEditMessage?.(text)
  }, [text, onEditMessage])

  const handleRegenerateMessage = useCallback(() => {
    onRegenerateMessage?.()
  }, [onRegenerateMessage])

  const handleDeleteMessage = useCallback(() => {
    onDeleteMessage?.()
  }, [onDeleteMessage])

  const renderContent = useCallback(({ showToolbar }: Pick<MessageItemProps, 'showToolbar'>) => {
    return <MsgContent $showToolbar={showToolbar}
      $isMe={name === ChatRole.User}
    >
      <MessageTextView
        contents={contents}
        onCopyCode={onCopyCode}
        onDiffCode={onDiffCode}
        onInsertCode={onInsertCode}
      />

      <MsgContentFooterWrapper className='msg-content-footer'>
        <IconButton
          text='Copy'
          iconClassName='codicon-copy'
          onClick={handleCopyMessage}
        >
        </IconButton>

        <IconButton
          text='Edit'
          iconClassName='codicon-edit'
          onClick={handleEditMessage}
        >
        </IconButton>

        {showRegenerateIcon && <IconButton
          text={status === ChatMessageStatus.Error ? 'Retry' : 'Regenerate'}
          iconClassName='codicon-sync'
          disabled={[ChatMessageStatus.Pending, ChatMessageStatus.Idle].includes(status)}
          onClick={handleRegenerateMessage}
        ></IconButton>}

        <IconButton
          text='Delete'
          iconClassName='codicon-trash'
          onClick={handleDeleteMessage}
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
