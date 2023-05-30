import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { GptFileInfoTreeItem } from '@nicepkg/gpt-runner-shared/common'
import { travelTree } from '@nicepkg/gpt-runner-shared/common'
import clsx from 'clsx'
import type { SidebarProps } from '../../components/sidebar'
import { Sidebar } from '../../components/sidebar'
import { fetchGptFilesTree } from '../../networks/gpt-files'
import type { TreeItemProps, TreeItemState } from '../../components/tree-item'
import { Icon } from '../../components/icon'

export interface ChatSidebarProps {
  rootPath: string
}

export type GptTreeItemOtherInfo = GptFileInfoTreeItem

export const ChatSidebar: FC<ChatSidebarProps> = (props) => {
  const { rootPath } = props

  const { data: fetchGptFilesTreeRes } = useQuery({
    queryKey: ['chat-sidebar'],
    enabled: Boolean(rootPath),
    queryFn: () => fetchGptFilesTree({
      rootPath,
    }),
  })

  const [treeItems, setTreeItems] = useState<TreeItemProps<GptTreeItemOtherInfo>[]>([])

  useEffect(() => {
    if (!fetchGptFilesTreeRes?.data?.filesInfoTree)
      return

    const _treeItems = travelTree(fetchGptFilesTreeRes.data.filesInfoTree, (item) => {
      return {
        id: item.id,
        name: item.name,
        path: item.path,
        isLeaf: false,
        otherInfo: item,
      }
    }) satisfies TreeItemProps<GptTreeItemOtherInfo>[]

    setTreeItems(_treeItems)
  }, [fetchGptFilesTreeRes])

  const renderTreeLeftSlot = (props: TreeItemState<GptTreeItemOtherInfo>) => {
    const { isLeaf, isExpanded } = props

    const getIconClassName = () => {
      if (isLeaf)
        return 'codicon-comment'

      if (isExpanded)
        return 'codicon-folder-opened'

      return 'codicon-folder'
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
    const { isLeaf, children } = props
    const childrenAllIsLeaf = children?.every(child => child.isLeaf)

    if (isLeaf) {
      return <>
        <Icon style={{
          marginLeft: '6px',
        }} className={'codicon-trash'}></Icon>
      </>
    }

    if (childrenAllIsLeaf) {
      return <Icon style={{
        marginLeft: '6px',
      }} className='codicon-new-file' ></Icon>
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
      items: treeItems,
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

  return <Sidebar {...sidebar}></Sidebar>
}

ChatSidebar.displayName = 'ChatSidebar'
