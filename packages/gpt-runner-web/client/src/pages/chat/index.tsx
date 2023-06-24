import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { ChatMessageStatus } from '@nicepkg/gpt-runner-shared/common'
import { useWindowSize } from 'react-use'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../../hooks/use-is-mobile.hook'
import { FlexRow } from '../../styles/global.styles'
import { useScrollDown } from '../../hooks/use-scroll-down.hook'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'
import { useGlobalStore } from '../../store/zustand/global'
import { getGlobalConfig } from '../../helpers/global-config'
import { ErrorView } from '../../components/error-view'
import { DragResizeView } from '../../components/drag-resize-view'
import { fetchProjectInfo } from '../../networks/config'
import { SidebarWrapper, StyledVSCodePanels } from './chat.styles'
import { ChatSidebar } from './components/chat-sidebar'
import { ChatPanel } from './components/chat-panel'
import FileTree from './components/file-tree'
import { Settings } from './components/settings'
import { InitGptFiles } from './components/init-gpt-files'

enum TabId {
  Explore = 'explore',
  Chat = 'chat',
  Settings = 'settings',
}

const Chat: FC = () => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const { activeChatId, sidebarTree, updateActiveChatId, updateSidebarTreeFromRemote } = useGlobalStore()
  const { chatInstance } = useChatInstance({ chatId: activeChatId })
  const [scrollDownRef, scrollDown, getScrollBottom] = useScrollDown()
  const [tabActiveId, setTabActiveId] = useState(TabId.Explore)
  const showFileTreeOnRightSide = windowWidth >= 1000
  const { data: fetchProjectInfoRes } = useQuery({
    queryKey: ['fetchProjectInfo'],
    queryFn: () => fetchProjectInfo(),
  })
  const rootPath = getGlobalConfig().rootPath

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
    if (!rootPath)
      return null

    return <SidebarWrapper className='sidebar-wrapper'>
      <ChatSidebar rootPath={rootPath}></ChatSidebar>
    </SidebarWrapper>
  }, [])

  const renderFileTree = useCallback(() => {
    if (!rootPath)
      return null

    return <SidebarWrapper className='sidebar-wrapper'>
      <FileTree rootPath={rootPath}></FileTree>
    </SidebarWrapper>
  }, [])

  const renderSettings = useCallback((showSingleFileConfig = false) => {
    if (!rootPath)
      return null

    return <SidebarWrapper className='sidebar-wrapper'>
      <Settings chatId={activeChatId} showSingleFileConfig={showSingleFileConfig}></Settings>
    </SidebarWrapper>
  }, [activeChatId])

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

  if (!rootPath)
    return <ErrorView text={t('chat_page.root_path_not_found_tips')}></ErrorView>

  if (fetchProjectInfoRes?.data?.nodeVersionValidMessage)
    return <ErrorView text={fetchProjectInfoRes?.data?.nodeVersionValidMessage}></ErrorView>

  const renderChat = () => {
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
        <VSCodePanelTab id={TabId.Explore}>{t('chat_page.tab_explore')}</VSCodePanelTab>
        <VSCodePanelTab id={TabId.Chat}>{t('chat_page.tab_chat')}</VSCodePanelTab>
        <VSCodePanelTab id={TabId.Settings}>{t('chat_page.tab_settings')}</VSCodePanelTab>
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

  return <>
    {!sidebarTree?.length && <InitGptFiles
      rootPath={rootPath}
      onCreated={() => updateSidebarTreeFromRemote(rootPath)}
    ></InitGptFiles>}

    {renderChat()}
  </>
}

Chat.displayName = 'Chat'

export default Chat
