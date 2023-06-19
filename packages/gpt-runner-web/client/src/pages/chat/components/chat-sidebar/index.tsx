import type { FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { GptFileInfoTreeItem } from '@nicepkg/gpt-runner-shared/common'
import { ClientEventName, GptFileTreeItemType } from '@nicepkg/gpt-runner-shared/common'
import clsx from 'clsx'
import type { SidebarProps } from '../../../../components/sidebar'
import { Sidebar } from '../../../../components/sidebar'
import type { TreeItemProps, TreeItemState } from '../../../../components/tree-item'
import { Icon } from '../../../../components/icon'
import { IconButton } from '../../../../components/icon-button'
import { ErrorView } from '../../../../components/error-view'
import { useGlobalStore } from '../../../../store/zustand/global'
import { useChatInstance } from '../../../../hooks/use-chat-instance.hook'
import { emitter } from '../../../../helpers/emitter'

export interface ChatSidebarProps {
  rootPath: string
}

export type GptTreeItemOtherInfo = GptFileInfoTreeItem

export const ChatSidebar: FC<ChatSidebarProps> = (props) => {
  const { rootPath } = props
  const { activeChatId, sidebarTree, expandChatTreeItem, createChatAndActive, updateSidebarTreeItem, updateActiveChatId, updateUserConfigFromRemote, updateSidebarTreeFromRemote } = useGlobalStore()
  const [isLoading, setIsLoading] = useState(false)

  const { removeChatInstance } = useChatInstance({
    chatId: activeChatId,
  })

  useEffect(() => {
    expandChatTreeItem(activeChatId)
  }, [activeChatId, expandChatTreeItem])

  const refreshSidebarTree = useCallback(async () => {
    setIsLoading(true)

    try {
      await updateUserConfigFromRemote(rootPath)
      await updateSidebarTreeFromRemote(rootPath)
    }
    finally {
      setIsLoading(false)
    }
  }, [rootPath, updateUserConfigFromRemote, updateSidebarTreeFromRemote])

  useEffect(() => {
    refreshSidebarTree()

    emitter.on(ClientEventName.RefreshTree, refreshSidebarTree)

    return () => {
      emitter.off(ClientEventName.RefreshTree, refreshSidebarTree)
    }
  }, [rootPath])

  const handleCreateChat = useCallback((gptFileId: string) => {
    createChatAndActive(gptFileId)
  }, [createChatAndActive])

  const handleDeleteChat = useCallback((chatId: string) => {
    removeChatInstance(chatId)
  }, [removeChatInstance])

  const handleClickTreeItem = useCallback((props: TreeItemState<GptFileInfoTreeItem>) => {
    const { otherInfo } = props

    if (otherInfo?.type === GptFileTreeItemType.Chat)
      updateActiveChatId(otherInfo.id)
  }, [updateActiveChatId])

  const renderTreeItemLeftSlot = (props: TreeItemState<GptTreeItemOtherInfo>) => {
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

  const renderTreeItemRightSlot = (props: TreeItemState<GptTreeItemOtherInfo>) => {
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

  const buildSearchRightSlot = () => {
    return <IconButton
      style={{
        marginLeft: '0.5rem',
        height: '100%',
      }}
      text='Refresh'
      showText={false}
      iconClassName='codicon-refresh'
      animatingWhenClick
      onClick={refreshSidebarTree}
    ></IconButton>
  }

  const handleExpandChange = useCallback((props: TreeItemState<GptFileInfoTreeItem>) => {
    updateSidebarTreeItem(props.id, {
      isExpanded: props.isExpanded,
    })
  }, [updateSidebarTreeItem])

  const buildTreeItem = useCallback((item: TreeItemProps<GptTreeItemOtherInfo>) => {
    if (item.otherInfo?.id === activeChatId)
      return { ...item, isFocused: true }

    return item
  }, [activeChatId])

  const sortTreeItems = useCallback((items: TreeItemProps<GptTreeItemOtherInfo>[]) => {
    return items?.sort((a, b) => {
      if (a.otherInfo?.type === GptFileTreeItemType.Chat && b.otherInfo?.type === GptFileTreeItemType.Chat) {
        // sort by create time, new is on before
        const aCreateTime = a.otherInfo?.createAt
        const bCreateTime = b.otherInfo?.createAt

        return (aCreateTime > bCreateTime) ? -1 : (aCreateTime < bCreateTime) ? 1 : 0
      }

      // sort by name, 0-9 a-z A-Z
      const aName = a.name?.toLowerCase()
      const bName = b.name?.toLowerCase()

      return (aName < bName) ? -1 : (aName > bName) ? 1 : 0
    })
  }, [])

  const sidebar: SidebarProps<GptTreeItemOtherInfo> = {
    placeholder: 'GPT RUNNER',
    loading: isLoading,
    tree: {
      items: sidebarTree,
      renderTreeItemLeftSlot,
      renderTreeItemRightSlot,
      onTreeItemClick: handleClickTreeItem,
      onTreeItemCollapse: handleExpandChange,
      onTreeItemExpand: handleExpandChange,
    },
    buildSearchRightSlot,
    buildTreeItem,
    sortTreeItems,
  }

  if (!rootPath)
    return <ErrorView text="Please provide the root path!"></ErrorView>

  return <Sidebar {...sidebar}></Sidebar>
}

ChatSidebar.displayName = 'ChatSidebar'
