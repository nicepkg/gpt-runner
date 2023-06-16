import type { FC, RefObject } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { ChatMessageStatus, ChatRole, ClientEventName } from '@nicepkg/gpt-runner-shared/common'
import { copy } from '@nicepkg/gpt-runner-shared/browser'
import type { ChatMessagePanelProps } from '../../components/chat-message-panel'
import { ChatMessagePanel } from '../../components/chat-message-panel'
import { ChatMessageInput } from '../../components/chat-message-input'
import { IconButton } from '../../components/icon-button'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'
import type { MessageItemProps } from '../../components/chat-message-item'
import { ErrorView } from '../../components/error-view'
import { useGlobalStore } from '../../store/zustand/global'
import type { GptFileTreeItem } from '../../store/zustand/global/sidebar-tree.slice'
import { emitter } from '../../helpers/emitter'
import { getGlobalConfig } from '../../helpers/global-config'
import { PopoverMenu } from '../../components/popover-menu'
import { useKeyboard } from '../../hooks/use-keyboard.hook'
import { DragResizeView } from '../../components/drag-resize-view'
import { useElementSizeRealTime } from '../../hooks/use-element-size-real-time'
import { ChatPanelPopoverTreeWrapper, ChatPanelWrapper } from './chat.styles'

export interface ChatPanelProps {
  scrollDownRef: RefObject<any>
  chatTreeView?: React.ReactNode
  fileTreeView?: React.ReactNode
  chatId: string
  onChatIdChange: (chatId: string) => void
}

export const ChatPanel: FC<ChatPanelProps> = (props) => {
  const { scrollDownRef, chatTreeView, fileTreeView, chatId, onChatIdChange } = props
  const { createChatAndActive, getGptFileTreeItemFromChatId } = useGlobalStore()
  const { chatInstance, updateCurrentChatInstance, generateCurrentChatAnswer, regenerateCurrentLastChatAnswer, stopCurrentGeneratingChatAnswer } = useChatInstance({ chatId })
  const status = chatInstance?.status ?? ChatMessageStatus.Success
  const [gptFileTreeItem, setGptFileTreeItem] = useState<GptFileTreeItem>()
  const [chatPanelRef, { width: chatPanelWidth }] = useElementSizeRealTime<HTMLDivElement>()

  useEffect(() => {
    const gptFileTreeItem = getGptFileTreeItemFromChatId(chatId)
    setGptFileTreeItem(gptFileTreeItem)
  }, [chatId, getGptFileTreeItemFromChatId])

  // copy
  const handleCopy = useCallback((value: string) => {
    copy(value)
  }, [])

  // insert codes
  const handleInsertCodes = useCallback((value: string) => {
    emitter.emit(ClientEventName.InsertCodes, { codes: value })
  }, [])

  // diff codes
  const handleDiffCodes = useCallback((value: string) => {
    emitter.emit(ClientEventName.DiffCodes, { codes: value })
  }, [])

  // edit
  const handleEditMessage = useCallback((value: string) => {
    updateCurrentChatInstance({
      inputtingPrompt: value,
    }, false)
  }, [updateCurrentChatInstance])

  // pre chat
  const handleSwitchPreChat = useCallback(() => {
    const chatIds = gptFileTreeItem?.children?.map(item => item.id) ?? []

    if (chatIds.length === 0)
      return

    const index = chatIds.indexOf(chatId)
    let nextIndex = index + 1

    if (nextIndex >= chatIds.length)
      nextIndex = 0

    const nextChatId = chatIds[nextIndex]
    onChatIdChange(nextChatId)
  }, [gptFileTreeItem, chatId, onChatIdChange])

  // next chat
  const handleSwitchNextChat = useCallback(() => {
    const chatIds = gptFileTreeItem?.children?.map(item => item.id) ?? []

    if (chatIds.length === 0)
      return

    const index = chatIds.indexOf(chatId)
    let nextIndex = index - 1

    if (nextIndex < 0)
      nextIndex = chatIds.length - 1

    const nextChatId = chatIds[nextIndex]
    onChatIdChange(nextChatId)
  }, [gptFileTreeItem, chatId, onChatIdChange])

  // clean
  const handleClearAll = useCallback(() => {
    updateCurrentChatInstance({
      messages: [],
    }, false)
  }, [updateCurrentChatInstance])

  // new chat
  const handleNewChat = useCallback(() => {
    const gptFileId = gptFileTreeItem?.id

    if (!gptFileId)
      return

    createChatAndActive(gptFileId)
  }, [createChatAndActive, gptFileTreeItem])

  // continue
  const handleContinueGenerateAnswer = useCallback(() => {
    updateCurrentChatInstance({
      inputtingPrompt: 'Please continue',
    }, false)
    generateCurrentChatAnswer()
  }, [chatInstance, updateCurrentChatInstance, generateCurrentChatAnswer])

  // stop
  const handleStopGenerateAnswer = useCallback(() => {
    stopCurrentGeneratingChatAnswer()
  }, [stopCurrentGeneratingChatAnswer])

  // send
  const handleGenerateAnswer = useCallback(() => {
    generateCurrentChatAnswer()
  }, [generateCurrentChatAnswer])

  // input change
  const handleInputChange = useCallback((value: string) => {
    updateCurrentChatInstance({
      inputtingPrompt: value,
    }, false)
  }, [updateCurrentChatInstance])

  // keyboard bind ctrl + enter
  useKeyboard('ctrl + enter', handleGenerateAnswer)
  useKeyboard('command + enter', handleGenerateAnswer)

  const buildCodeToolbar: MessageItemProps['buildCodeToolbar'] = ({ contents }) => {
    return <>
      <IconButton
        text='Copy'
        iconClassName='codicon-copy'
        onClick={() => handleCopy(contents)}
      >
      </IconButton>

      {getGlobalConfig().showInsertCodesBtn && <IconButton
        text='Insert'
        iconClassName='codicon-insert'
        onClick={() => handleInsertCodes(contents)}
      >
      </IconButton>}

      {getGlobalConfig().showDiffCodesBtn && <IconButton
        text='Diff'
        iconClassName='codicon-arrow-swap'
        onClick={() => handleDiffCodes(contents)}
      >
      </IconButton>}
    </>
  }

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
        showAvatar: chatPanelWidth > 600,
        buildCodeToolbar: status === ChatMessageStatus.Pending ? undefined : buildCodeToolbar,
        buildMessageToolbar,
      } satisfies MessageItemProps
    }) ?? [],
  }

  const renderInputToolbar = () => {
    return <>
      {/* left icon */}
      {status !== ChatMessageStatus.Pending && <IconButton
        disabled={!chatInstance?.inputtingPrompt}
        text='Send'
        hoverShowText={false}
        iconClassName='codicon-send'
        onClick={handleGenerateAnswer}></IconButton>}

      {status === ChatMessageStatus.Pending && <IconButton
        text='Stop'
        iconClassName='codicon-chrome-maximize'
        hoverShowText={false}
        onClick={handleStopGenerateAnswer}
      ></IconButton>}

      <IconButton
        style={{
          marginRight: 'auto',
        }}
        disabled={status === ChatMessageStatus.Pending}
        text='Continue'
        iconClassName='codicon-debug-continue-small'
        onClick={handleContinueGenerateAnswer}
      ></IconButton>

      {/* right icon */}
      {/* chat tree */}
      {chatTreeView && <PopoverMenu
        childrenInMenuWhenOpen={false}
        menuStyle={{
          marginLeft: '1rem',
          marginRight: '1rem',
        }}
        buildChildrenSlot={({ isHovering }) => {
          return <IconButton
            style={{
              paddingLeft: '0.5rem',
            }}
            text='Chats'
            iconClassName='codicon-list-tree'
            hoverShowText={!isHovering}
          ></IconButton>
        }}
        buildMenuSlot={() => {
          return <ChatPanelPopoverTreeWrapper>
            {chatTreeView}
          </ChatPanelPopoverTreeWrapper>
        }}
      />}

      {/* file tree */}
      {fileTreeView && <PopoverMenu
        childrenInMenuWhenOpen={false}
        menuStyle={{
          marginLeft: '1rem',
          marginRight: '1rem',
        }}
        buildChildrenSlot={({ isHovering }) => {
          return <IconButton
            style={{
              paddingLeft: '0.5rem',
            }}
            text='Files'
            iconClassName='codicon-file'
            hoverShowText={!isHovering}
          ></IconButton>
        }}
        buildMenuSlot={() => {
          return <ChatPanelPopoverTreeWrapper>
            {fileTreeView}
          </ChatPanelPopoverTreeWrapper>
        }}
      />}

      <IconButton
        text='Clean'
        iconClassName='codicon-trash'
        onClick={handleClearAll}
        style={{
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
        }}
      ></IconButton>

      <PopoverMenu
        xPosition='right'
        buildChildrenSlot={({ isHovering, isInMenu }) => {
          return <IconButton
            text='New Chat'
            iconClassName='codicon-add'
            showText={isInMenu}
            hoverShowText={!isHovering}
            onClick={handleNewChat}
          ></IconButton>
        }}
        buildMenuSlot={() => {
          return <>
            <IconButton
              text='Pre Chat'
              iconClassName='codicon-chevron-left'
              hoverShowText={false}
              onClick={handleSwitchPreChat}
            ></IconButton>

            <IconButton
              text='Next Chat'
              iconClassName='codicon-chevron-right'
              hoverShowText={false}
              onClick={handleSwitchNextChat}
            ></IconButton>
          </>
        }}
      />
    </>
  }

  if (!chatId)
    return <ErrorView text="Please select a chat or new a chat!"></ErrorView>

  return <ChatPanelWrapper ref={chatPanelRef}>
    <ChatMessagePanel ref={scrollDownRef} {...messagePanelProps}></ChatMessagePanel>
    <DragResizeView
      initWidth={chatPanelWidth}
      initHeight={250}
      dragDirectionConfigs={[
        {
          direction: 'top',
          boundary: [-200, 50],
        },
      ]}>
      <ChatMessageInput
        value={chatInstance?.inputtingPrompt || ''}
        onChange={handleInputChange}
        toolbarSlot={renderInputToolbar()}
      ></ChatMessageInput>
    </DragResizeView>
  </ChatPanelWrapper>
}

ChatPanel.displayName = 'ChatPanel'
