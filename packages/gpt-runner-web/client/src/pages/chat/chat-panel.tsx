import type { FC, RefObject } from 'react'
import { useCallback } from 'react'
import { ChatMessageStatus, ChatRole } from '@nicepkg/gpt-runner-shared/common'
import { copy } from '@nicepkg/gpt-runner-shared/browser'
import type { ChatMessagePanelProps } from '../../components/chat-message-panel'
import { ChatMessagePanel } from '../../components/chat-message-panel'
import { ChatMessageInput } from '../../components/chat-message-input'
import { IconButton } from '../../components/icon-button'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'
import type { MessageItemProps } from '../../components/chat-message-item'
import { ErrorView } from '../../components/error-view'

export interface ChatPanelProps {
  scrollDownRef: RefObject<any>
  chatId: string
}

export const ChatPanel: FC<ChatPanelProps> = (props) => {
  const { scrollDownRef, chatId } = props
  const { chatInstance, updateCurrentChatInstance, generateCurrentChatAnswer, regenerateCurrentLastChatAnswer, stopCurrentGeneratingChatAnswer } = useChatInstance({ chatId })
  const status = chatInstance?.status ?? ChatMessageStatus.Success

  const handleCopy = useCallback((value: string) => {
    copy(value)
  }, [])

  const handleEditMessage = useCallback((value: string) => {
    updateCurrentChatInstance({
      inputtingPrompt: value,
    }, false)
  }, [updateCurrentChatInstance])

  const handleClearAll = useCallback(() => {
    updateCurrentChatInstance({
      messages: [],
    }, false)
  }, [updateCurrentChatInstance])

  const handleGenerateAnswer = useCallback(() => {
    generateCurrentChatAnswer()
  }, [generateCurrentChatAnswer])

  const handleStopGenerateAnswer = useCallback(() => {
    stopCurrentGeneratingChatAnswer()
  }, [stopCurrentGeneratingChatAnswer])

  const handleContinueGenerateAnswer = useCallback(() => {
    updateCurrentChatInstance({
      inputtingPrompt: 'Please continue',
    }, false)
    generateCurrentChatAnswer()
  }, [chatInstance, updateCurrentChatInstance, generateCurrentChatAnswer])

  const handleInputChange = useCallback((value: string) => {
    updateCurrentChatInstance({
      inputtingPrompt: value,
    }, false)
  }, [updateCurrentChatInstance])

  const messagePanelProps: ChatMessagePanelProps = {
    messageItems: chatInstance?.messages.map((message, i) => {
      const isLast = i === chatInstance.messages.length - 1
      const isLastTwo = i >= chatInstance.messages.length - 2
      const isAi = message.name === ChatRole.ASSISTANT

      const handleRegenerateMessage = () => {
        if (!isLast)
          return

        if (status === ChatMessageStatus.Pending) {
          // is generating, stop first
          stopCurrentGeneratingChatAnswer()
        }

        regenerateCurrentLastChatAnswer()
      }

      const handleDeleteMessage = () => {
        updateCurrentChatInstance({
          messages: chatInstance.messages.filter((_, index) => index !== i),
        }, false)
      }

      const buildCodeToolbar: MessageItemProps['buildCodeToolbar'] = ({ contents }) => {
        return <>
          <IconButton
            text='Copy'
            iconClassName='codicon-copy'
            onClick={() => handleCopy(contents)}
          >
          </IconButton>

          <IconButton
            text='Insert'
            iconClassName='codicon-insert'
          >
          </IconButton>

          <IconButton
            text='Diff'
            iconClassName='codicon-arrow-swap'
          >
          </IconButton>
        </>
      }

      const buildMessageToolbar: MessageItemProps['buildMessageToolbar'] = ({ text }) => {
        return <>
          <IconButton
            text='Copy'
            iconClassName='codicon-copy'
            onClick={() => handleCopy(text)}
          >
          </IconButton>

          <IconButton
            text='Edit'
            iconClassName='codicon-edit'
            onClick={() => handleEditMessage(text)}
          >
          </IconButton>

          {isAi && isLast && <IconButton
            text={status === ChatMessageStatus.Error ? 'Retry' : 'Regenerate'}
            iconClassName='codicon-sync'
            onClick={handleRegenerateMessage}
          ></IconButton>}

          {status === ChatMessageStatus.Pending && isLast
            ? <IconButton
              text='Stop'
              iconClassName='codicon-chrome-maximize'
              hoverShowText={false}
              onClick={handleStopGenerateAnswer}
            ></IconButton>
            : <IconButton
              text='Delete'
              iconClassName='codicon-trash'
              onClick={handleDeleteMessage}
            >
            </IconButton>}
        </>
      }

      return {
        ...message,
        status: isLast ? status : ChatMessageStatus.Success,
        showToolbar: isLastTwo ? 'always' : 'hover',
        buildCodeToolbar,
        buildMessageToolbar,
      } satisfies MessageItemProps
    }) ?? [],
  }

  const renderInputToolbar = () => {
    return <>
      <IconButton
        text='Pre Chat'
        iconClassName='codicon-chevron-left'></IconButton>

      <IconButton
        text='Next Chat'
        iconClassName='codicon-chevron-right'></IconButton>

      <IconButton
        text='Clear All'
        iconClassName='codicon-trash'
        onClick={handleClearAll}
      ></IconButton>

      <IconButton
        text='New Chat'
        iconClassName='codicon-add'></IconButton>

      {/* right icon */}
      <IconButton
        style={{
          marginLeft: 'auto',
        }}
        disabled={status === ChatMessageStatus.Pending}
        text='Continue'
        iconClassName='codicon-debug-continue-small'
        onClick={handleContinueGenerateAnswer}
      ></IconButton>

      {status === ChatMessageStatus.Pending && <IconButton
        text='Stop'
        iconClassName='codicon-chrome-maximize'
        hoverShowText={false}
        onClick={handleStopGenerateAnswer}
      ></IconButton>}

      {status !== ChatMessageStatus.Pending && <IconButton
        disabled={!chatInstance?.inputtingPrompt}
        text='Send'
        hoverShowText={false}
        iconClassName='codicon-send'
        onClick={handleGenerateAnswer}></IconButton>}
    </>
  }

  if (!chatId)
    return <ErrorView text="Please select a chat or new a chat!"></ErrorView>

  return <>
    <ChatMessagePanel ref={scrollDownRef} {...messagePanelProps}></ChatMessagePanel>
    <ChatMessageInput
      value={chatInstance?.inputtingPrompt || ''}
      onChange={handleInputChange}
      toolbarSlot={renderInputToolbar()}
    ></ChatMessageInput>
  </>
}

ChatPanel.displayName = 'ChatPanel'
