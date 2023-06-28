import type { CSSProperties, FC } from 'react'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { ChatMessageStatus } from '@nicepkg/gpt-runner-shared/common'
import { useWindowSize } from 'react-use'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { useIsMobile } from '../../hooks/use-is-mobile.hook'
import { FlexRow } from '../../styles/global.styles'
import { useScrollDown } from '../../hooks/use-scroll-down.hook'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'
import { useGlobalStore } from '../../store/zustand/global'
import { getGlobalConfig } from '../../helpers/global-config'
import { ErrorView } from '../../components/error-view'
import { DragResizeView } from '../../components/drag-resize-view'
import { fetchProjectInfo } from '../../networks/config'
import { useConfetti } from '../../hooks/use-confetti.hook'
import { SidebarWrapper, StyledVSCodePanels } from './chat.styles'
import { ChatSidebar } from './components/chat-sidebar'
import { ChatPanel } from './components/chat-panel'
import { FileTree } from './components/file-tree'
import { Settings, SettingsTabId } from './components/settings'
import { InitGptFiles } from './components/init-gpt-files'

enum TabId {
  Presets = 'presets',
  Chat = 'chat',
  Files = 'files',
  Settings = 'settings',
  About = 'about',
}

const Chat: FC = memo(() => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const { activeChatId, sidebarTree, updateActiveChatId, updateSidebarTreeFromRemote } = useGlobalStore()
  const { chatInstance } = useChatInstance({ chatId: activeChatId })
  const [scrollDownRef, scrollDown, getScrollBottom] = useScrollDown()
  const [tabActiveId, setTabActiveId] = useState(TabId.Presets)
  const { runConfettiAnime } = useConfetti()
  const showFileTreeOnRightSide = windowWidth >= 1000
  const { data: fetchProjectInfoRes } = useQuery({
    queryKey: ['fetchProjectInfo'],
    queryFn: () => fetchProjectInfo(),
  })
  const rootPath = getGlobalConfig().rootPath

  // when active chat id change, change tab active id
  useEffect(() => {
    setTabActiveId(activeChatId ? TabId.Chat : TabId.Presets)
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
      <ChatSidebar chatId={activeChatId} rootPath={rootPath}></ChatSidebar>
    </SidebarWrapper>
  }, [activeChatId])

  const renderFileTree = useCallback(() => {
    if (!rootPath)
      return null

    return <SidebarWrapper className='sidebar-wrapper'>
      <FileTree rootPath={rootPath}></FileTree>
    </SidebarWrapper>
  }, [])

  const renderSettings = useCallback((onlyRenderTabId?: SettingsTabId) => {
    if (!rootPath)
      return null

    return <SidebarWrapper className='sidebar-wrapper'>
      <Settings rootPath={rootPath} chatId={activeChatId} onlyRenderTabId={onlyRenderTabId}></Settings>
    </SidebarWrapper>
  }, [activeChatId])

  const renderChatPanel = useCallback(() => {
    return <ChatPanel
      scrollDownRef={scrollDownRef}
      chatId={activeChatId}
      chatTreeView={isMobile ? renderSidebar() : null}
      fileTreeView={!showFileTreeOnRightSide ? renderFileTree() : null}
      settingsView={renderSettings()}
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

      const tabIdViewMap: Record<TabId, { title: string; view: JSX.Element | null }> = {
        [TabId.Presets]: {
          title: t('chat_page.tab_presets'),
          view: renderSidebar(),
        },
        [TabId.Chat]: {
          title: t('chat_page.tab_chat'),
          view: renderChatPanel(),
        },
        [TabId.Files]: {
          title: t('chat_page.tab_files'),
          view: renderFileTree(),
        },
        [TabId.Settings]: {
          title: t('chat_page.tab_settings'),
          view: renderSettings(SettingsTabId.Settings),
        },
        [TabId.About]: {
          title: t('chat_page.tab_about'),
          view: renderSettings(SettingsTabId.About),
        },
      }

      return <StyledVSCodePanels
        activeid={tabActiveId}
        style={viewStyle}
        onChange={(e: any) => {
          const activeId = e.target?.activeid as TabId
          setTabActiveId(activeId)
          activeId === TabId.Chat && scrollDown()
          activeId === TabId.About && runConfettiAnime()
        }}
      >

        {Object.keys(tabIdViewMap).map((tabId) => {
          const { title } = tabIdViewMap[tabId as TabId]
          return <VSCodePanelTab key={tabId} id={tabId as TabId}>{title}</VSCodePanelTab>
        })}

        {Object.keys(tabIdViewMap).map((tabId) => {
          const { view } = tabIdViewMap[tabId as TabId]
          return <VSCodePanelView key={tabId} style={viewStyle} id={tabId as TabId}>
            {view}
          </VSCodePanelView>
        })}
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
})

Chat.displayName = 'Chat'

export default Chat
