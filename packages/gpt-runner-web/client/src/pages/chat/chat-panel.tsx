import type { FC, RefObject } from 'react'
import { useCallback } from 'react'
import { ChatMessageStatus, ChatRole } from '@nicepkg/gpt-runner-shared/common'
import { copy } from '@nicepkg/gpt-runner-shared/browser'
import type { ChatMessagePanelProps } from '../../components/chat-message-panel'
import { ChatMessagePanel } from '../../components/chat-message-panel'
import { ChatMessageInput } from '../../components/chat-message-input'
import { IconButton } from '../../components/icon-button'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'

export interface ChatPanelProps {
  scrollDownRef: RefObject<any>
  chatId: string
}

export const ChatPanel: FC<ChatPanelProps> = (props) => {
  const { scrollDownRef, chatId } = props
  const { chatInstance, updateCurrentChatInstance, generateCurrentChatAnswer, regenerateCurrentLastChatAnswer, stopCurrentGeneratingChatAnswer } = useChatInstance({ chatId })

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
        regenerateCurrentLastChatAnswer()
      }

      const handleDeleteMessage = () => {
        updateCurrentChatInstance({
          messages: chatInstance.messages.filter((_, index) => index !== i),
        }, false)
      }

      return {
        ...message,
        status: isLast ? chatInstance.status : ChatMessageStatus.Success,
        showToolbar: isLastTwo ? 'always' : 'hover',
        showRegenerateIcon: isAi && isLast,
        onCopyCode: handleCopy,
        onDiffCode: undefined,
        onInsertCode: undefined,
        onCopyMessage: handleCopy,
        onEditMessage: handleEditMessage,
        onRegenerateMessage: handleRegenerateMessage,
        onDeleteMessage: handleDeleteMessage,
      }
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
      {chatInstance?.status === ChatMessageStatus.Pending && <IconButton
        style={{
          marginLeft: 'auto',
        }}
        disabled={chatInstance?.status !== ChatMessageStatus.Pending}
        text='Stop'
        iconClassName='codicon-chrome-maximize'
        onClick={handleStopGenerateAnswer}
      ></IconButton>}

      {chatInstance?.status === ChatMessageStatus.Success && <IconButton
        style={{
          marginLeft: 'auto',
        }}
        disabled={chatInstance?.status !== ChatMessageStatus.Success}
        text='Continue'
        iconClassName='codicon-debug-continue-small'
        onClick={handleContinueGenerateAnswer}
      ></IconButton>}

      <IconButton
        disabled={!chatInstance?.inputtingPrompt}
        text='Send'
        hoverShowText={false}
        iconClassName='codicon-send'
        onClick={handleGenerateAnswer}></IconButton>
    </>
  }

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
