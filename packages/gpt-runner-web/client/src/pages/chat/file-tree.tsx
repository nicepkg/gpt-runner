import { type FC, useCallback, useEffect, useRef, useState } from 'react'
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
import { formatNumWithK } from '../../helpers/utils'
import { useGlobalStore } from '../../store/zustand/global'
import { FileTreeItemRightWrapper } from './chat.styles'

export interface FileTreeProps {
  rootPath: string
}

type FileInfoSidebarTreeItem = FileInfoTreeItem & {
  checked: boolean
}

type FileSidebarTreeItem = TreeItemBaseState<FileInfoSidebarTreeItem>

const FileTree: FC<FileTreeProps> = (props: FileTreeProps) => {
  const { rootPath } = props
  const [filesTree, _setFilesTree] = useState<FileSidebarTreeItem[]>([])
  const fullPathFileMapRef = useRef<Record<string, FileSidebarTreeItem>>({})
  const {
    expendedFilePaths,
    updateExpendedFilePaths,
    checkedFilePaths,
    updateCheckedFilePaths,
  } = useGlobalStore()

  const updateMap = useCallback((tree: FileSidebarTreeItem[]) => {
    const result: Record<string, FileSidebarTreeItem> = {}
    travelTree(tree, (item) => {
      if (item.otherInfo)
        result[item.otherInfo.fullPath] = item
    })
    fullPathFileMapRef.current = result
  }, [])

  const setFilesTree = useCallback((tree: FileSidebarTreeItem[], isUpdateFullPathFileMap = false) => {
    if (isUpdateFullPathFileMap)
      updateMap(tree)

    _setFilesTree(tree)
  }, [_setFilesTree, updateMap])

  const updateFileItem = useCallback((fileItemOrFullPath: FileSidebarTreeItem | string, updater: (fileItem: FileSidebarTreeItem) => void) => {
    const fullPath = typeof fileItemOrFullPath === 'string' ? fileItemOrFullPath : fileItemOrFullPath.otherInfo?.fullPath
    if (!fullPath)
      return

    const fileItem = fullPathFileMapRef.current[fullPath]
    if (!fileItem)
      return

    updater(fileItem)
    setFilesTree([...filesTree])
  }, [filesTree, setFilesTree])

  const { data: fetchCommonFilesTreeRes } = useQuery({
    queryKey: ['file-tree', rootPath],
    enabled: !!rootPath,
    queryFn: () => fetchCommonFilesTree({
      rootPath,
    }),
  })

  // sync checked state
  useEffect(() => {
    if (!Object.values(fullPathFileMapRef.current).length)
      return

    // check all path in checkedFilePaths
    checkedFilePaths.forEach((fullPath) => {
      const file = fullPathFileMapRef.current[fullPath]
      file.otherInfo!.checked = true
    })

    // sync parent path checked state
    travelTreeDeepFirst(filesTree, (item) => {
      if (item.isLeaf)
        return

      const children = item?.children || []

      if (!children.length)
        return

      const childrenAllIsChecked = children.every(child => child.otherInfo?.checked)
      item.otherInfo!.checked = childrenAllIsChecked
    })

    setFilesTree([...filesTree])
  }, [checkedFilePaths, fullPathFileMapRef.current, setFilesTree])

  useEffect(() => {
    const filesInfoTree = fetchCommonFilesTreeRes?.data?.filesInfoTree
    if (!filesInfoTree)
      return

    const finalFilesSidebarTree = travelTree(filesInfoTree, (item) => {
      const oldIsExpanded = expendedFilePaths.includes(item.fullPath)

      const result: FileSidebarTreeItem = {
        id: item.id,
        name: item.name,
        path: item.fullPath,
        isLeaf: item.isFile,
        otherInfo: {
          ...item,
          checked: false,
        },
        isExpanded: oldIsExpanded,
      }

      return result
    })

    console.log('finalFilesSidebarTree', finalFilesSidebarTree)

    setFilesTree(finalFilesSidebarTree, true)
  }, [fetchCommonFilesTreeRes, setFilesTree])

  const renderTreeItemLeftSlot = (props: TreeItemState<FileInfoSidebarTreeItem>) => {
    const { isLeaf, isExpanded, otherInfo } = props

    const getIconClassName = () => {
      if (isLeaf)
        return 'codicon-file'

      return isExpanded ? 'codicon-folder-opened' : 'codicon-folder'
    }

    const handleCheckedChange = (checked: boolean) => {
      updateFileItem(props, (fileItem) => {
        fileItem.otherInfo!.checked = checked
      })

      updateCheckedFilePaths((preState) => {
        const fullPath = props.otherInfo?.fullPath

        if (!fullPath)
          return preState

        let finalPaths: string[] = []
        const isLeaf = fullPathFileMapRef.current[fullPath].isLeaf
        const children = fullPathFileMapRef.current[fullPath]?.children || []

        if (!checked) {
          const shouldRemovePaths: string[] = []

          if (isLeaf)
            shouldRemovePaths.push(fullPath)

          if (children.every(child => child.otherInfo!.checked)) {
            travelTree(children, (child) => {
              child.otherInfo!.checked = false
              child.isLeaf && shouldRemovePaths.push(child.otherInfo!.fullPath)
            })
          }

          finalPaths = preState.filter(item => !shouldRemovePaths.includes(item))
        }
        else {
          const showAddPaths: string[] = []

          if (isLeaf)
            showAddPaths.push(fullPath)

          travelTree(children, (child) => {
            child.otherInfo!.checked = true
            child.isLeaf && showAddPaths.push(child.otherInfo!.fullPath)
          })

          finalPaths = [...new Set([...preState, ...showAddPaths])]
        }

        return finalPaths
      })
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
          const checked = (e.target as HTMLInputElement).checked
          handleCheckedChange(checked)
        }}
      ></VSCodeCheckbox>

      {!isLeaf && <Icon style={{
        marginRight: '0.25rem',
      }} className={clsx(isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right')}></Icon >}

      <Icon style={{
        marginLeft: !isLeaf ? '0' : '0.6rem',
        marginRight: '0.45rem',
      }} className={getIconClassName()}></Icon>
    </>
  }

  const renderTreeItemRightSlot = (props: TreeItemState<FileInfoSidebarTreeItem>) => {
    const { otherInfo } = props

    if (!otherInfo)
      return null

    return <FileTreeItemRightWrapper>
      {formatNumWithK(otherInfo.tokenNum)}
      <Icon
        style={{
          marginLeft: '0.25rem',
          fontSize: '1.2rem',
        }}
        className='codicon-symbol-string'
      ></Icon >
    </FileTreeItemRightWrapper>
  }

  const handleExpandChange = useCallback((props: TreeItemState<FileInfoSidebarTreeItem>) => {
    const { isExpanded, otherInfo } = props
    const fullPath = otherInfo?.fullPath

    if (!fullPath)
      return

    const file = fullPathFileMapRef.current[fullPath]
    file.isExpanded = isExpanded

    updateExpendedFilePaths((preState) => {
      const finalPaths = isExpanded ? [...preState, fullPath] : preState.filter(item => item !== fullPath)
      return finalPaths
    })

    setFilesTree([...filesTree])
  }, [filesTree, setFilesTree])

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
      items: filesTree,
      renderTreeItemLeftSlot,
      renderTreeItemRightSlot,
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
