import type { FC } from 'react'
import { IconWrapper, TopToolbarRightSlot, TopToolbarWrapper } from './top-toolbar.styles'

export interface TopToolbarProps {
  title: string
  actions: {
    icon: React.ReactNode
    onClick: () => void
  }[]
}
export const TopToolbar: FC<TopToolbarProps> = (props) => {
  const { title, actions } = props

  return <TopToolbarWrapper>
    <div>
      {title}
    </div>
    <TopToolbarRightSlot>
      {actions.map((action, index) => (
        <IconWrapper key={index} onClick={action.onClick}>
          {action.icon}
        </IconWrapper>
      ))}
    </TopToolbarRightSlot>
  </TopToolbarWrapper>
}
