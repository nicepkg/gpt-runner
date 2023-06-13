import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { ChatMessageStatus } from '@nicepkg/gpt-runner-shared/common'
import { useIsMobile } from '../../hooks/use-is-mobile.hook'
import { FlexRow } from '../../styles/global.styles'
import { useScrollDown } from '../../hooks/use-scroll-down.hook'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'
import { useGlobalStore } from '../../store/zustand/global'
import { getGlobalConfig } from '../../helpers/global-config'
import { ErrorView } from '../../components/error-view'
import { ChatPanelWrapper, SidebarWrapper, StyledVSCodePanels } from './chat.styles'
import { ChatSidebar } from './chat-sidebar'
import { ChatPanel } from './chat-panel'

enum TabId {
  Explore = 'explore',
  Chat = 'chat',
}

const Chat: FC = () => {
  const isMobile = useIsMobile()
  const { activeChatId, updateActiveChatId } = useGlobalStore()
  const { chatInstance } = useChatInstance({ chatId: activeChatId })
  const [scrollDownRef, scrollDown, getScrollBottom] = useScrollDown()
  const [tabActiveId, setTabActiveId] = useState(TabId.Explore)

  // when active chat id change, change tab active id
  useEffect(() => {
    setTabActiveId(activeChatId ? TabId.Chat : TabId.Explore)
  }, [activeChatId, isMobile])

  // any status will scroll down
  useEffect(() => {
    scrollDown()
  }, [chatInstance?.status, scrollDownRef.current, scrollDown])

  // if is pending and scroll bottom is less than 40, scroll down
  // when you scroll by yourself, scrollDown will stop auto scrollDown
  const lastMessageTextLength = chatInstance ? chatInstance.messages[chatInstance.messages.length - 1]?.text?.length : 0
  useEffect(() => {
    if ((chatInstance?.status === ChatMessageStatus.Pending) && getScrollBottom() < 40)
      scrollDown()
  }, [chatInstance?.status, lastMessageTextLength, isMobile, scrollDown, getScrollBottom])

  useEffect(() => {
    setTimeout(() => {
      scrollDown()
    }, 0)
  }, [scrollDownRef.current])

  const renderSidebar = useCallback(() => {
    if (!getGlobalConfig().rootPath)
      return null

    return <SidebarWrapper className='sidebar-wrapper'>
      <ChatSidebar rootPath={getGlobalConfig().rootPath}></ChatSidebar>
    </SidebarWrapper>
  }, [])

  const renderChatPanel = useCallback(() => {
    return <ChatPanelWrapper>
      <ChatPanel
        scrollDownRef={scrollDownRef}
        chatId={activeChatId}
        chatTreeView={renderSidebar()}
        onChatIdChange={updateActiveChatId}
      ></ChatPanel>
    </ChatPanelWrapper >
  }, [activeChatId, scrollDownRef, renderSidebar])

  if (!getGlobalConfig().rootPath)
    return <ErrorView text="Please provide the root path!"></ErrorView>

  if (isMobile) {
    const viewStyle: CSSProperties = {
      height: '100%',
      maxHeight: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
    }

    return <StyledVSCodePanels
      // activeid={activeChatId ? TabId.Chat : TabId.Explore}
      activeid={tabActiveId}
      style={viewStyle}
      onChange={(e: any) => {
        const activeId = e.target?.activeid as TabId
        setTabActiveId(activeId)
        scrollDown()
      }}
    >
      <VSCodePanelTab id={TabId.Explore}>Explore</VSCodePanelTab>
      <VSCodePanelTab id={TabId.Chat}>Chat</VSCodePanelTab>
      <VSCodePanelView style={viewStyle} id={TabId.Explore}>
        {renderSidebar()}
      </VSCodePanelView>
      <VSCodePanelView style={viewStyle} id={TabId.Chat}>
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
