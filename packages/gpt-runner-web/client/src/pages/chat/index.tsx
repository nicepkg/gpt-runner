import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { useIsMobile } from '../../hooks/use-is-mobile.hook'
import type { ChatMessagePanelProps } from '../../components/chat-message-panel'
import { ChatMessagePanel } from '../../components/chat-message-panel'
import { FlexRow } from '../../styles/global.styles'
import { ChatMessageInput } from '../../components/chat-message-input'
import { useGlobalStore } from '../../store/zustand/global'
import type { SingleChat } from '../../store/zustand/global/chat.slice'
import { ChatMessageStatus, ChatRole } from '../../store/zustand/global/chat.slice'
import { useScrollDown } from '../../hooks/use-scroll-down.hook'
import { IconButton } from '../../components/icon-button'
import { ChatPanelWrapper, SidebarWrapper, StyledVSCodePanels } from './chat.styles'
import { ChatSidebar } from './chat-sidebar'

const Chat: FC = () => {
  const isMobile = useIsMobile()
  const chatId = '1'
  const { getChatInstance, addChatInstance, updateChatInstance, generateChatAnswer } = useGlobalStore()
  const [chatInstance, setChatInstance] = useState<SingleChat>()
  const [scrollDownRef, scrollDown] = useScrollDown()

  useEffect(() => {
    scrollDown()
  }, [chatInstance?.messages.length, isMobile])

  useEffect(() => {
    const instance = getChatInstance(chatId)
    if (instance) {
      setChatInstance(instance)
    }
    else {
      setChatInstance(addChatInstance({
        id: chatId,
        title: 'GPT Runner',
        inputtingPrompt: '...',
        systemPrompt: '',
        temperature: 1,
        messages: [],
        status: ChatMessageStatus.Idle,
      }))
    }
  }, [chatId])

  const messagePanelProps: ChatMessagePanelProps = {
    messageItems: chatInstance?.messages.map((message, i) => {
      const isLast = i === chatInstance.messages.length - 1
      const isLastTwo = i >= chatInstance.messages.length - 2
      const isAi = message.name === ChatRole.ASSISTANT

      return {
        ...message,
        status: isLast ? chatInstance.status : ChatMessageStatus.Success,
        showToolbar: isLastTwo ? 'always' : 'hover',
        showRegenerateIcon: isAi && isLast,
      }
    }) ?? [],
  }

  const renderInputToolbar = useCallback(() => {
    return <>
      <IconButton
        text='Pre Chat'
        iconClassName='codicon-chevron-left'></IconButton>

      <IconButton
        text='Next Chat'
        iconClassName='codicon-chevron-right'></IconButton>

      <IconButton
        text='Clean All'
        iconClassName='codicon-trash'></IconButton>

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
      ></IconButton>}

      {chatInstance?.status === ChatMessageStatus.Success && <IconButton
        style={{
          marginLeft: 'auto',
        }}
        disabled={chatInstance?.status !== ChatMessageStatus.Success}
        text='Continue'
        iconClassName='codicon-debug-continue-small'
      ></IconButton>}

      <IconButton
        disabled={!chatInstance?.inputtingPrompt}
        text='Send'
        hoverShowText={false}
        iconClassName='codicon-send'
        onClick={() => {
          generateChatAnswer(chatId)
        }}></IconButton>
    </>
  }, [chatId, chatInstance])

  const renderSidebar = useCallback(() => {
    return <SidebarWrapper>
      <ChatSidebar rootPath='/Users/yangxiaoming/Documents/codes/gpt-runner'></ChatSidebar>
    </SidebarWrapper>
  }, [])

  const renderChatPanel = useCallback(() => {
    return <ChatPanelWrapper>
      <ChatMessagePanel ref={scrollDownRef} {...messagePanelProps}></ChatMessagePanel>
      <ChatMessageInput
        value={chatInstance?.inputtingPrompt || ''}

        onChange={(value) => {
          updateChatInstance(chatId, {
            inputtingPrompt: value,
          }, false)
        }}

        toolbarSlot={renderInputToolbar()}
      ></ChatMessageInput>
    </ChatPanelWrapper >
  }, [chatInstance, chatId, messagePanelProps])

  if (isMobile) {
    const viewStyle: CSSProperties = {
      height: '100%',
      maxHeight: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
    }

    return <StyledVSCodePanels style={viewStyle} >
      <VSCodePanelTab id="explore">Explore</VSCodePanelTab>
      <VSCodePanelTab id="chat">Chat</VSCodePanelTab>
      <VSCodePanelView style={viewStyle} id="explore">
        {renderSidebar()}
      </VSCodePanelView>
      <VSCodePanelView style={viewStyle} id="chat">
        {renderChatPanel()}
      </VSCodePanelView>
    </StyledVSCodePanels>
  }

  return <FlexRow style={{ height: '100%' }}>
    {renderSidebar()}
    {renderChatPanel()}
  </FlexRow>
}

Chat.displayName = 'Chat'

export default Chat
