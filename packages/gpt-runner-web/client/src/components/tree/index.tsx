import type { TreeItemBaseStateOtherInfo, TreeItemProps } from '../tree-item'
import { TreeItem } from '../tree-item'

export interface TreeProps<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo> {
  items: TreeItemProps<OtherInfo>[]
  onFileContextMenu?: TreeItemProps<OtherInfo>['onContextMenu']
  onFileClick?: TreeItemProps<OtherInfo>['onClick']
  onFileExpand?: TreeItemProps<OtherInfo>['onExpand']
  onFileCollapse?: TreeItemProps<OtherInfo>['onCollapse']
  renderItemLeftSlot?: TreeItemProps<OtherInfo>['renderLeftSlot']
  renderItemRightSlot?: TreeItemProps<OtherInfo>['renderRightSlot']
}

export function Tree<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo>(props: TreeProps<OtherInfo>) {
  const {
    items,
    onFileContextMenu,
    onFileClick,
    onFileExpand,
    onFileCollapse,
    renderItemLeftSlot,
    renderItemRightSlot,
  } = props

  const finalItems = items.map(file => ({
    ...file,
    renderLeftSlot(state) {
      return file.renderLeftSlot?.(state) || renderItemLeftSlot?.(state)
    },
    renderRightSlot(state) {
      return file.renderRightSlot?.(state) || renderItemRightSlot?.(state)
    },
    onContextMenu(state) {
      file.onContextMenu?.(state)
      onFileContextMenu?.(state)
    },
    onClick(state) {
      file.onClick?.(state)
      onFileClick?.(state)
    },
    onExpand(state) {
      file.onExpand?.(state)
      onFileExpand?.(state)
    },
    onCollapse(state) {
      file.onCollapse?.(state)
      onFileCollapse?.(state)
    },
  } as TreeItemProps<OtherInfo>))

  return (
    <div>
      {finalItems.map(file => (
        <TreeItem key={file.id} {...file} />
      ))}
    </div>
  )
}
