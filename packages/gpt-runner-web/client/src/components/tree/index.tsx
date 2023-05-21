import type { TreeItemProps } from '../tree-item'
import { TreeItem } from '../tree-item'

export interface TreeProps {
  items: TreeItemProps[]
  onFileContextMenu?: TreeItemProps['onContextMenu']
  onFileClick?: TreeItemProps['onClick']
  onFileExpand?: TreeItemProps['onExpand']
  onFileCollapse?: TreeItemProps['onCollapse']
  renderItemLeftSlot?: TreeItemProps['renderLeftSlot']
  renderItemRightSlot?: TreeItemProps['renderRightSlot']
}

export const Tree: React.FC<TreeProps> = (props) => {
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
  } as TreeItemProps))

  return (
    <div>
      {finalItems.map(file => (
        <TreeItem key={file.id} {...file} />
      ))}
    </div>
  )
}
