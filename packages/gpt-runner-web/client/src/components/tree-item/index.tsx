import { memo, useState } from 'react'
import type { Variants } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'
import { Children, IconWrapper, NameWrapper, TreeItemRow, TreeItemRowLeftSlot, TreeItemRowRightSlot, TreeItemWrapper } from './tree-item.styles'

export type TreeItemBaseStateOtherInfo = Record<string, any>
export interface TreeItemBaseState<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo> {
  id: string
  name: string
  path: string
  isLeaf: boolean
  children?: TreeItemProps<OtherInfo>[]
  isExpanded?: boolean
  otherInfo?: OtherInfo
}

export interface TreeItemState<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo> extends TreeItemBaseState<OtherInfo> {
  isHovering: boolean
  isFocused?: boolean
}

export interface TreeItemProps<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo> extends TreeItemBaseState<OtherInfo> {
  isFocused?: boolean
  renderLeftSlot?: (props: TreeItemState<OtherInfo>) => React.ReactNode
  renderRightSlot?: (props: TreeItemState<OtherInfo>) => React.ReactNode
  onExpand?: (props: TreeItemState<OtherInfo>) => void
  onCollapse?: (props: TreeItemState<OtherInfo>) => void
  onClick?: (props: TreeItemState<OtherInfo>) => void | boolean
  onContextMenu?: (props: TreeItemState<OtherInfo>) => void
}

function TreeItem_<OtherInfo extends TreeItemBaseStateOtherInfo = TreeItemBaseStateOtherInfo>(props: TreeItemProps<OtherInfo>) {
  const { renderLeftSlot, renderRightSlot, onExpand, onCollapse, onClick, onContextMenu, ...baseStateProps } = props
  const {
    name,
    isLeaf,
    children,
    isFocused = false,
    isExpanded = false,
  } = baseStateProps
  const [isHovering, setIsHovering] = useState(false)

  const stateProps = { ...baseStateProps, isHovering, isExpanded }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    onContextMenu?.(stateProps)
  }

  const handleClick = () => {
    const isStop = onClick?.(stateProps)

    if (isStop === false)
      return

    if (!isLeaf) {
      if (isExpanded)
        onCollapse?.({ ...stateProps, isExpanded: false })

      else
        onExpand?.({ ...stateProps, isExpanded: true })
    }
  }

  const contentVariants: Variants = {
    expanded: { opacity: 1, height: 'auto' },
    collapsed: { opacity: 1, height: 0 },
  }

  return (
    <TreeItemWrapper>
      <TreeItemRow
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        $isFocused={isFocused}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        title={name}
      >
        <TreeItemRowLeftSlot>
          <IconWrapper>
            {renderLeftSlot?.(stateProps)}
          </IconWrapper>
          <NameWrapper >
            {name}
          </NameWrapper>
        </TreeItemRowLeftSlot>
        <TreeItemRowRightSlot onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          {renderRightSlot?.(stateProps)}
        </TreeItemRowRightSlot>
      </TreeItemRow>

      {/* child nodes */}
      <AnimatePresence initial={false}>
        {!isLeaf && (
          <motion.div
            initial="collapsed"
            animate={isExpanded ? 'expanded' : 'collapsed'}
            exit="collapsed"
            variants={contentVariants}
            transition={{ duration: 0.1, ease: 'easeInOut' }}
            style={{
              overflow: 'hidden',
            }}
          >
            <Children className='tree-item__children'>
              {children?.map(child => (
                <TreeItem_ key={child.id} {...child} />
              ))}
            </Children>

          </motion.div>
        )}
      </AnimatePresence>

    </TreeItemWrapper>
  )
}

TreeItem_.displayName = 'TreeItem'

export const TreeItem = memo(TreeItem_) as typeof TreeItem_
