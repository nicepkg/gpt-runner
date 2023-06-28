import type { FC } from 'react'
import { memo, useCallback, useEffect, useState } from 'react'
import type { GptFileInfoTreeItem } from '@nicepkg/gpt-runner-shared/common'
import { ClientEventName, GptFileTreeItemType } from '@nicepkg/gpt-runner-shared/common'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
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
  chatId: string
}

export type GptTreeItemOtherInfo = GptFileInfoTreeItem

export const ChatSidebar: FC<ChatSidebarProps> = memo((props) => {
  const { rootPath, chatId } = props

  const { t } = useTranslation()
  const {
    sidebarTree,
    expandChatTreeItem,
    createChatAndActive,
    updateSidebarTreeItem,
    updateActiveChatId,
    updateSidebarTreeFromRemote,
  } = useGlobalStore()

  const [isLoading, setIsLoading] = useState(false)

  const { removeChatInstance } = useChatInstance({
    chatId,
  })

  useEffect(() => {
    expandChatTreeItem(chatId)
  }, [chatId, expandChatTreeItem])

  const refreshSidebarTree = useCallback(async () => {
    setIsLoading(true)

    try {
      await updateSidebarTreeFromRemote(rootPath)
    }
    finally {
      setIsLoading(false)
    }
  }, [rootPath, updateSidebarTreeFromRemote])

  useEffect(() => {
    refreshSidebarTree()

    emitter.on(ClientEventName.RefreshTree, refreshSidebarTree)
    emitter.on(ClientEventName.RefreshChatTree, refreshSidebarTree)

    return () => {
      emitter.off(ClientEventName.RefreshTree, refreshSidebarTree)
      emitter.off(ClientEventName.RefreshChatTree, refreshSidebarTree)
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
          text={t('chat_page.delete_chat_btn')}
          showText={false}
          iconClassName='codicon-trash'
          onClick={() => handleDeleteChat(otherInfo.id)}
        ></IconButton>
      </>
    }

    if (otherInfo?.type === GptFileTreeItemType.File) {
      return <IconButton
        text={t('chat_page.new_chat_btn')}
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
      text={t('chat_page.refresh_btn')}
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
    if (item.otherInfo?.id === chatId)
      return { ...item, isFocused: true }

    return item
  }, [chatId])

  const sortTreeItems = useCallback((items: TreeItemProps<GptTreeItemOtherInfo>[]) => {
    return items?.sort((a, b) => {
      if (a.otherInfo?.type === GptFileTreeItemType.Chat && b.otherInfo?.type === GptFileTreeItemType.Chat) {
        // sort by create time, new is on before
        const aCreateTime = a.otherInfo?.createAt
        const bCreateTime = b.otherInfo?.createAt

        return (aCreateTime > bCreateTime) ? -1 : (aCreateTime < bCreateTime) ? 1 : 0
      }

      // eslint-disable-next-line no-self-compare
      if (a.otherInfo?.type === a.otherInfo?.type)
        return a.name.localeCompare(b.name)

      return a.otherInfo?.type === GptFileTreeItemType.Chat || b.otherInfo?.type === GptFileTreeItemType.Folder
        ? 1
        : -1
    })
  }, [])

  const sidebar: SidebarProps<GptTreeItemOtherInfo> = {
    placeholder: t('chat_page.search_placeholder'),
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
    return <ErrorView text={t('chat_page.root_path_not_found_tips')}></ErrorView>

  return <Sidebar {...sidebar}></Sidebar>
})

ChatSidebar.displayName = 'ChatSidebar'
