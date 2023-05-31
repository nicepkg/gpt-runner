import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { ChatMessageStatus } from '@nicepkg/gpt-runner-shared/common'
import { useIsMobile } from '../../hooks/use-is-mobile.hook'
import { FlexRow } from '../../styles/global.styles'
import { useScrollDown } from '../../hooks/use-scroll-down.hook'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'
import { useGlobalStore } from '../../store/zustand/global'
import { globalConfig } from '../../helpers/global-config'
import { ErrorView } from '../../components/error-view'
import { ChatPanelWrapper, SidebarWrapper, StyledVSCodePanels } from './chat.styles'
import { ChatSidebar } from './chat-sidebar'
import { ChatPanel } from './chat-panel'

const Chat: FC = () => {
  const isMobile = useIsMobile()
  const { activeChatId } = useGlobalStore()
  const { chatInstance } = useChatInstance({ chatId: activeChatId })
  const [scrollDownRef, scrollDown] = useScrollDown()

  const lastMessageTextLength = chatInstance ? chatInstance.messages[chatInstance.messages.length - 1]?.text?.length : 0
  useEffect(() => {
    if (chatInstance?.status === ChatMessageStatus.Pending)
      scrollDown()
  }, [chatInstance?.status, lastMessageTextLength, isMobile, scrollDown])

  useEffect(() => {
    scrollDown()
  }, [scrollDownRef.current])

  const renderSidebar = useCallback(() => {
    if (!globalConfig.rootPath)
      return null

    return <SidebarWrapper>
      <ChatSidebar rootPath={globalConfig.rootPath}></ChatSidebar>
    </SidebarWrapper>
  }, [])

  const renderChatPanel = useCallback(() => {
    return <ChatPanelWrapper>
      <ChatPanel scrollDownRef={scrollDownRef} chatId={activeChatId}></ChatPanel>
    </ChatPanelWrapper >
  }, [activeChatId, scrollDownRef])

  if (!globalConfig.rootPath)
    return <ErrorView text="Please provide the root path!"></ErrorView>

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
