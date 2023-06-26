// PopoverMenu.tsx
import React, { memo, useEffect, useLayoutEffect, useState } from 'react'
import { Popover } from 'react-tiny-popover'
import { useTranslation } from 'react-i18next'
import { useHoverByMouseLocation } from '../../hooks/use-hover.hook'
import { useSize } from '../../hooks/use-size.hook'
import { Icon } from '../icon'
import { Children, ChildrenWrapper, Menu, MenuMask, PinBar } from './popover-menu.styles'

export interface PopoverMenuChildrenState {
  isHovering: boolean
  isInMenu: boolean
}

type YPosition = 'top' | 'bottom'
type XPosition = 'left' | 'right' | 'center'

export interface PopoverMenuProps {
  xPosition?: XPosition
  yPosition?: YPosition
  menuMaskStyle?: React.CSSProperties
  menuStyle?: React.CSSProperties
  childrenStyle?: React.CSSProperties
  isPopoverOpen?: boolean
  childrenInMenuWhenOpen?: boolean
  zIndex?: number
  clickOutSideToClose?: boolean
  allowPin?: boolean
  onPopoverDisplayChange?: (isPopoverOpen: boolean) => void
  buildMenuSlot: () => React.ReactNode
  buildChildrenSlot: (state: PopoverMenuChildrenState) => React.ReactNode
}

export const PopoverMenu: React.FC<PopoverMenuProps> = memo((props) => {
  const {
    xPosition = 'left',
    yPosition = 'top',
    menuMaskStyle,
    menuStyle,
    childrenStyle,
    isPopoverOpen,
    childrenInMenuWhenOpen = false,
    zIndex = 1,
    clickOutSideToClose = true,
    allowPin,
    onPopoverDisplayChange,
    buildMenuSlot,
    buildChildrenSlot,
  } = props

  const { t } = useTranslation()
  const [privateIsPopoverOpen, setPrivateIsPopoverOpen] = useState(false)
  const [childrenHoverRef, isChildrenHovering] = useHoverByMouseLocation()
  const [menuMaskHoverRef, isMenuMaskHovering] = useHoverByMouseLocation()
  const [keepOpen, setKeepOpen] = useState(false)
  const [, { height: childrenHeight }] = useSize({ ref: childrenHoverRef })
  const isProvideOpenAndChange = isPopoverOpen !== undefined && onPopoverDisplayChange !== undefined
  const [isPin, setIsPin] = useState(false)

  const getIsPopoverOpen = () => {
    return isProvideOpenAndChange ? isPopoverOpen : privateIsPopoverOpen
  }

  const getOnPopoverDisplayChange = () => {
    return isProvideOpenAndChange ? onPopoverDisplayChange : setPrivateIsPopoverOpen
  }

  useEffect(() => {
    if (!getIsPopoverOpen())
      return

    setKeepOpen(true)
  }, [getIsPopoverOpen()])

  const childrenState: PopoverMenuChildrenState = {
    isHovering: isChildrenHovering || getIsPopoverOpen(),
    isInMenu: false,
  }

  const handleClose = () => {
    if (isPin)
      return
    getOnPopoverDisplayChange()(false)
  }

  const handleOpen = () => {
    getOnPopoverDisplayChange()(true)
  }

  const handlePinClick = () => {
    setIsPin(!isPin)
  }

  useLayoutEffect(() => {
    const finalIsPopoverOpen = (isChildrenHovering || isMenuMaskHovering)

    if (childrenInMenuWhenOpen && !finalIsPopoverOpen)
      return

    finalIsPopoverOpen ? handleOpen() : handleClose()
  }, [isChildrenHovering, isMenuMaskHovering])

  const xPositionMenuStyleMap: Record<XPosition, {
    menuMask?: React.CSSProperties
    menu?: React.CSSProperties
  }> = {
    left: {
    },
    center: {
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
      isOpen={keepOpen}
      positions={[yPosition]}
      align={xPosition === 'center' ? 'center' : xPosition === 'left' ? 'start' : 'end'}
      onClickOutside={() => {
        clickOutSideToClose && handleClose()
      }}
      containerStyle={{
        zIndex: String(zIndex),
        display: getIsPopoverOpen() ? 'block' : 'none',
      }}

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
              ...menuMaskStyle,
            }}
          >
            <Menu
              style={{
                ...xPositionMenuStyleMap[xPosition].menu,
                ...yPositionMenuStyleMap[yPosition].menu,
                ...menuStyle,
              }}
            >
              {(allowPin ?? !childrenInMenuWhenOpen) && <PinBar>
                <Icon title={t('chat_page.pin_up_btn')} className={isPin ? 'codicon-pinned-dirty' : 'codicon-pinned'} onClick={handlePinClick} />
              </PinBar>}

              {yPosition === 'top' && buildMenuSlot()}

              {childrenInMenuWhenOpen
                ? <Children className='popover-menu__menu-children' style={{
                  width: '100%',
                  flex: 1,
                }}>
                  {buildChildrenSlot({ ...childrenState, isInMenu: true })}
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
})

PopoverMenu.displayName = 'PopoverMenu'
