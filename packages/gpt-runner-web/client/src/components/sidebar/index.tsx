import { useEffect, useState } from 'react'
import { travelTreeDeepFirst } from '@nicepkg/gpt-runner-shared/common'
import { useDebounce } from 'react-use'
import type { TreeProps } from '../tree'
import { Tree } from '../tree'
import type { TreeItemBaseStateOtherInfo, TreeItemProps } from '../tree-item'
import { SidebarHeader, SidebarSearch, SidebarSearchRightWrapper, SidebarSearchWrapper, SidebarTreeWrapper, SidebarWrapper } from './sidebar.styles'

export interface SidebarProps<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo> {
  defaultSearchKeyword?: string
  placeholder?: string
  tree?: Omit<TreeProps<OtherInfo>, 'filter'>
  buildTreeItem?: (item: TreeItemProps<OtherInfo>) => TreeItemProps<OtherInfo>
  sortTreeItems?: (items: TreeItemProps<OtherInfo>[]) => TreeItemProps<OtherInfo>[]
  buildTopToolbarSlot?: () => React.ReactNode
  buildSearchRightSlot?: () => React.ReactNode
}

export function Sidebar<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo>(props: SidebarProps<OtherInfo>) {
  const {
    defaultSearchKeyword = '',
    placeholder,
    tree,
    buildTreeItem,
    sortTreeItems,
    buildTopToolbarSlot,
    buildSearchRightSlot,
  } = props

  const [searchKeyword, setSearchKeyword] = useState(defaultSearchKeyword)
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState(defaultSearchKeyword)
  const [finalItems, setFinalItems] = useState<TreeItemProps<OtherInfo>[]>([])

  useDebounce(() => {
    setDebouncedSearchKeyword(searchKeyword)
  }, 300, [searchKeyword])

  useEffect(() => {
    let _finalItems: TreeItemProps<OtherInfo>[] = [...(tree?.items || [])]

    _finalItems = travelTreeDeepFirst(tree?.items || [], (item) => {
      if (buildTreeItem)
        item = buildTreeItem(item)

      if (debouncedSearchKeyword && !item.name?.match(new RegExp(debouncedSearchKeyword, 'i')) && !item.children?.length)
        return null

      const sortedChildren
        = sortTreeItems && item?.children
          ? sortTreeItems(item.children)
          : item.children?.sort((a, b) => {
            // 0-9 a-z A-Z
            const aName = a.name?.toLowerCase()
            const bName = b.name?.toLowerCase()

            return (aName < bName) ? -1 : (aName > bName) ? 1 : 0
          })

      const finalExpanded = debouncedSearchKeyword ? true : item.isExpanded

      return { ...item, isExpanded: finalExpanded, children: sortedChildren }
    })

    setFinalItems(_finalItems)
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
    <SidebarTreeWrapper>
      <Tree
        {...tree}
        items={finalItems}
      />
    </SidebarTreeWrapper>
  </SidebarWrapper>
}
