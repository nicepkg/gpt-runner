import type { FC } from 'react'
import { useCallback, useEffect } from 'react'
import type { GptFileInfoTreeItem } from '@nicepkg/gpt-runner-shared/common'
import { ChatMessageStatus, GptFileTreeItemType } from '@nicepkg/gpt-runner-shared/common'
import clsx from 'clsx'
import type { SidebarProps } from '../../components/sidebar'
import { Sidebar } from '../../components/sidebar'
import type { TreeItemState } from '../../components/tree-item'
import { Icon } from '../../components/icon'
import { IconButton } from '../../components/icon-button'
import { ErrorView } from '../../components/error-view'
import { useGlobalStore } from '../../store/zustand/global'
import { useChatInstance } from '../../hooks/use-chat-instance.hook'

export interface ChatSidebarProps {
  rootPath: string
}

export type GptTreeItemOtherInfo = GptFileInfoTreeItem

export const ChatSidebar: FC<ChatSidebarProps> = (props) => {
  const { rootPath } = props
  const { activeChatId, sidebarTree, updateActiveChatId, updateSidebarTreeItem, updateUserConfigFromRemote, addChatInstance, updateSidebarTreeFromRemote } = useGlobalStore()
  const { removeChatInstance } = useChatInstance({
    chatId: activeChatId,
  })

  useEffect(() => {
    updateUserConfigFromRemote(rootPath)
    updateSidebarTreeFromRemote(rootPath)
  }, [rootPath])

  const handleCreateChat = useCallback((gptFileId: string) => {
    const { chatInstance } = addChatInstance(gptFileId, {
      name: 'New Chat',
      inputtingPrompt: '',
      systemPrompt: '',
      messages: [],
      singleFileConfig: {},
      status: ChatMessageStatus.Success,
    })

    updateSidebarTreeItem(gptFileId, {
      defaultIsExpanded: true,
    })

    updateActiveChatId(chatInstance.id)
  }, [addChatInstance, updateSidebarTreeItem, updateActiveChatId])

  const handleDeleteChat = useCallback((chatId: string) => {
    removeChatInstance(chatId)
  }, [removeChatInstance])

  const renderTreeLeftSlot = (props: TreeItemState<GptTreeItemOtherInfo>) => {
    const { isLeaf, isExpanded, otherInfo } = props

    const getIconClassName = () => {
      if (isLeaf)
        return 'codicon-comment'

      if (otherInfo?.type === GptFileTreeItemType.File)
        return 'codicon-repo'

      return isExpanded ? 'codicon-folder-opened' : 'codicon-folder'
    }

    return <>
      {!isLeaf && <Icon style={{
        marginRight: '0.25rem',
      }} className={clsx(isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right')}></Icon >}

      <Icon style={{
        marginLeft: !isLeaf ? '0' : '0.6rem',
        marginRight: '0.45rem',
      }} className={getIconClassName()}></Icon>
    </>
  }

  const renderTreeRightSlot = (props: TreeItemState<GptTreeItemOtherInfo>) => {
    const { isLeaf, otherInfo } = props

    if (otherInfo?.type === GptFileTreeItemType.Chat && isLeaf) {
      return <>
        <IconButton
          text='Delete Chat'
          showText={false}
          iconClassName='codicon-trash'
          onClick={() => handleDeleteChat(otherInfo.id)}
        ></IconButton>
      </>
    }

    if (otherInfo?.type === GptFileTreeItemType.File) {
      return <IconButton
        text='New Chat'
        showText={false}
        iconClassName='codicon-add'
        onClick={() => handleCreateChat(otherInfo.id)}
      ></IconButton>
    }

    return <></>
  }

  const sidebar: SidebarProps<GptTreeItemOtherInfo> = {
    topToolbar: {
      title: 'GPT Runner',
      actions: [],
    },
    renderTreeLeftSlot,
    renderTreeRightSlot,
    tree: {
      items: sidebarTree,
      // items: [
      //   {
      //     id: '1',
      //     name: 'aaa',
      //     path: 'aaa',
      //     isLeaf: false,
      //     children: [
      //       {
      //         id: '1-1',
      //         name: 'bbb',
      //         path: 'aaa/bbb',
      //         isLeaf: false,
      //         children: [
      //           {
      //             id: '1-1-1',
      //             name: 'ccc',
      //             path: 'aaa/bbb/ccc',
      //             isLeaf: true,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ],
    },
  }

  if (!rootPath)
    return <ErrorView text="Please provide the root path!"></ErrorView>

  return <Sidebar {...sidebar}></Sidebar>
}

ChatSidebar.displayName = 'ChatSidebar'
