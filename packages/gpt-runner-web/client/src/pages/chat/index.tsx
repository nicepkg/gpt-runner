import type { CSSProperties, FC } from 'react'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { ChatMessageStatus } from '@nicepkg/gpt-runner-shared/common'
import { useWindowSize } from 'react-use'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { useIsMobile } from '../../hooks/use-is-mobile.hook'
import { FlexColumn, FlexRow } from '../../styles/global.styles'
import { useScrollDown } from '../../hooks/use-scroll-down.hook'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'
import { useGlobalStore } from '../../store/zustand/global'
import { getGlobalConfig } from '../../helpers/global-config'
import { ErrorView } from '../../components/error-view'
import { DragResizeView } from '../../components/drag-resize-view'
import { fetchProjectInfo } from '../../networks/config'
import { useEmitBind } from '../../hooks/use-emit-bind.hook'
import { useSize } from '../../hooks/use-size.hook'
import { ContentWrapper, StyledVSCodePanels } from './chat.styles'
import { ChatSidebar } from './components/chat-sidebar'
import { ChatPanel } from './components/chat-panel'
import { FileTree } from './components/file-tree'
import { Settings, SettingsTabId } from './components/settings'
import { InitGptFiles } from './components/init-gpt-files'
import { TopToolbar } from './components/top-toolbar'

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
  const [toolbarRef, { height: toolbarHeight }] = useSize<HTMLDivElement>()
  const { activeChatId, sidebarTree, updateActiveChatId, updateSidebarTreeFromRemote } = useGlobalStore()
  const { chatInstance } = useChatInstance({ chatId: activeChatId })
  const [scrollDownRef, scrollDown, getScrollBottom] = useScrollDown()
  const [tabActiveId, setTabActiveId] = useState(TabId.Presets)
  const showFileTreeOnRightSide = windowWidth >= 1000
  const chatPanelHeight = windowHeight - toolbarHeight

  const { data: fetchProjectInfoRes } = useQuery({
    queryKey: ['fetchProjectInfo'],
    queryFn: () => fetchProjectInfo(),
  })
  const rootPath = getGlobalConfig().rootPath

  useEmitBind([rootPath])

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

  const renderSidebar = useCallback((isPopover = false, reverseTreeUi?: boolean) => {
    if (!rootPath)
      return null

    return <ContentWrapper $isPopoverContent={isPopover} >
      <ChatSidebar chatId={activeChatId} rootPath={rootPath} reverseTreeUi={reverseTreeUi}></ChatSidebar>
    </ContentWrapper >
  }, [activeChatId])

  const renderFileTree = useCallback((isPopover = false, reverseTreeUi?: boolean) => {
    if (!rootPath)
      return null

    return <ContentWrapper $isPopoverContent={isPopover}>
      <FileTree rootPath={rootPath} reverseTreeUi={reverseTreeUi}></FileTree>
    </ContentWrapper>
  }, [])

  const renderSettings = useCallback((isPopover = false, onlyRenderTabId?: SettingsTabId) => {
    if (!rootPath)
      return null

    return <ContentWrapper $isPopoverContent={isPopover}>
      <Settings rootPath={rootPath} chatId={activeChatId} onlyRenderTabId={onlyRenderTabId}></Settings>
    </ContentWrapper>
  }, [activeChatId])

  const renderChatPanel = useCallback(() => {
    return <ChatPanel
      rootPath={rootPath}
      scrollDownRef={scrollDownRef}
      chatId={activeChatId}
      chatTreeView={isMobile ? renderSidebar(true, true) : null}
      fileTreeView={!showFileTreeOnRightSide ? renderFileTree(true, true) : null}
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

      const tabIdViewMap: Partial<Record<TabId, { title: React.ReactNode; view: React.ReactNode }>> = {
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

        {Object.keys(tabIdViewMap).map((tabId) => {
          const { title } = tabIdViewMap[tabId as TabId]!
          return <VSCodePanelTab key={tabId} id={tabId as TabId}>{title}</VSCodePanelTab>
        })}

        {Object.keys(tabIdViewMap).map((tabId) => {
          const { view } = tabIdViewMap[tabId as TabId]!
          return <VSCodePanelView key={tabId} style={viewStyle} id={tabId as TabId}>
            {view}
          </VSCodePanelView>
        })}
      </StyledVSCodePanels>
    }

    return <FlexRow style={{ height: '100%', overflow: 'hidden' }}>
      <DragResizeView
        initWidth={300}
        initHeight={chatPanelHeight}
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
          initHeight={chatPanelHeight}
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

    <FlexColumn style={{ width: '100%', height: '100%' }}>
      <TopToolbar
        ref={toolbarRef}
        settingsView={renderSettings(true, SettingsTabId.Settings)}
        configInfoView={renderSettings(true, SettingsTabId.ConfigInfo)}
        aboutView={renderSettings(true, SettingsTabId.About)}
      ></TopToolbar>
      {renderChat()}
    </FlexColumn>
  </>
})

Chat.displayName = 'Chat'

export default Chat
