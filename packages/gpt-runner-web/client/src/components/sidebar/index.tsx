import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react'
import clsx from 'clsx'
import type { TreeProps } from '../tree'
import { Tree } from '../tree'
import type { TopToolbarProps } from '../top-toolbar'
import { TopToolbar } from '../top-toolbar'
import { Icon } from '../icon'
import type { TreeItemBaseState, TreeItemProps, TreeItemState } from '../tree-item'
import { SidebarWrapper } from './sidebar.styles'

export interface SidebarProps {
  defaultSearchKeyword?: string
  placeholder?: string
  topToolbar?: TopToolbarProps
  tree?: TreeProps
  onCreateChat: (props: TreeItemBaseState) => void
  onRenameChat: (props: TreeItemBaseState) => void
  onDeleteChat: (props: TreeItemBaseState) => void
}

export const Sidebar: FC<SidebarProps> = (props) => {
  const {
    defaultSearchKeyword = '',
    placeholder,
    tree,
    topToolbar,
  } = props

  const [searchKeyword, setSearchKeyword] = useState(defaultSearchKeyword)

  const renderTreeLeftSlot = useCallback((props: TreeItemState) => {
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
        marginRight: '4px',
      }} className={clsx(isExpanded ? 'codicon-chevron-down' : 'codicon-chevron-right')}></Icon >}

      <Icon style={{
        marginLeft: !isLeaf ? '0' : '10px',
        marginRight: '6px',
      }} className={getIconClassName()}></Icon>
    </>
  }, [])

  const renderTreeRightSlot = useCallback((props: TreeItemState) => {
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
  }, [])

  const filterTreeItems = tree?.items.filter(file => searchKeyword ? file.name.includes(searchKeyword) : true)

  const processTreeItem = useCallback((items: TreeItemProps[]): TreeItemProps[] => {
    return items.map((item) => {
      return {
        ...item,
        renderLeftSlot: renderTreeLeftSlot,
        renderRightSlot: renderTreeRightSlot,
        children: item.children ? processTreeItem(item.children) : undefined,
      }
    })
  }, [renderTreeLeftSlot])

  const finalTreeItems = filterTreeItems ? processTreeItem(filterTreeItems) : undefined

  return <SidebarWrapper>
    {topToolbar && <TopToolbar {...topToolbar} />}
    <VSCodeTextField placeholder={placeholder}
      value={searchKeyword}
      onChange={(e: any) => {
        setSearchKeyword(e.target?.value)
      }}>
      Text Field Label
    </VSCodeTextField>
    {finalTreeItems && <Tree {...tree} items={finalTreeItems} />}
  </SidebarWrapper>
}
