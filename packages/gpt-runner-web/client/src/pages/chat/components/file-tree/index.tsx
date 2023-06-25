import { type FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { travelTree, travelTreeDeepFirst } from '@nicepkg/gpt-runner-shared/common'
import clsx from 'clsx'
import { VSCodeCheckbox, VSCodeLink } from '@vscode/webview-ui-toolkit/react'
import { Trans, useTranslation } from 'react-i18next'
import type { SidebarProps } from '../../../../components/sidebar'
import { Sidebar } from '../../../../components/sidebar'
import { ErrorView } from '../../../../components/error-view'
import { fetchCommonFilesTree } from '../../../../networks/common-files'
import type { TreeItemProps, TreeItemState } from '../../../../components/tree-item'
import { Icon } from '../../../../components/icon'
import { IconButton } from '../../../../components/icon-button'
import { countTokenQuick, formatNumWithK } from '../../../../helpers/utils'
import { useGlobalStore } from '../../../../store/zustand/global'
import type { FileInfoSidebarTreeItem, FileSidebarTreeItem } from '../../../../store/zustand/global/file-tree.slice'
import { PopoverMenu } from '../../../../components/popover-menu'
import { useTempStore } from '../../../../store/zustand/temp'
import { FileTreeItemRightWrapper, FileTreeSidebarHighlight, FileTreeSidebarUnderSearchWrapper, FilterWrapper } from './file-tree.styles'

export interface FileTreeProps {
  rootPath: string
}

export const FileTree: FC<FileTreeProps> = memo((props: FileTreeProps) => {
  const { rootPath } = props

  const { t } = useTranslation()
  const [filesTree, _setFilesTree] = useState<FileSidebarTreeItem[]>([])
  const fullPathFileMapRef = useRef<Record<string, FileSidebarTreeItem>>({})
  const {
    excludeFileExts,
    updateExcludeFileExts,
    expendedFilePaths,
    updateExpendedFilePaths,
    checkedFilePaths,
    updateCheckedFilePaths,
    provideFilePathsTreePromptToGpt,
    updateProvideFilePathsTreePromptToGpt,
    filePathsTreePrompt,
    updateFilePathsTreePrompt,
  } = useGlobalStore()
  const { updateFilesRelativePaths } = useTempStore()

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

  const { data: fetchCommonFilesTreeRes, isLoading } = useQuery({
    queryKey: ['file-tree', rootPath, excludeFileExts.join(',')],
    enabled: !!rootPath,
    keepPreviousData: true,
    queryFn: () => fetchCommonFilesTree({
      rootPath,
      excludeExts: excludeFileExts,
    }),
  })

  // sync checked state
  useEffect(() => {
    if (!Object.values(fullPathFileMapRef.current).length || !filesTree.length)
      return

    // check all path in checkedFilePaths
    checkedFilePaths.forEach((fullPath) => {
      const file = fullPathFileMapRef.current[fullPath]

      if (!file?.otherInfo)
        return

      file.otherInfo!.checked = true
    })

    // sync parent path checked state
    travelTreeDeepFirst(filesTree, (item) => {
      if (item.isLeaf)
        return item

      const children = item?.children || []

      if (!children.length)
        return item

      const childrenAllIsChecked = children.every(child => child.otherInfo?.checked)
      item.otherInfo!.checked = childrenAllIsChecked

      return item
    })

    // setFilesTree([...filesTree])
  }, [checkedFilePaths, fullPathFileMapRef.current, filesTree, setFilesTree])

  useEffect(() => {
    const filesInfoTree = fetchCommonFilesTreeRes?.data?.filesInfoTree
    if (!filesInfoTree)
      return

    const filesRelativePaths: string[] = []
    const finalFilesSidebarTree = travelTree(filesInfoTree, (item) => {
      const oldIsExpanded = expendedFilePaths.includes(item.fullPath)
      const oldIsChecked = checkedFilePaths.includes(item.fullPath)

      const result: FileSidebarTreeItem = {
        id: item.id,
        name: item.name,
        path: item.fullPath,
        isLeaf: item.isFile,
        otherInfo: {
          ...item,
          checked: oldIsChecked,
        },
        isExpanded: oldIsExpanded,
      }

      item.isFile && filesRelativePaths.push(item.projectRelativePath)

      return result
    })

    setFilesTree(finalFilesSidebarTree, true)
    updateFilePathsTreePrompt(finalFilesSidebarTree)
    updateFilesRelativePaths(filesRelativePaths)
  }, [fetchCommonFilesTreeRes])

  useEffect(() => {
    if (excludeFileExts.length)
      return

    const { includeFileExts = [], allFileExts = [] } = fetchCommonFilesTreeRes?.data || {}
    const _excludeFileExts = allFileExts.filter(ext => !includeFileExts.includes(ext))

    updateExcludeFileExts(_excludeFileExts)
  }, [fetchCommonFilesTreeRes])

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
    const { allFileExts = [] } = fetchCommonFilesTreeRes?.data || {}

    const handleExtCheckedChange = (ext: string, checked: boolean) => {
      updateExcludeFileExts((preState) => {
        if (checked)
          return preState.filter(item => item !== ext)

        return [...preState, ext]
      })
    }

    return <PopoverMenu
      // isPopoverOpen={true}
      // onPopoverDisplayChange={() => { }}
      yPosition='bottom'
      childrenInMenuWhenOpen={false}
      clickOutSideToClose={false}
      menuStyle={{
        marginLeft: '1rem',
        marginRight: '1rem',
      }}
      childrenStyle={{
        height: '100%',
      }}
      buildChildrenSlot={({ isHovering }) => {
        return <IconButton
          text={t('chat_page.filter_btn')}
          iconClassName='codicon-filter'
          hoverShowText={!isHovering}
          style={{
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            height: '100%',
          }}
        ></IconButton>
      }}
      buildMenuSlot={() => {
        return <FilterWrapper>
          {allFileExts.map((ext) => {
            return <VSCodeCheckbox
              key={ext}
              checked={!excludeFileExts.includes(ext)}
              onChange={(e) => {
                const checked = (e.target as HTMLInputElement).checked
                handleExtCheckedChange(ext, checked)
              }}>{ext}</VSCodeCheckbox>
          })}
        </FilterWrapper>
      }}
    />
  }

  const buildUnderSearchSlot = () => {
    if (!Object.keys(fullPathFileMapRef.current).length)
      return null

    const filaPathsPromptTokenNum = countTokenQuick(filePathsTreePrompt)

    const checkedFilesContentPromptTokenNum = checkedFilePaths.reduce((pre, cur) => {
      const file = fullPathFileMapRef.current[cur]
      return pre + (file?.otherInfo?.tokenNum ?? 0)
    }, 0)

    let totalTokenNum = checkedFilesContentPromptTokenNum

    if (provideFilePathsTreePromptToGpt)
      totalTokenNum += filaPathsPromptTokenNum

    const resetAllChecked = () => {
      updateCheckedFilePaths((preState) => {
        preState.forEach((item) => {
          const file = fullPathFileMapRef.current[item]
          file.otherInfo!.checked = false
          return item
        })

        return []
      })
      updateProvideFilePathsTreePromptToGpt(false)
    }

    const handleProvideFilePathsTreePromptToGptChange = (e: any) => {
      const checked = e.target?.checked as boolean
      updateProvideFilePathsTreePromptToGpt(checked)
    }

    return <FileTreeSidebarUnderSearchWrapper>
      <Trans
        i18nKey={'chat_page.file_tree_top_tokens_tips'}
        values={{
          fileNum: checkedFilePaths.length,
          tokenNum: formatNumWithK(totalTokenNum),
        }}
        components={{
          FileNumWrapper: <FileTreeSidebarHighlight style={{ marginLeft: 0 }}></FileTreeSidebarHighlight>,
          TokenNumWrapper: <FileTreeSidebarHighlight></FileTreeSidebarHighlight>,
        }}
      ></Trans>
      <VSCodeLink style={{
        display: 'inline-block',
        marginLeft: '0.25rem',
      }} onClick={resetAllChecked}>
        {t('chat_page.file_tree_top_clear_checked_btn')}
      </VSCodeLink>

      <div>
        <VSCodeCheckbox
          style={{
            marginTop: '0.5rem',
          }}
          checked={provideFilePathsTreePromptToGpt}
          onChange={handleProvideFilePathsTreePromptToGptChange}>
          {t('chat_page.file_tree_top_all_file_path_as_prompt', {
            tokenNum: formatNumWithK(filaPathsPromptTokenNum),
          })}
        </VSCodeCheckbox>
      </div>
    </FileTreeSidebarUnderSearchWrapper>
  }

  const sortTreeItems = useCallback((items: TreeItemProps<FileInfoSidebarTreeItem>[]) => {
    return items?.sort((a, b) => {
      if (a.otherInfo?.isFile === b.otherInfo?.isFile)
        return a.name.localeCompare(b.name)

      return a.otherInfo?.isFile ? 1 : -1
    })
  }, [])

  const sidebar: SidebarProps<FileInfoSidebarTreeItem> = {
    placeholder: t('chat_page.search_files_placeholder'),
    loading: isLoading,
    tree: {
      items: filesTree,
      renderTreeItemLeftSlot,
      renderTreeItemRightSlot,
      onTreeItemCollapse: handleExpandChange,
      onTreeItemExpand: handleExpandChange,
    },
    buildSearchRightSlot,
    buildUnderSearchSlot,
    sortTreeItems,
  }

  if (!rootPath)
    return <ErrorView text={t('chat_page.root_path_not_found_tips')}></ErrorView>

  return <Sidebar {...sidebar}></Sidebar>
})

FileTree.displayName = 'FileTree'
