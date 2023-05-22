import type { FC } from 'react'
import { useCallback } from 'react'
import { VSCodePanelTab, VSCodePanelView, VSCodePanels } from '@vscode/webview-ui-toolkit/react'
import type { SidebarProps } from '../../components/sidebar'
import { Sidebar } from '../../components/sidebar'
import { useIsMobile } from '../../hooks/use-is-mobile.hook'
import { ChatMessagePanel } from '../../components/chat-message-panel'
import { FlexColumn, FlexRow } from '../../styles/global.styles'
import { SidebarWrapper } from './chat.styles'

const Chat: FC = () => {
  const isMobile = useIsMobile()

  const sidebar: SidebarProps = {
    topToolbar: {
      title: 'GPT Runner',
      actions: [],
    },
    onCreateChat: () => { },
    onDeleteChat: () => { },
    onRenameChat: () => { },
    tree: {
      items: [
        {
          id: '1',
          name: 'aaa',
          path: 'aaa',
          isLeaf: false,
          children: [
            {
              id: '1-1',
              name: 'bbb',
              path: 'aaa/bbb',
              isLeaf: false,
              children: [
                {
                  id: '1-1-1',
                  name: 'ccc',
                  path: 'aaa/bbb/ccc',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
      ],
    },
  }

  const renderSidebar = useCallback(() => {
    return <SidebarWrapper>
      <Sidebar {...sidebar}></Sidebar>
    </SidebarWrapper>
  }, [sidebar])

  const renderChatPanel = useCallback(() => {
    return <FlexColumn style={{ flex: 1 }}>
      <ChatMessagePanel></ChatMessagePanel>
    </FlexColumn>
  }, [])

  if (isMobile) {
    return <VSCodePanels>
      <VSCodePanelTab id="explore">Explore</VSCodePanelTab>
      <VSCodePanelTab id="chat">Chat</VSCodePanelTab>
      <VSCodePanelView id="explore">
        {renderSidebar()}
      </VSCodePanelView>
      <VSCodePanelView id="chat">
        {renderChatPanel()}
      </VSCodePanelView>
    </VSCodePanels>
  }

  return <FlexRow>
    {renderSidebar()}
    {renderChatPanel()}
  </FlexRow>
}

Chat.displayName = 'Chat'

export default Chat
