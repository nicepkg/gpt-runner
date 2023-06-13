// PopoverMenu.tsx
import React, { useLayoutEffect, useState } from 'react'
import { Popover } from 'react-tiny-popover'
import { useHover } from '../../hooks/use-hover.hook'
import { useSize } from '../../hooks/use-size.hook'
import { Children, ChildrenWrapper, Menu, MenuMask } from './popover-menu.styles'

export interface PopoverMenuChildrenState {
  isHovering: boolean
}

type YPosition = 'top' | 'bottom'
type XPosition = 'left' | 'right'

export interface PopoverMenuProps {
  xPosition?: XPosition
  yPosition?: YPosition
  menuStyle?: React.CSSProperties
  childrenStyle?: React.CSSProperties
  isPopoverOpen?: boolean
  childrenInMenuWhenOpen?: boolean
  onPopoverDisplayChange?: (isPopoverOpen: boolean) => void
  buildMenuSlot: () => React.ReactNode
  buildChildrenSlot: (state: PopoverMenuChildrenState) => React.ReactNode
}

export const PopoverMenu: React.FC<PopoverMenuProps> = (props) => {
  const {
    xPosition = 'right',
    yPosition = 'top',
    menuStyle,
    childrenStyle,
    isPopoverOpen,
    childrenInMenuWhenOpen = true,
    onPopoverDisplayChange,
    buildMenuSlot,
    buildChildrenSlot,
  } = props

  const [privateIsPopoverOpen, setPrivateIsPopoverOpen] = useState(false)
  const [childrenHoverRef, isChildrenHovering] = useHover()
  const [menuMaskHoverRef, isMenuMaskHovering] = useHover()
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

  useLayoutEffect(() => {
    const finalIsPopoverOpen = (isChildrenHovering || isMenuMaskHovering)

    if (childrenInMenuWhenOpen && !finalIsPopoverOpen)
      return

    getOnPopoverDisplayChange()(finalIsPopoverOpen)
  }, [isChildrenHovering, isMenuMaskHovering, menuMaskHoverRef.current])

  const xPositionMenuStyleMap: Record<XPosition, {
    menuMask?: React.CSSProperties
    menu?: React.CSSProperties
  }> = {
    left: {
    },
    right: {

    },
  }

  const yPositionMenuStyleMap: Record<YPosition, {
    menuMask?: React.CSSProperties
    menu?: React.CSSProperties
  }> = {
    top: {
      menuMask: {
        paddingBottom: childrenInMenuWhenOpen ? 0 : '1rem',
        marginBottom: childrenInMenuWhenOpen ? `${-childrenHeight}px` : '-2px',
      },
    },
    bottom: {
      menuMask: {
        paddingTop: childrenInMenuWhenOpen ? 0 : '1rem',
        marginTop: childrenInMenuWhenOpen ? `${-childrenHeight}px` : '-2px',
      },
    },
  }

  return (
    <Popover
      isOpen={getIsPopoverOpen()}
      positions={[xPosition, yPosition]}
      align='start'
      onClickOutside={handleClose}
      content={() => (
        <div>
          <MenuMask
            ref={menuMaskHoverRef}
            onMouseLeave={() => {
              if (!childrenInMenuWhenOpen)
                return

              handleClose()
            }}
            style={{
              ...xPositionMenuStyleMap[xPosition].menuMask,
              ...yPositionMenuStyleMap[yPosition].menuMask,
            }}
          >
            <Menu
              style={{
                ...xPositionMenuStyleMap[xPosition].menu,
                ...yPositionMenuStyleMap[yPosition].menu,
                ...menuStyle,
              }}
            >
              {yPosition === 'top' && buildMenuSlot()}

              {childrenInMenuWhenOpen
                ? <Children className='popover-menu__menu-children' style={{
                  width: '100%',
                  flex: 1,
                }}>
                  {buildChildrenSlot(childrenState)}
                </Children>
                : null}

              {yPosition === 'bottom' && buildMenuSlot()}
            </Menu>
          </MenuMask>
        </div>
      )}
    >
      <ChildrenWrapper>
        <Children
          ref={childrenHoverRef}
          style={{
            visibility: isPopoverOpen && childrenInMenuWhenOpen ? 'hidden' : 'visible',
            ...childrenStyle,
          }}
        >
          {buildChildrenSlot(childrenState)}
        </Children>
      </ChildrenWrapper>
    </Popover>
  )
}

PopoverMenu.displayName = 'PopoverMenu'
