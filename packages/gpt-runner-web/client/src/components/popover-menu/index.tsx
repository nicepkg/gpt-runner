// PopoverMenu.tsx
import React, { useState } from 'react'
import { Popover } from 'react-tiny-popover'
import { useHover } from '../../hooks/use-hover.hook'
import { useSize } from '../../hooks/use-size.hook'
import { Children, ChildrenWrapper, Menu } from './popover-menu.styles'

export interface PopoverMenuChildrenState {
  isHovering: boolean
}
export interface PopoverMenuProps {
  isPopoverOpen?: boolean
  onPopoverDisplayChange?: (isPopoverOpen: boolean) => void
  buildMenuSlot: () => React.ReactNode
  buildChildrenSlot: (state: PopoverMenuChildrenState) => React.ReactNode
}

export const PopoverMenu: React.FC<PopoverMenuProps> = (props) => {
  const { isPopoverOpen, onPopoverDisplayChange, buildMenuSlot, buildChildrenSlot } = props
  const [privateIsPopoverOpen, setPrivateIsPopoverOpen] = useState(false)
  const [childrenHoverRef, isChildrenHovering] = useHover()
  const [, { height: childrenHeight }] = useSize({ ref: childrenHoverRef })
  const isProvideOpenAndChange = isPopoverOpen !== undefined && onPopoverDisplayChange !== undefined

  const getIsPopoverOpen = () => {
    return isProvideOpenAndChange ? isPopoverOpen : privateIsPopoverOpen
  }

  const getOnPopoverDisplayChange = () => {
    return isProvideOpenAndChange ? onPopoverDisplayChange : setPrivateIsPopoverOpen
  }

  const childrenState: PopoverMenuChildrenState = {
    isHovering: isChildrenHovering || getIsPopoverOpen(),
  }

  const handleClose = () => {
    getOnPopoverDisplayChange()(false)
  }

  return (
    <Popover
      isOpen={getIsPopoverOpen()}
      positions={['bottom']}
      align='start'
      onClickOutside={handleClose}
      content={() => (
        <div>
          <Menu style={{
            marginTop: `${-childrenHeight}px`,
          }}
            onMouseLeave={handleClose}
          >
            <Children style={{
              width: '100%',
              flex: 1,
            }}>
              {buildChildrenSlot(childrenState)}
            </Children>
            {buildMenuSlot()}
          </Menu>
        </div>
      )}
    >
      <ChildrenWrapper>
        <Children
          ref={childrenHoverRef}
          style={{
            visibility: isPopoverOpen ? 'hidden' : 'visible',
          }}
          onMouseEnter={() => {
            getOnPopoverDisplayChange()(true)
          }}
        >
          {buildChildrenSlot(childrenState)}
        </Children>
      </ChildrenWrapper>
    </Popover>
  )
}

PopoverMenu.displayName = 'PopoverMenu'
