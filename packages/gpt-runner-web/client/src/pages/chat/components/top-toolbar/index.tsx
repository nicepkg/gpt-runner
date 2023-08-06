import { forwardRef, memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { PopoverMenuProps } from '../../../../components/popover-menu'
import { PopoverMenu } from '../../../../components/popover-menu'
import { IconButton } from '../../../../components/icon-button'
import { ChatPanelPopoverTreeWrapper } from '../chat-panel/chat-panel.styles'
import { useIsMobile } from '../../../../hooks/use-is-mobile.hook'
import type { UseTokenNumProps } from '../../../../hooks/use-token-num.hook'
import { useTokenNum } from '../../../../hooks/use-token-num.hook'
import { formatNumWithK } from '../../../../helpers/utils'
import { useTempStore } from '../../../../store/zustand/temp'
import { TopToolbarBlank, TopToolbarLeft, TopToolbarRight, TopToolbarWrapper } from './top-toolbar.styles'

export interface TopToolbarProps extends UseTokenNumProps {
  settingsView?: React.ReactNode
  configInfoView?: React.ReactNode
  aboutView?: React.ReactNode
  rightSlot?: React.ReactNode
}

export const TopToolbar = memo(forwardRef<HTMLDivElement, TopToolbarProps>((props, ref) => {
  const { settingsView, configInfoView, aboutView, rightSlot, ...useTokenNumProps } = props

  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { totalTokenNum } = useTokenNum(useTokenNumProps)
  const { updateCurrentAppConfig } = useTempStore()

  const menus: {
    text: string
    alwaysShowText?: boolean
    iconClassName: string
    menuView?: React.ReactNode
    menuProps?: PopoverMenuProps
    onClick?: () => void
  }[] = [{
    text: t('chat_page.settings_btn'),
    alwaysShowText: true,
    iconClassName: 'codicon-gear',
    menuView: settingsView,
  }, {
    text: t('chat_page.settings_tab_config_info'),
    alwaysShowText: !isMobile,
    iconClassName: 'codicon-gist',
    menuView: configInfoView,
  }, {
    text: t('chat_page.settings_tab_about'),
    alwaysShowText: !isMobile,
    iconClassName: 'codicon-info',
    menuView: aboutView,
  }, {
    text: t('chat_page.settings_tab_notifications'),
    alwaysShowText: !isMobile,
    iconClassName: 'codicon-bell',
    onClick() {
      updateCurrentAppConfig({
        showNotificationModal: true,
      })
    },
  }]

  return <>
    <TopToolbarWrapper ref={ref}>
      <TopToolbarLeft>
        {menus.map((popMenu, index) => {
          const { text, alwaysShowText, iconClassName, menuView, menuProps } = popMenu

          return <PopoverMenu
            key={index}
            clickMode
            xPosition='center'
            yPosition='bottom'
            menuMaskStyle={{
              marginLeft: '0',
              marginRight: '0',
              paddingTop: '0.5rem',
            }}
            menuStyle={{
              border: isMobile ? 'none' : '',
              width: isMobile ? '100vw' : '',
            }}
            minusHeightSpace={isMobile ? 10 : 100}
            buildChildrenSlot={({ isHovering }) => {
              return <IconButton
                text={text}
                iconClassName={iconClassName}
                hoverShowText={!alwaysShowText && !isHovering}
                transparentBgWhenNotHover
                style={{
                  paddingLeft: '0.5rem',
                }}
                onClick={(e: any) => {
                  if (popMenu.onClick) {
                    e.stopPropagation()
                    popMenu.onClick?.()
                  }
                }}
              ></IconButton>
            }}
            buildMenuSlot={() => {
              return <ChatPanelPopoverTreeWrapper>
                {menuView}
              </ChatPanelPopoverTreeWrapper>
            }}
            {...menuProps}
          />
        })}
      </TopToolbarLeft>

      <TopToolbarRight>
        {rightSlot}
        <div title="Tokens" style={{ marginRight: '0.5rem', marginLeft: '0.5rem' }}>
          {(isMobile ? '' : 'Tokens: ') + formatNumWithK(totalTokenNum)}
        </div>
      </TopToolbarRight>
    </TopToolbarWrapper>
    <TopToolbarBlank />
  </>
}))

TopToolbar.displayName = 'TopToolbar'
