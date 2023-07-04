import type { CSSProperties, FC } from 'react'
import { memo } from 'react'
import { TabList } from '../tab-list'

import {
  PanelTabContainer,
  PanelTabContent,
} from './panel-tab.styles'

export interface PanelProps {
  defaultActiveIndex?: number
  style?: CSSProperties
  tabStyle?: CSSProperties
  items?: any[]
  onChange?: (activeIndex: number) => void
}

export const PanelTab: FC<PanelProps> = memo(({
  defaultActiveIndex,
  style,
  tabStyle,
  items = [],
  onChange,
}) => {
  return (
    <PanelTabContainer style={style}>
      <PanelTabContent>
        <TabList
          tabList={items}
          defaultActiveIndex={defaultActiveIndex}
          style={tabStyle}
          onChange={onChange}
        />
      </PanelTabContent>
    </PanelTabContainer>
  )
})

PanelTab.displayName = 'PanelTab'
