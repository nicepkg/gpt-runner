import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { ChatMessageStatus } from '@nicepkg/gpt-runner-shared/common'
import { useWindowSize } from 'react-use'
import { useIsMobile } from '../../hooks/use-is-mobile.hook'
import { FlexRow } from '../../styles/global.styles'
import { useScrollDown } from '../../hooks/use-scroll-down.hook'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'
import { useGlobalStore } from '../../store/zustand/global'
import { getGlobalConfig } from '../../helpers/global-config'
import { ErrorView } from '../../components/error-view'
import { DragResizeView } from '../../components/drag-resize-view'
import { SidebarWrapper, StyledVSCodePanels } from './chat.styles'
import { ChatSidebar } from './components/chat-sidebar'
import { ChatPanel } from './components/chat-panel'
import FileTree from './components/file-tree'
import { Settings } from './components/settings'

enum TabId {
  Explore = 'explore',
  Chat = 'chat',
  Settings = 'settings',
}

const Chat: FC = () => {
  const isMobile = useIsMobile()
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const { activeChatId, updateActiveChatId } = useGlobalStore()
  const { chatInstance } = useChatInstance({ chatId: activeChatId })
  const [scrollDownRef, scrollDown, getScrollBottom] = useScrollDown()
  const [tabActiveId, setTabActiveId] = useState(TabId.Explore)
  const showFileTreeOnRightSide = windowWidth >= 1000

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

  const renderFileTree = useCallback(() => {
    if (!getGlobalConfig().rootPath)
      return null

    return <SidebarWrapper className='sidebar-wrapper'>
      <FileTree rootPath={getGlobalConfig().rootPath}></FileTree>
    </SidebarWrapper>
  }, [])

  const renderSettings = useCallback((showSingleFileConfig = false) => {
    if (!getGlobalConfig().rootPath)
      return null

    return <SidebarWrapper className='sidebar-wrapper'>
      <Settings showSingleFileConfig={showSingleFileConfig}></Settings>
    </SidebarWrapper>
  }, [])

  const renderChatPanel = useCallback(() => {
    return <ChatPanel
      scrollDownRef={scrollDownRef}
      chatId={activeChatId}
      chatTreeView={isMobile ? renderSidebar() : null}
      fileTreeView={!showFileTreeOnRightSide ? renderFileTree() : null}
      settingsView={renderSettings(true)}
      onChatIdChange={updateActiveChatId}
    ></ChatPanel>
  }, [
    isMobile,
    showFileTreeOnRightSide,
    activeChatId,
    scrollDownRef,
    renderSidebar,
    renderFileTree,
    updateActiveChatId,
  ])

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
      activeid={tabActiveId}
      style={viewStyle}
      onChange={(e: any) => {
        const activeId = e.target?.activeid as TabId
        setTabActiveId(activeId)
        activeId === TabId.Chat && scrollDown()
      }}
    >
      <VSCodePanelTab id={TabId.Explore}>Explore</VSCodePanelTab>
      <VSCodePanelTab id={TabId.Chat}>Chat</VSCodePanelTab>
      <VSCodePanelTab id={TabId.Settings}>Settings</VSCodePanelTab>
      <VSCodePanelView style={viewStyle} id={TabId.Explore}>
        {renderSidebar()}
      </VSCodePanelView>
      <VSCodePanelView style={viewStyle} id={TabId.Chat}>
        {renderChatPanel()}
      </VSCodePanelView>
      <VSCodePanelView style={viewStyle} id={TabId.Settings}>
        {renderSettings()}
      </VSCodePanelView>
    </StyledVSCodePanels>
  }

  return <FlexRow style={{ height: '100%' }}>
    <DragResizeView
      initWidth={300}
      initHeight={windowHeight}
      dragDirectionConfigs={[
        {
          direction: 'right',
          boundary: [-100, 300],
        },
      ]}>
      {renderSidebar()}
    </DragResizeView>

    {renderChatPanel()}

    {showFileTreeOnRightSide
      ? <DragResizeView
        initWidth={300}
        initHeight={windowHeight}
        dragDirectionConfigs={[
          {
            direction: 'left',
            boundary: [-300, 100],
          },
        ]}>
        {renderFileTree()}
      </DragResizeView>
      : null
    }
  </FlexRow>
}

Chat.displayName = 'Chat'

export default Chat
