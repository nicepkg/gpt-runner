// PopoverMenu.tsx
import type { CSSProperties } from 'react'
import React, { memo, useEffect, useLayoutEffect, useState } from 'react'
import { Popover } from 'react-tiny-popover'
import { useTranslation } from 'react-i18next'
import { useWindowSize } from 'react-use'
import { useHoverByMouseLocation } from '../../hooks/use-hover.hook'
import { Icon } from '../icon'
import { useRect } from '../../hooks/use-rect.hook'
import { Children, ChildrenWrapper, Menu, MenuChildrenWrapper, MenuMask, Toolbar } from './popover-menu.styles'

export interface PopoverMenuChildrenState {
  isHovering: boolean
  isInMenu: boolean
  isOpen: boolean
}

type YPosition = 'top' | 'bottom'
type XPosition = 'left' | 'right' | 'center'

export interface PopoverMenuProps {
  xPosition?: XPosition
  yPosition?: YPosition
  minusHeightSpace?: number
  menuMaskStyle?: React.CSSProperties
  menuStyle?: React.CSSProperties
  childrenStyle?: React.CSSProperties
  isPopoverOpen?: boolean
  childrenInMenuWhenOpen?: boolean
  zIndex?: number
  clickOutSideToClose?: boolean
  showToolbar?: boolean
  clickMode?: boolean
  clickOutsideCapture?: boolean
  onPopoverDisplayChange?: (isPopoverOpen: boolean) => void
  buildMenuSlot: () => React.ReactNode
  buildChildrenSlot: (state: PopoverMenuChildrenState) => React.ReactNode
}

export const PopoverMenu: React.FC<PopoverMenuProps> = memo((props) => {
  const {
    xPosition = 'left',
    yPosition = 'top',
    minusHeightSpace = 24,
    menuMaskStyle,
    menuStyle,
    childrenStyle,
    isPopoverOpen,
    childrenInMenuWhenOpen = false,
    zIndex = 10,
    clickOutSideToClose = true,
    showToolbar,
    clickMode = false,
    clickOutsideCapture = true,
    onPopoverDisplayChange,
    buildMenuSlot,
    buildChildrenSlot,
  } = props

  const { t } = useTranslation()
  const [privateIsPopoverOpen, setPrivateIsPopoverOpen] = useState(false)
  const [childrenHoverRef, isChildrenHovering] = useHoverByMouseLocation()
  const [menuMaskHoverRef, isMenuMaskHovering] = useHoverByMouseLocation()
  const [keepOpen, setKeepOpen] = useState(false)
  const [, { width: childrenWidth, height: childrenHeight, x: childrenX, y: childrenY }] = useRect({ ref: childrenHoverRef })
  const isProvideOpenAndChange = isPopoverOpen !== undefined && onPopoverDisplayChange !== undefined
  const [isPin, setIsPin] = useState(false)
  const { width: windowWidth, height: windowHeight } = useWindowSize()

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
    isOpen: getIsPopoverOpen(),
  }

  const handleClose = () => {
    if (isPin)
      return
    getOnPopoverDisplayChange()(false)
  }

  const handleOpen = () => {
    getOnPopoverDisplayChange()(true)
  }

  const handleCloseClick = () => {
    setIsPin(false)
    getOnPopoverDisplayChange()(false)
  }

  const handlePinClick = () => {
    setIsPin(!isPin)
  }

  useLayoutEffect(() => {
    if (clickMode)
      return

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
      menu: {
        maxWidth: windowWidth,
        // width: childrenInMenuWhenOpen ? 'unset' : '100vw',
      },
    },
    right: {
      menu: {
        maxWidth: windowWidth,
        // width: childrenInMenuWhenOpen ? 'unset' : '100vw',
      },
    },
    center: {
      menu: {
        maxWidth: windowWidth,
        // width: childrenInMenuWhenOpen ? 'unset' : '100vw',
      },
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
      menu: {
        maxHeight: Math.min(childrenY, windowHeight) - minusHeightSpace,
        height: childrenInMenuWhenOpen ? 'unset' : '100vh',
      },
    },
    bottom: {
      menuMask: {
        paddingTop: childrenInMenuWhenOpen ? 0 : '1rem',
        marginTop: childrenInMenuWhenOpen ? `${-childrenHeight}px` : '-2px',
      },
      menu: {
        maxHeight: Math.min(windowHeight - childrenY - childrenHeight, windowHeight) - minusHeightSpace,
        height: childrenInMenuWhenOpen ? 'unset' : '100vh',
      },
    },
  }

  const renderToolbar = () => {
    const defaultShowToolbar = !childrenInMenuWhenOpen && !clickMode

    const toolbarStyle: CSSProperties = {
      flexDirection: xPosition === 'right' ? 'row-reverse' : 'row',
      borderBottomWidth: yPosition === 'top' ? '0px' : '1px',
      borderTopWidth: yPosition === 'bottom' ? '0px' : '1px',
    }

    const iconStyle: CSSProperties = {
      marginRight: xPosition === 'right' ? '0' : '0.5rem',
      marginLeft: xPosition === 'right' ? '0.25rem' : '0',
    }

    return (showToolbar ?? defaultShowToolbar) && <Toolbar style={toolbarStyle}>
      <Icon title={t('chat_page.close_btn')} className="codicon-close" style={iconStyle} onClick={handleCloseClick} />
      <Icon title={t('chat_page.pin_up_btn')} className={isPin ? 'codicon-pinned-dirty' : 'codicon-pinned'} onClick={handlePinClick} />
    </Toolbar>
  }

  return (
    <Popover
      isOpen={keepOpen}
      positions={[yPosition]}
      align={xPosition === 'center' ? 'center' : xPosition === 'left' ? 'start' : 'end'}
      onClickOutside={() => {
        clickOutSideToClose && handleClose()
      }}
      clickOutsideCapture={clickOutsideCapture}
      containerStyle={{
        zIndex: String(isPin ? zIndex + 10 : zIndex),
        display: getIsPopoverOpen() ? 'block' : 'none',
        maxWidth: '100vw',
        maxHeight: '100vh',
      }}

      content={() => (
        <div>
          <MenuMask
            ref={menuMaskHoverRef}
            onMouseLeave={() => {
              if (clickMode)
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
              onClick={(e: any) => {
                e.stopPropagation()
                return false
              }}
            >
              {yPosition === 'bottom' && renderToolbar()}

              <MenuChildrenWrapper>
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
              </MenuChildrenWrapper>

              {yPosition === 'top' && renderToolbar()}
            </Menu>
          </MenuMask>
        </div>
      )}
    >
      <ChildrenWrapper onClick={(e: any) => {
        e.stopPropagation()

        if (!clickMode)
          return false

        getIsPopoverOpen() ? handleClose() : handleOpen()

        if (!clickOutSideToClose)
          setIsPin(true)

        return false
      }}>
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
