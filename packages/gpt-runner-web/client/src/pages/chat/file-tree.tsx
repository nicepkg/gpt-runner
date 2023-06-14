import { type FC, useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type FileInfoTreeItem, travelTree, travelTreeDeepFirst } from '@nicepkg/gpt-runner-shared/common'
import clsx from 'clsx'
import { VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react'
import type { SidebarProps } from '../../components/sidebar'
import { Sidebar } from '../../components/sidebar'
import { ErrorView } from '../../components/error-view'
import { fetchCommonFilesTree } from '../../networks/common-files'
import type { TreeItemBaseState, TreeItemProps, TreeItemState } from '../../components/tree-item'
import { Icon } from '../../components/icon'
import { IconButton } from '../../components/icon-button'

export interface FileTreeProps {
  rootPath: string
}

type FileInfoSidebarTreeItem = FileInfoTreeItem & {
  checked: boolean
}

type FileSidebarTreeItem = TreeItemBaseState<FileInfoSidebarTreeItem>

const FileTree: FC<FileTreeProps> = (props: FileTreeProps) => {
  const { rootPath } = props
  const [filesSidebarTree, setFilesSidebarTree] = useState<TreeItemBaseState<FileInfoSidebarTreeItem>[]>([])
  const [checkedFileFullPaths, setCheckedFileFullPaths] = useState<string[]>([])

  const { data: fetchCommonFilesTreeRes } = useQuery({
    queryKey: ['file-tree', rootPath],
    enabled: !!rootPath,
    queryFn: () => fetchCommonFilesTree({
      rootPath,
    }),
  })

  // const updateFileTreeItem = useCallback((fullPath: string, updater: (item: FileSidebarTreeItem) => FileSidebarTreeItem) => {
  //   const finalTree = travelTree(filesSidebarTree, (item) => {
  //     if (item.otherInfo?.fullPath === fullPath)
  //       return updater(item)

  //     return item
  //   })

  //   setFilesSidebarTree(finalTree)
  // }, [filesSidebarTree, setFilesSidebarTree])

  // sync checked state
  useEffect(() => {
    const finalFilesSidebarTree = travelTreeDeepFirst(filesSidebarTree, (item) => {
      if (item.otherInfo && checkedFileFullPaths.includes(item.otherInfo.fullPath)) {
        return {
          ...item,
          otherInfo: {
            ...item.otherInfo,
            checked: true,
          },
        } satisfies FileSidebarTreeItem
      }
      return {
        ...item,
        otherInfo: {
          ...item.otherInfo!,
          checked: item.isLeaf ? false : !!item.children?.every(child => child.otherInfo?.checked),
        },
      } satisfies FileSidebarTreeItem
    })

    setFilesSidebarTree(finalFilesSidebarTree)
  }, [checkedFileFullPaths, setFilesSidebarTree])

  useEffect(() => {
    const filesInfoTree = fetchCommonFilesTreeRes?.data?.filesInfoTree
    if (!filesInfoTree)
      return

    const finalFilesSidebarTree = travelTree(filesInfoTree, (item) => {
      const result: FileSidebarTreeItem = {
        id: item.id,
        name: item.name,
        path: item.fullPath,
        isLeaf: item.isFile,
        otherInfo: { ...item, checked: false },

        // TODO: keep old state
        isExpanded: false,
      }

      return result
    })

    console.log('finalFilesSidebarTree', finalFilesSidebarTree)

    setFilesSidebarTree(finalFilesSidebarTree)
  }, [fetchCommonFilesTreeRes, setFilesSidebarTree])

  const renderTreeItemLeftSlot = (props: TreeItemState<FileInfoSidebarTreeItem>) => {
    const { isLeaf, isExpanded, otherInfo } = props

    const getIconClassName = () => {
      if (isLeaf)
        return 'codicon-file'

      return isExpanded ? 'codicon-folder-opened' : 'codicon-folder'
    }

    return <>
      <VSCodeCheckbox
        style={{
          marginRight: '0.25rem',
        }}
        onClick={(e) => {
          e.stopPropagation()
          return false
        }}
        checked={otherInfo?.checked}
        onChange={(e) => {
          if (!otherInfo)
            return

          const checked = (e.target as HTMLInputElement).checked
          otherInfo.checked = checked

          setCheckedFileFullPaths((preState) => {
            if (!otherInfo.checked)
              return preState.filter(item => item !== otherInfo.fullPath)

            return [...preState, otherInfo.fullPath]
          })
        }}></VSCodeCheckbox>

      {!isLeaf && <Icon style={{
        marginRight: '0.25rem',
      }} className={clsx(isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right')}></Icon >}

      <Icon style={{
        marginLeft: !isLeaf ? '0' : '0.6rem',
        marginRight: '0.45rem',
      }} className={getIconClassName()}></Icon>
    </>
  }

  const handleExpandChange = useCallback((props: TreeItemState<FileInfoSidebarTreeItem>) => {
    const { id, isExpanded } = props
    const newFilesSidebarTree = travelTree(filesSidebarTree, (item) => {
      if (item.id === id) {
        return {
          ...item,
          isExpanded,
        }
      }

      return item
    })

    setFilesSidebarTree(newFilesSidebarTree)
  }, [filesSidebarTree])

  const buildSearchRightSlot = () => {
    return <IconButton
      style={{
        marginLeft: '0.5rem',
        height: '100%',
      }}
      text='Refresh'
      showText={false}
      iconClassName='codicon-filter'
    ></IconButton>
  }

  const sortTreeItems = useCallback((items: TreeItemProps<FileInfoSidebarTreeItem>[]) => {
    return items?.sort((a, b) => {
      if (a.otherInfo?.isFile === b.otherInfo?.isFile)
        return a.name.localeCompare(b.name)

      return a.otherInfo?.isFile ? 1 : -1
    })
  }, [])

  const sidebar: SidebarProps<FileInfoSidebarTreeItem> = {
    placeholder: 'Search file...',
    tree: {
      items: filesSidebarTree,
      renderTreeItemLeftSlot,
      onTreeItemCollapse: handleExpandChange,
      onTreeItemExpand: handleExpandChange,
    },
    buildSearchRightSlot,
    sortTreeItems,
  }

  if (!rootPath)
    return <ErrorView text="Please provide the root path!"></ErrorView>

  return <Sidebar {...sidebar}></Sidebar>
}

FileTree.displayName = 'FileTree'

export default FileTree
