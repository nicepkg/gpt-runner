import { useCallback, useState } from 'react'
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react'
import type { TreeProps } from '../tree'
import { Tree } from '../tree'
import type { TopToolbarProps } from '../top-toolbar'
import { TopToolbar } from '../top-toolbar'
import type { TreeItemBaseStateOtherInfo, TreeItemProps } from '../tree-item'
import { SidebarWrapper } from './sidebar.styles'

export interface SidebarProps<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo> {
  defaultSearchKeyword?: string
  placeholder?: string
  topToolbar?: TopToolbarProps
  tree?: TreeProps<OtherInfo>
  renderTreeLeftSlot?: TreeItemProps<OtherInfo>['renderLeftSlot']
  renderTreeRightSlot?: TreeItemProps<OtherInfo>['renderRightSlot']
}

export function Sidebar<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo>(props: SidebarProps<OtherInfo>) {
  const {
    defaultSearchKeyword = '',
    placeholder,
    tree,
    topToolbar,
    renderTreeLeftSlot,
    renderTreeRightSlot,
  } = props

  const [searchKeyword, setSearchKeyword] = useState(defaultSearchKeyword)

  const filterTreeItems = tree?.items.filter(file => searchKeyword ? file.name.includes(searchKeyword) : true)

  const processTreeItem = useCallback((items: TreeItemProps<OtherInfo>[]): TreeItemProps<OtherInfo>[] => {
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
