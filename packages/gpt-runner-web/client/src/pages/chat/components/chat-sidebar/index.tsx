import type { FC } from 'react'
import { memo, useCallback, useEffect, useState } from 'react'
import type { AiPersonTreeItemInfoTreeItem } from '@nicepkg/gpt-runner-shared/common'
import { AiPersonTreeItemType, ClientEventName } from '@nicepkg/gpt-runner-shared/common'
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
import { useOn } from '../../../../hooks/use-on.hook'
import { getGlobalConfig } from '../../../../helpers/global-config'
import { emitter } from '../../../../helpers/emitter'
import { IS_SAFE } from '../../../../helpers/constant'
import { useFileEditorStore } from '../../../../store/zustand/file-editor'
import { useKeyIsPressed } from '../../../../hooks/use-keyboard.hook'
import { openEditor } from '../../../../networks/editor'
import { StyledIcon } from './chat-sidebar.styles'

export interface ChatSidebarProps {
  rootPath: string
  chatId: string
  reverseTreeUi?: boolean
}

export type GptTreeItemOtherInfo = AiPersonTreeItemInfoTreeItem

export const ChatSidebar: FC<ChatSidebarProps> = memo((props) => {
  const { rootPath, chatId, reverseTreeUi } = props

  const { t } = useTranslation()
  const {
    sidebarTree,
    expandChatTreeItem,
    createChatAndActive,
    updateSidebarTreeItem,
    updateActiveChatId,
    updateSidebarTreeFromRemote,
  } = useGlobalStore()

  const { addFileEditorItem } = useFileEditorStore()
  const [isLoading, setIsLoading] = useState(false)
  const { removeChatInstance } = useChatInstance({
    chatId,
  })
  const isPressedCtrl = useKeyIsPressed(['command', 'ctrl'])

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
  }, [rootPath])

  useOn({
    eventName: [ClientEventName.RefreshTree, ClientEventName.RefreshChatTree],
    listener: refreshSidebarTree,
    deps: [refreshSidebarTree],
  })

  const handleCreateChat = useCallback((gptFileId: string) => {
    createChatAndActive(gptFileId)
  }, [createChatAndActive])

  const handleDeleteChat = useCallback((chatId: string) => {
    removeChatInstance(chatId)
  }, [removeChatInstance])

  const handleClickTreeItem = useCallback((props: TreeItemState<AiPersonTreeItemInfoTreeItem>) => {
    const { otherInfo } = props

    if (otherInfo?.type === AiPersonTreeItemType.File
      && otherInfo?.path
      && isPressedCtrl
      && IS_SAFE
    ) {
      // pressed ctrl + click then open file in editor
      openEditor({
        path: otherInfo.path,
      })
      return false
    }

    if (otherInfo?.type === AiPersonTreeItemType.Chat)
      updateActiveChatId(otherInfo.id)
  }, [updateActiveChatId, isPressedCtrl])

  const renderTreeItemLeftSlot = useCallback((props: TreeItemState<GptTreeItemOtherInfo>) => {
    const { isLeaf, isExpanded, otherInfo } = props

    const getIconClassName = () => {
      if (isLeaf)
        return 'codicon-comment'

      if (otherInfo?.type === AiPersonTreeItemType.File)
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
  }, [])

  const renderTreeItemRightSlot = useCallback((props: TreeItemState<GptTreeItemOtherInfo>) => {
    const { isLeaf, otherInfo, isHovering } = props
    const { path } = otherInfo || {}

    const handleEditGptFile = () => {
      if (!path)
        return

      if (getGlobalConfig().editFileInIde) {
        emitter.emit(ClientEventName.OpenFileInIde, { filePath: path })
        return
      }

      if (IS_SAFE) {
        addFileEditorItem({
          fullPath: path,
        })
      }
    }

    if (otherInfo?.type === AiPersonTreeItemType.Chat && isLeaf) {
      return <>
        <StyledIcon
          title={t('chat_page.delete_chat_btn')}
          className='codicon-trash'
          onClick={() => handleDeleteChat(otherInfo.id)}
        ></StyledIcon>
      </>
    }

    if (otherInfo?.type === AiPersonTreeItemType.File) {
      return <>
        {/* TODO: implement edit file in web */}
        {isHovering && <StyledIcon
          title={t('chat_page.edit_btn')}
          className='codicon-edit'
          onClick={handleEditGptFile}
        ></StyledIcon>}
        <StyledIcon
          title={t('chat_page.new_chat_btn')}
          className='codicon-add'
          onClick={() => handleCreateChat(otherInfo.id)}
        ></StyledIcon>
      </>
    }

    return <></>
  }, [handleCreateChat, handleDeleteChat, t])

  const buildSearchRightSlot = useCallback(() => {
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
  }, [refreshSidebarTree, t])

  const handleExpandChange = useCallback((props: TreeItemState<AiPersonTreeItemInfoTreeItem>) => {
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
      if (a.otherInfo?.type === AiPersonTreeItemType.Chat && b.otherInfo?.type === AiPersonTreeItemType.Chat) {
        // sort by create time, new is on before
        const aCreateTime = a.otherInfo?.createAt
        const bCreateTime = b.otherInfo?.createAt

        return (aCreateTime > bCreateTime) ? -1 : (aCreateTime < bCreateTime) ? 1 : 0
      }

      // eslint-disable-next-line no-self-compare
      if (a.otherInfo?.type === a.otherInfo?.type)
        return a.name.localeCompare(b.name)

      return a.otherInfo?.type === AiPersonTreeItemType.Chat || b.otherInfo?.type === AiPersonTreeItemType.Folder
        ? 1
        : -1
    })
  }, [])

  const sidebar: SidebarProps<GptTreeItemOtherInfo> = {
    placeholder: t('chat_page.search_placeholder'),
    loading: isLoading,
    reverseTreeUi,
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
