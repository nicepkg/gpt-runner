import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { SidebarProps } from '../../components/sidebar'
import { Sidebar } from '../../components/sidebar'
import { fetchGptFilesTree } from '../../networks/gpt-files'
import type { TreeItemProps } from '../../components/tree-item'
import { travelTree } from '../../helpers/utils'

export interface ChatSidebarProps {
  rootPath: string
}

export const ChatSidebar: FC<ChatSidebarProps> = (props) => {
  const { rootPath } = props

  const { data: fetchGptFilesTreeRes } = useQuery({
    queryKey: ['chat-sidebar'],
    enabled: Boolean(rootPath),
    queryFn: () => fetchGptFilesTree({
      rootPath,
    }),
  })

  const [treeItems, setTreeItems] = useState<TreeItemProps[]>([])

  useEffect(() => {
    if (!fetchGptFilesTreeRes?.data?.tree)
      return

    const _treeItems = travelTree(fetchGptFilesTreeRes.data.tree, (item) => {
      const titleParts = item.singleFileConfig?.title?.split('/') || []
      const pathParts = item.path.split('/') || []

      return {
        id: item.path,
        name: titleParts[titleParts.length - 1] || pathParts[pathParts.length - 1] || 'unknown',
        path: item.path,
        isLeaf: false,
      }
    }) as TreeItemProps[]

    setTreeItems(_treeItems)
  }, [fetchGptFilesTreeRes])

  const sidebar: SidebarProps = {
    topToolbar: {
      title: 'GPT Runner',
      actions: [],
    },
    onCreateChat: () => { },
    onDeleteChat: () => { },
    onRenameChat: () => { },
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
