import type { FC } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { PopoverMenuProps } from '../../../../components/popover-menu'
import { PopoverMenu } from '../../../../components/popover-menu'
import { IconButton } from '../../../../components/icon-button'
import { ChatPanelPopoverTreeWrapper } from '../chat-panel/chat-panel.styles'
import { useIsMobile } from '../../../../hooks/use-is-mobile.hook'
import { TopToolbarBlank, TopToolbarWrapper } from './top-toolbar.styles'

export interface TopToolbarProps {
  settingsView?: React.ReactNode
  configInfoView?: React.ReactNode
  aboutView?: React.ReactNode
}

export const TopToolbar: FC<TopToolbarProps> = memo((props) => {
  const { settingsView, configInfoView, aboutView } = props

  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const popMenus: {
    text: string
    alwaysShowText?: boolean
    iconClassName: string
    menuView?: React.ReactNode
    menuProps?: PopoverMenuProps
  }[] = [{
    text: t('chat_page.settings_btn'),
    alwaysShowText: true,
    iconClassName: 'codicon-gear',
    menuView: settingsView,
  }, {
    text: t('chat_page.settings_tab_config_info'),
    iconClassName: 'codicon-gist',
    menuView: configInfoView,
  }, {
    text: t('chat_page.settings_tab_about'),
    iconClassName: 'codicon-info',
    menuView: aboutView,
  }]

  return <>
    <TopToolbarWrapper>
      {popMenus.map((popMenu, index) => {
        const { text, alwaysShowText, iconClassName, menuView, menuProps } = popMenu

        return <PopoverMenu
          key={index}
          xPosition='right'
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
          minusHeightSpace={10}
          buildChildrenSlot={() => {
            return <IconButton
              text={text}
              iconClassName={iconClassName}
              hoverShowText={!alwaysShowText}
              style={{
                paddingLeft: '0.5rem',
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
    </TopToolbarWrapper>
    <TopToolbarBlank />
  </>
})

TopToolbar.displayName = 'TopToolbar'
