import { useState } from 'react'
import type { Variants } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'
import { Children, IconWrapper, NameWrapper, TreeItemRow, TreeItemRowLeftSlot, TreeItemRowRightSlot, TreeItemWrapper } from './tree-item.styles'

export interface TreeItemBaseState {
  id: string
  name: string
  path: string
  isLeaf: boolean
  children?: TreeItemProps[]
  isFocused?: boolean
}

export interface TreeItemState extends TreeItemBaseState {
  isHovering: boolean
  isExpanded: boolean
}

export interface TreeItemProps extends TreeItemBaseState {
  defaultIsExpanded?: boolean
  renderLeftSlot?: (props: TreeItemState) => React.ReactNode
  renderRightSlot?: (props: TreeItemState) => React.ReactNode
  onExpand?: (props: TreeItemState) => void
  onCollapse?: (props: TreeItemState) => void
  onClick?: (props: TreeItemState) => void
  onContextMenu?: (props: TreeItemState) => void
}

export const TreeItem: React.FC<TreeItemProps> = (props) => {
  const { renderLeftSlot, renderRightSlot, onExpand, onCollapse, onClick, onContextMenu, ...baseStateProps } = props
  const {
    name,
    isLeaf,
    children,
    defaultIsExpanded = false,
    isFocused = false,
  } = baseStateProps
  const [isHovering, setIsHovering] = useState(false)
  const [isExpanded, setIsExpanded] = useState(defaultIsExpanded)

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
    setIsExpanded(!isExpanded)
    if (!isLeaf) {
      if (isExpanded)
        onCollapse?.(stateProps)

      else
        onExpand?.(stateProps)
    }
    else {
      onClick?.(stateProps)
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
      >
        <TreeItemRowLeftSlot>
          <IconWrapper>
            {renderLeftSlot?.(stateProps)}
          </IconWrapper>
          <NameWrapper>
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
            <Children >
              {children?.map(child => (
                <TreeItem key={child.id} {...child} />
              ))}
            </Children>

          </motion.div>
        )}
      </AnimatePresence>

    </TreeItemWrapper>
  )
}
