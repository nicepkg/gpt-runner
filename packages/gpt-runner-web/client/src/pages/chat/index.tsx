import type { FC } from 'react'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { ChatMessageStatus, ClientEventName } from '@nicepkg/gpt-runner-shared/common'
import { useWindowSize } from 'react-use'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../../hooks/use-is-mobile.hook'
import { FlexColumn, FlexRow } from '../../styles/global.styles'
import { useScrollDown } from '../../hooks/use-scroll-down.hook'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'
import { useGlobalStore } from '../../store/zustand/global'
import { getGlobalConfig } from '../../helpers/global-config'
import { ErrorView } from '../../components/error-view'
import { DragResizeView } from '../../components/drag-resize-view'
import { PanelTab } from '../../components/panel-tab'
import { fetchProjectInfo } from '../../networks/config'
import { useEmitBind } from '../../hooks/use-emit-bind.hook'
import { useSize } from '../../hooks/use-size.hook'
import { useGetCommonFilesTree } from '../../hooks/use-get-common-files-tree.hook'
import type { TabItem } from '../../components/tab'
import { IconButton } from '../../components/icon-button'
import { IS_SAFE } from '../../helpers/constant'
import { useOn } from '../../hooks/use-on.hook'
import { useFileEditorStore } from '../../store/zustand/file-editor'
import { ContentWrapper } from './chat.styles'
import { ChatSidebar } from './components/chat-sidebar'
import { ChatPanel } from './components/chat-panel'
import { FileTree } from './components/file-tree'
import { Settings, SettingsTabId } from './components/settings'
import { InitGptFiles } from './components/init-gpt-files'
import { TopToolbar } from './components/top-toolbar'
import { FileEditor } from './components/file-editor'

enum MobileTabId {
  Presets = 'presets',
  Chat = 'chat',
  Files = 'files',
  FileEditor = 'file-editor',
}

enum PcTabId {
  Chat = 'chat',
  FileEditor = 'file-editor',
}

const Chat: FC = memo(() => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const [toolbarRef, { height: toolbarHeight }] = useSize<HTMLDivElement>()
  const { activeChatId, sidebarTree, updateActiveChatId, updateSidebarTreeFromRemote } = useGlobalStore()
  const { chatInstance } = useChatInstance({ chatId: activeChatId })
  const [scrollDownRef, scrollDown, getScrollBottom] = useScrollDown()
  const [mobileTabActiveId, setMobileTabActiveId] = useState<MobileTabId>(MobileTabId.Presets)
  const [pcTabActiveId, setPcTabActiveId] = useState<PcTabId>(PcTabId.Chat)
  const showFileTreeOnRightSide = windowWidth >= 1000
  const chatPanelHeight = windowHeight - toolbarHeight
  const [isOpenTreeDrawer, setIsOpenTreeDrawer] = useState(true)
  const { activeFileFullPath, updateActiveFileFullPath } = useFileEditorStore()

  const { data: fetchProjectInfoRes } = useQuery({
    queryKey: ['fetchProjectInfo'],
    queryFn: () => fetchProjectInfo(),
  })

  const rootPath = getGlobalConfig().rootPath

  // sometime file tree popover menu is hidden at mount
  // and the store is not updated, so we need to update it
  useGetCommonFilesTree({
    rootPath,
  })

  useEmitBind([rootPath])

  // when active chat id change, change tab active id
  useEffect(() => {
    setMobileTabActiveId(activeChatId ? MobileTabId.Chat : MobileTabId.Presets)
    if (activeChatId)
      setPcTabActiveId(PcTabId.Chat)
  }, [activeChatId, isMobile])

  useOn({
    eventName: ClientEventName.GoToChatPanel,
    listener: () => {
      setMobileTabActiveId(MobileTabId.Chat)
      setPcTabActiveId(PcTabId.Chat)
    },
  })

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

  useOn({
    eventName: ClientEventName.OpenFileInFileEditor,
    listener: ({ fileFullPath }) => {
      setPcTabActiveId(PcTabId.FileEditor)
      setMobileTabActiveId(MobileTabId.FileEditor)
      updateActiveFileFullPath(fileFullPath)
    },
  })

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

    return <ContentWrapper $isTopToolbarPopover $isPopoverContent={isPopover}>
      <Settings rootPath={rootPath} chatId={activeChatId} onlyRenderTabId={onlyRenderTabId}></Settings>
    </ContentWrapper>
  }, [activeChatId])

  const renderFileEditor = useCallback(() => {
    if (!rootPath)
      return null

    return <ContentWrapper>
      <FileEditor
        rootPath={rootPath}
        activeFileFullPath={activeFileFullPath || ''}
        onActiveFileChange={(item) => {
          updateActiveFileFullPath(item.fullPath)
        }}
      ></FileEditor>
    </ContentWrapper>
  }, [activeFileFullPath, rootPath])

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
    // mobile
    if (isMobile) {
      const mobileTabItems: TabItem<MobileTabId>[] = [
        {
          id: MobileTabId.Presets,
          label: t('chat_page.tab_presets'),
          children: renderSidebar(),
        },
        {
          id: MobileTabId.Chat,
          label: t('chat_page.tab_chat'),
          children: renderChatPanel(),
        },
        {
          id: MobileTabId.Files,
          label: t('chat_page.tab_files'),
          children: renderFileTree(),
        },
      ]

      if (IS_SAFE && !getGlobalConfig().editFileInIde) {
        mobileTabItems.push(
          {
            id: MobileTabId.FileEditor,
            label: t('chat_page.tab_file_editor'),
            children: renderFileEditor(),
          })
      }

      return <PanelTab items={mobileTabItems} activeId={mobileTabActiveId} onChange={setMobileTabActiveId} />
    }

    // pc
    const pcTabItems: TabItem<PcTabId>[] = [
      {
        id: PcTabId.Chat,
        label: t('chat_page.tab_chat'),
        children: renderChatPanel(),
      },
      {
        id: PcTabId.FileEditor,
        label: t('chat_page.tab_file_editor'),
        children: renderFileEditor(),
      },
    ]

    return <FlexRow style={{ height: '100%', overflow: 'hidden' }}>
      <DragResizeView
        open={isOpenTreeDrawer}
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

      {IS_SAFE && !getGlobalConfig().editFileInIde
        ? <PanelTab
          items={pcTabItems}
          activeId={pcTabActiveId}
          onChange={setPcTabActiveId}
          style={{
            flex: 1,
          }}
          tabListStyles={{
            justifyContent: 'flex-start',
          }}
        />
        : renderChatPanel()}

      {showFileTreeOnRightSide
        ? <DragResizeView
          open={isOpenTreeDrawer}
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
        rootPath={rootPath}
        chatIdOrChatInstance={chatInstance}
        settingsView={renderSettings(true, SettingsTabId.Settings)}
        configInfoView={renderSettings(true, SettingsTabId.ConfigInfo)}
        aboutView={renderSettings(true, SettingsTabId.About)}
        rightSlot={
          !isMobile && <IconButton
            text={isOpenTreeDrawer ? t('chat_page.close_sidebar_btn') : t('chat_page.open_sidebar_btn')}
            iconClassName={isOpenTreeDrawer ? 'codicon-layout-sidebar-right-off' : 'codicon-layout-sidebar-right'}
            hoverShowText={false}
            onClick={() => setIsOpenTreeDrawer(!isOpenTreeDrawer)}
            style={{
              paddingLeft: '0.5rem',
            }}
          ></IconButton>
        }
      ></TopToolbar>
      {renderChat()}
    </FlexColumn >
  </>
})

Chat.displayName = 'Chat'

export default Chat
