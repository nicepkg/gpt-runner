import { useEffect, useState } from 'react'
import { travelTreeDeepFirst } from '@nicepkg/gpt-runner-shared/common'
import { useDebounce } from 'react-use'
import type { TreeProps } from '../tree'
import { Tree } from '../tree'
import type { TreeItemBaseStateOtherInfo, TreeItemProps } from '../tree-item'
import { LoadingView } from '../loading-view'
import { SidebarHeader, SidebarSearch, SidebarSearchRightWrapper, SidebarSearchWrapper, SidebarTreeWrapper, SidebarUnderSearchWrapper, SidebarWrapper } from './sidebar.styles'

export interface SidebarProps<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo> {
  defaultSearchKeyword?: string
  placeholder?: string
  loading?: boolean
  tree?: Omit<TreeProps<OtherInfo>, 'filter'>
  buildTreeItem?: (item: TreeItemProps<OtherInfo>) => TreeItemProps<OtherInfo>
  sortTreeItems?: (items: TreeItemProps<OtherInfo>[]) => TreeItemProps<OtherInfo>[]
  buildTopToolbarSlot?: () => React.ReactNode
  buildSearchRightSlot?: () => React.ReactNode
  buildUnderSearchSlot?: () => React.ReactNode
}

export function Sidebar<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo>(props: SidebarProps<OtherInfo>) {
  const {
    defaultSearchKeyword = '',
    placeholder,
    loading,
    tree,
    buildTreeItem,
    sortTreeItems,
    buildTopToolbarSlot,
    buildSearchRightSlot,
    buildUnderSearchSlot,
  } = props

  const [searchKeyword, setSearchKeyword] = useState(defaultSearchKeyword)
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState(defaultSearchKeyword)
  const [finalItems, setFinalItems] = useState<TreeItemProps<OtherInfo>[]>([])

  useDebounce(() => {
    setDebouncedSearchKeyword(searchKeyword)
  }, 300, [searchKeyword])

  useEffect(() => {
    const sortItems = (items: TreeItemProps<OtherInfo>[] = []) => {
      const sortedChildren
        = sortTreeItems && items
          ? sortTreeItems(items)
          : items?.sort((a, b) => {
            if (a.isLeaf === b.isLeaf)
              return a.name.localeCompare(b.name)

            return a.isLeaf ? 1 : -1
          })
      return sortedChildren
    }

    let _finalItems: TreeItemProps<OtherInfo>[] = [...(tree?.items || [])]

    _finalItems = travelTreeDeepFirst(tree?.items || [], (item) => {
      if (buildTreeItem)
        item = buildTreeItem(item)

      if (debouncedSearchKeyword && !item.name?.match(new RegExp(debouncedSearchKeyword, 'i')) && !item.children?.length)
        return null

      const sortedChildren = sortItems(item.children)

      const finalExpanded = debouncedSearchKeyword ? true : item.isExpanded

      return { ...item, isExpanded: finalExpanded, children: sortedChildren }
    })

    setFinalItems(sortItems(_finalItems))
  }, [buildTreeItem, sortTreeItems, debouncedSearchKeyword, tree?.items])

  return <SidebarWrapper>
    <SidebarHeader>
      {buildTopToolbarSlot?.()}
    </SidebarHeader>
    <SidebarSearchWrapper>
      <SidebarSearch
        placeholder={placeholder}
        value={searchKeyword}
        onInput={(e: any) => {
          setSearchKeyword(e.target?.value)
        }}>
      </SidebarSearch>
      <SidebarSearchRightWrapper>
        {buildSearchRightSlot?.()}
      </SidebarSearchRightWrapper>
    </SidebarSearchWrapper>
    <SidebarUnderSearchWrapper>
      {buildUnderSearchSlot?.()}
    </SidebarUnderSearchWrapper>
    <SidebarTreeWrapper>
      {loading && <LoadingView absolute></LoadingView>}
      <Tree
        {...tree}
        items={finalItems}
      />
    </SidebarTreeWrapper>
  </SidebarWrapper>
}
