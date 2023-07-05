import { type FC, memo, useCallback, useEffect } from 'react'
import { ClientEventName, travelTree, travelTreeDeepFirst } from '@nicepkg/gpt-runner-shared/common'
import clsx from 'clsx'
import { VSCodeCheckbox, VSCodeLink } from '@vscode/webview-ui-toolkit/react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import type { SidebarProps } from '../../../../components/sidebar'
import { Sidebar } from '../../../../components/sidebar'
import { ErrorView } from '../../../../components/error-view'
import type { TreeItemProps, TreeItemState } from '../../../../components/tree-item'
import { Icon } from '../../../../components/icon'
import { IconButton } from '../../../../components/icon-button'
import { formatNumWithK } from '../../../../helpers/utils'
import { useGlobalStore } from '../../../../store/zustand/global'
import type { FileInfoSidebarTreeItem, FileSidebarTreeItem } from '../../../../store/zustand/global/file-tree.slice'
import { PopoverMenu } from '../../../../components/popover-menu'
import { useTempStore } from '../../../../store/zustand/temp'
import { useOn } from '../../../../hooks/use-on.hook'
import { useGetCommonFilesTree } from '../../../../hooks/use-get-common-files-tree.hook'
import { useDebounceFn } from '../../../../hooks/use-debounce-fn.hook'
import { useTokenNum } from '../../../../hooks/use-token-num.hook'
import { getIconComponent } from '../../../../helpers/file-icons/utils'
import type { SvgComponent } from '../../../../types/common'
import { getGlobalConfig } from '../../../../helpers/global-config'
import { emitter } from '../../../../helpers/emitter'
import { FileTreeItemRightWrapper, FileTreeSidebarHighlight, FileTreeSidebarUnderSearchWrapper, FilterWrapper } from './file-tree.styles'

export interface FileTreeProps {
  rootPath: string
  reverseTreeUi?: boolean
}

export const FileTree: FC<FileTreeProps> = memo((props: FileTreeProps) => {
  const { rootPath, reverseTreeUi } = props

  const { t } = useTranslation()
  const {
    excludeFileExts,
    updateExcludeFileExts,
    updateExpendedFilePaths,
    checkedFilePaths,
    updateCheckedFilePaths,
    provideFileInfoToGptMap,
    updateProvideFileInfoToGptMap,
  } = useGlobalStore()

  const {
    filesTree,
    fullPathFileMap,
    updateFilesTree,
  } = useTempStore()

  const updateFileItem = useCallback((fileItemOrFullPath: FileSidebarTreeItem | string, updater: (fileItem: FileSidebarTreeItem) => void) => {
    const fullPath = typeof fileItemOrFullPath === 'string' ? fileItemOrFullPath : fileItemOrFullPath.otherInfo?.fullPath
    if (!fullPath)
      return

    const fileItem = fullPathFileMap[fullPath]
    if (!fileItem)
      return

    updater(fileItem)
    updateFilesTree([...filesTree])
  }, [filesTree])

  const { data: fetchCommonFilesTreeRes, isLoading, refetch: refreshFileTree } = useGetCommonFilesTree({
    rootPath,
  })

  const { checkedFilesContentPromptTokenNum } = useTokenNum()

  const openProvideCheckedFileContentsAsPrompt = useCallback(() => {
    if (provideFileInfoToGptMap.checkedFileContents)
      return

    updateProvideFileInfoToGptMap({
      checkedFileContents: true,
    })

    toast.success(t('chat_page.toast_selected_files_as_prompt_reopened'))
  }, [provideFileInfoToGptMap.checkedFileContents, updateProvideFileInfoToGptMap])

  const debounceOpenProvideCheckedFileContentsAsPrompt = useDebounceFn(openProvideCheckedFileContentsAsPrompt)

  useOn({
    eventName: [ClientEventName.RefreshTree, ClientEventName.RefreshFileTree],
    listener: () => refreshFileTree(),
    deps: [refreshFileTree],
  })

  // sync checked state
  useEffect(() => {
    if (!Object.values(fullPathFileMap).length || !filesTree.length)
      return

    // check all path in checkedFilePaths
    checkedFilePaths.forEach((fullPath) => {
      const file = fullPathFileMap[fullPath]

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

    // updateFileTree([...filesTree])
  }, [checkedFilePaths, filesTree])

  const renderTreeItemLeftSlot = useCallback((props: TreeItemState<FileInfoSidebarTreeItem>) => {
    const { isLeaf, isExpanded, otherInfo, children } = props

    if (otherInfo)
      (otherInfo as any).getIsSomeChildrenIsChecked = () => children?.some(child => child.otherInfo?.checked || (child?.otherInfo as any)?.getIsSomeChildrenIsChecked?.())

    const isSomeChildrenIsChecked = (otherInfo as any)?.getIsSomeChildrenIsChecked?.()

    const renderMaterialIconComponent: SvgComponent = (props) => {
      const MaterialSvgComponent = getIconComponent({
        isFolder: !isLeaf,
        isOpen: isExpanded,
        name: otherInfo?.name || '',
      })

      if (!MaterialSvgComponent)
        return null

      return <MaterialSvgComponent {...props} />
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
        const isLeaf = fullPathFileMap[fullPath].isLeaf
        const children = fullPathFileMap[fullPath]?.children || []

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

      debounceOpenProvideCheckedFileContentsAsPrompt()
    }

    return <>
      <VSCodeCheckbox
        style={{
          marginRight: '0.25rem',
        }}
        onClick={(e) => {
          handleCheckedChange(!otherInfo?.checked)
          e.stopPropagation()
          return false
        }}

        checked={otherInfo?.checked ? true : undefined}
        indeterminate={isSomeChildrenIsChecked && !otherInfo?.checked ? true : undefined}
      ></VSCodeCheckbox>

      {!isLeaf && <Icon style={{
        marginRight: '0.25rem',
      }} className={clsx(isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right')}></Icon >}

      {renderMaterialIconComponent({
        style: {
          marginLeft: '0.2rem',
          marginRight: '0.45rem',
          width: '1rem',
          height: '1rem',
          flexShrink: '0',
        },
      })}
    </>
  }, [updateFileItem, updateCheckedFilePaths])

  const renderTreeItemRightSlot = useCallback((props: TreeItemState<FileInfoSidebarTreeItem>) => {
    const { otherInfo } = props

    if (!otherInfo)
      return null

    return <FileTreeItemRightWrapper>
      {formatNumWithK(otherInfo.tokenNum)}

      {/* beautiful but too long */}
      {/* <Icon
        style={{
          marginLeft: '0.25rem',
          fontSize: '1.2rem',
        }}
        className='codicon-symbol-string'
      ></Icon > */}
    </FileTreeItemRightWrapper>
  }, [])

  const handleExpandChange = useCallback((props: TreeItemState<FileInfoSidebarTreeItem>) => {
    const { isExpanded, otherInfo } = props
    const fullPath = otherInfo?.fullPath

    if (!fullPath)
      return

    const file = fullPathFileMap[fullPath]
    file.isExpanded = isExpanded

    updateExpendedFilePaths((preState) => {
      const finalPaths = isExpanded ? [...preState, fullPath] : preState.filter(item => item !== fullPath)
      return finalPaths
    })

    updateFilesTree([...filesTree])
  }, [filesTree])

  const handleTreeItemClick = useCallback((props: TreeItemState<FileInfoSidebarTreeItem>) => {
    const { otherInfo, isLeaf } = props
    const { fullPath } = otherInfo || {}

    if (!fullPath || !isLeaf)
      return

    if (getGlobalConfig().editFileInIde) {
      emitter.emit(ClientEventName.OpenFileInIde, {
        filePath: fullPath,
      })
    }
  }, [])

  const buildSearchRightSlot = useCallback(() => {
    const { allFileExts = [] } = fetchCommonFilesTreeRes?.data || {}

    const handleExtCheckedChange = (ext: string, checked: boolean) => {
      updateExcludeFileExts((preState) => {
        if (checked)
          return preState.filter(item => item !== ext)

        return [...preState, ext]
      })
    }

    return <>
      <PopoverMenu
        yPosition={reverseTreeUi ? 'top' : 'bottom'}
        clickMode
        zIndex={999}
        menuMaskStyle={{
          marginLeft: '1rem',
          marginRight: '1rem',
        }}
        menuStyle={{
          height: 'auto',
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
              height: '100%',
            }}
          ></IconButton>
        }}
        buildMenuSlot={() => {
          return <FilterWrapper>
            {allFileExts.map((ext) => {
              const checked = !excludeFileExts.includes(ext)

              return <VSCodeCheckbox
                key={ext}
                checked={checked}
                onClick={(e) => {
                  handleExtCheckedChange(ext, !checked)

                  e.stopPropagation()
                  return false
                }}>{ext}</VSCodeCheckbox>
            })}
          </FilterWrapper>
        }}
      />

      <IconButton
        style={{
          height: '100%',
        }}
        text={t('chat_page.refresh_btn')}
        showText={false}
        iconClassName='codicon-refresh'
        animatingWhenClick
        onClick={() => refreshFileTree()}
      ></IconButton>
    </>
  }, [fetchCommonFilesTreeRes, excludeFileExts, updateExcludeFileExts])

  const buildUnderSearchSlot = useCallback(() => {
    const resetAllChecked = () => {
      updateCheckedFilePaths((preState) => {
        preState.forEach((item) => {
          const file = fullPathFileMap[item]
          file.otherInfo!.checked = false
          return item
        })

        updateFilesTree([...filesTree])

        return []
      })
    }

    return <FileTreeSidebarUnderSearchWrapper>
      <Trans
        t={t}
        i18nKey={'chat_page.file_tree_top_tokens_tips'}
        values={{
          fileNum: checkedFilePaths.length,
          tokenNum: formatNumWithK(checkedFilesContentPromptTokenNum),
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
    </FileTreeSidebarUnderSearchWrapper>
  }, [checkedFilePaths, checkedFilesContentPromptTokenNum, filesTree, fullPathFileMap])

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
    reverseTreeUi,
    tree: {
      items: filesTree,
      renderTreeItemLeftSlot,
      renderTreeItemRightSlot,
      onTreeItemCollapse: handleExpandChange,
      onTreeItemExpand: handleExpandChange,
      onTreeItemClick: handleTreeItemClick,
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
