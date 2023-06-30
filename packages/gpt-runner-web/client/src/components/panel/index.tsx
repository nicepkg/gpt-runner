import type { CSSProperties, FC } from 'react'

// import MoreIcon from '../../../public/img/more.png'
import { PanelContainer, PanelContent } from './panel.styles'
import 'rc-tabs/assets/index.css'

export interface Tab {
  label: string
  key: string
  children: React.ReactNode
}

export interface PanelProps {
  activeIdex?: string
  direction?: 'ltr' | 'rtl'
  style?: CSSProperties
  items?: Tab[]
  onChange?: (key: string) => void
}

export const Panel: FC<PanelProps> = ({
  activeIdex,
  style,
  items,
  onChange,
  ...otherProps
}) => {
  const handleOnChange = (key: string) => {
    console.log('key', key)
    onChange?.(key)
  }

  return (
    <PanelContainer style={style}>
      <PanelContent>

      </PanelContent>
    </PanelContainer>
  )
}
