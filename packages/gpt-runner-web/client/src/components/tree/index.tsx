import { useEffect, useState } from 'react'
import { travelTree } from '@nicepkg/gpt-runner-shared/common'
import type { TreeItemBaseStateOtherInfo, TreeItemProps } from '../tree-item'
import { TreeItem } from '../tree-item'

export interface TreeProps<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo> {
  items: TreeItemProps<OtherInfo>[]
  buildTreeItem?: (item: TreeItemProps<OtherInfo>) => TreeItemProps<OtherInfo>
  onTreeItemContextMenu?: TreeItemProps<OtherInfo>['onContextMenu']
  onTreeItemClick?: TreeItemProps<OtherInfo>['onClick']
  onTreeItemExpand?: TreeItemProps<OtherInfo>['onExpand']
  onTreeItemCollapse?: TreeItemProps<OtherInfo>['onCollapse']
  renderTreeItemLeftSlot?: TreeItemProps<OtherInfo>['renderLeftSlot']
  renderTreeItemRightSlot?: TreeItemProps<OtherInfo>['renderRightSlot']
}

export function Tree<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo>(props: TreeProps<OtherInfo>) {
  const {
    items,
    buildTreeItem,
    onTreeItemContextMenu,
    onTreeItemClick,
    onTreeItemExpand,
    onTreeItemCollapse,
    renderTreeItemLeftSlot,
    renderTreeItemRightSlot,
  } = props

  const [finalItems, setFinalItems] = useState<TreeItemProps<OtherInfo>[]>([])

  useEffect(() => {
    const _finalItems = travelTree(items, (item) => {
      if (buildTreeItem)
        item = buildTreeItem(item)

      return {
        ...item,
        renderLeftSlot(state) {
          return item.renderLeftSlot?.(state) || renderTreeItemLeftSlot?.(state)
        },
        renderRightSlot(state) {
          return item.renderRightSlot?.(state) || renderTreeItemRightSlot?.(state)
        },
        onContextMenu(state) {
          item.onContextMenu?.(state)
          onTreeItemContextMenu?.(state)
        },
        onClick(state) {
          item.onClick?.(state)
          onTreeItemClick?.(state)
        },
        onExpand(state) {
          item.onExpand?.(state)
          onTreeItemExpand?.(state)
        },
        onCollapse(state) {
          item.onCollapse?.(state)
          onTreeItemCollapse?.(state)
        },
      } as TreeItemProps<OtherInfo>
    })
    setFinalItems(_finalItems)
  }, [items, buildTreeItem, onTreeItemContextMenu, onTreeItemClick, onTreeItemExpand, onTreeItemCollapse, renderTreeItemLeftSlot, renderTreeItemRightSlot])

  return (
    <div>
      {finalItems.map(item => (
        <TreeItem key={item.id} {...item} />
      ))}
    </div>
  )
}
