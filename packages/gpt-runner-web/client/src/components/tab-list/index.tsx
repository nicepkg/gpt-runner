import type { CSSProperties, FC } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useElementSizeRealTime } from '../../hooks/use-element-size-real-time.hook'
import { Icon } from '../icon'
import {
  ActivedTabIndicator,
  MoreIcon,
  MoreList,
  MoreListItem,
  MoreWrapper,
  TabContainer,
  TabItem,
  TabItemWrapper,
  TabListHeader,
  TabListWrapper,
  TabView,
} from './tab-list.styles'

export interface TabItemData {
  label: string
  key: string | number
  children?: React.ReactNode
  visible?: boolean
}

export interface TabProps {
  defaultActiveIndex?: number
  tabList: TabItemData[]
  style?: CSSProperties
  onChange?: (activeIndex: number) => void
}

export const TabList: FC<TabProps> = ({
  defaultActiveIndex,
  tabList = [],
  onChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex || 0)
  const [indicatorWidth, setIndicatorWidth] = useState(0)
  const [indicatorLeft, setIndicatorLeft] = useState(0)
  const [showMore, setShowMore] = useState(false)
  const [moreList, setMoreList] = useState<TabItemData[]>([])
  const [showMoreList, setShowMoreList] = useState(false)
  const [tabRef, tabSize] = useElementSizeRealTime<HTMLDivElement>()

  const handleTabItemClick = useCallback((index: number) => {
    setActiveIndex(index)
    setShowMoreList(false)
  }, [setActiveIndex, setShowMoreList])

  const calcTabsWidth = useCallback(() => {
    if (!tabRef.current)
      return 0

    const labelElements = tabRef.current
      .children as HTMLCollectionOf<HTMLElement>
    const tabsWidth = Array.from(labelElements).reduce((acc, cur) => {
      return acc + cur.offsetWidth
    }, 0)
    return tabsWidth
  }, [tabRef.current])

  const updateIndicatorPosition = useCallback(() => {
    if (tabRef.current) {
      const labelElements = tabRef.current
        .children as HTMLCollectionOf<HTMLElement>
      setIndicatorWidth(labelElements[activeIndex].offsetWidth)
      setIndicatorLeft(labelElements[activeIndex].offsetLeft)
      labelElements[activeIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [activeIndex, tabRef.current, setIndicatorWidth, setIndicatorLeft])

  const createIntersectionObserver = (root: HTMLDivElement, observerNode: HTMLDivElement) => {
    const options = {
      root,
      rootMargin: '0px',
      threshold: 0.3,
    }
    const observer = new IntersectionObserver((entries) => {
      entries?.forEach((entry) => {
        entry.target.setAttribute('data-visible', entry.intersectionRatio > 0.6 ? 'true' : 'false')
      })
    }, options)

    observerNode && observer.observe(observerNode)
  }

  const handleVisibleTabItem = useCallback(() => {
    if (!tabRef.current)
      return
    const tabListItems = Array.from(tabRef.current?.children as HTMLCollectionOf<HTMLElement>)
    tabListItems?.forEach((item) => {
      createIntersectionObserver(tabRef.current as HTMLDivElement, item as HTMLDivElement)
    })
    const _moreList: TabItemData[] = []
    Array.from(tabRef.current?.children).forEach((item, index) => {
      const isVisible = item.getAttribute('data-visible') === 'true'
      const { label = '', key = '' } = tabList?.[index] || {}
      _moreList.push({
        label,
        key,
        visible: isVisible,
      })
    })
    setMoreList(_moreList)
  }, [tabRef.current, tabList])

  useEffect(() => {
    setActiveIndex(defaultActiveIndex || 0)

    window.addEventListener('resize', updateIndicatorPosition)
    tabRef.current?.addEventListener('scroll', handleVisibleTabItem)
    return () => {
      window.removeEventListener('resize', updateIndicatorPosition)
      tabRef.current?.removeEventListener('scroll', handleVisibleTabItem)
    }
  }, [defaultActiveIndex])

  useEffect(() => {
    updateIndicatorPosition()
  }, [defaultActiveIndex, updateIndicatorPosition, tabRef.current, setActiveIndex])

  useEffect(() => {
    onChange?.(activeIndex)
  }, [activeIndex, onChange])

  useEffect(() => {
    const tabsTotalWidth = calcTabsWidth()
    setShowMore(tabsTotalWidth > tabSize.width)
    handleVisibleTabItem()
  }, [calcTabsWidth, setShowMore, handleVisibleTabItem, tabSize.width])

  return (
    <TabContainer>
      <TabListHeader $showMore={showMore}>
        <TabListWrapper ref={tabRef} $showMore={showMore}>
          {tabList.map((item, index) => (
            <div key={index} data-index={index}>
              <TabItemWrapper onClick={() => handleTabItemClick(index)}>
                <TabItem
                  className={activeIndex === index ? 'active' : ''}
                  tabIndex={activeIndex === index ? 0 : -1}
                >
                  {item.label}
                </TabItem>
              </TabItemWrapper>
            </div>
          ))}

          <ActivedTabIndicator
            left={indicatorLeft}
            width={indicatorWidth}
          />
        </TabListWrapper>

        {showMore && (
          <MoreWrapper>
            <MoreIcon onClick={() => setShowMoreList(!showMoreList)}>
              <Icon className="codicon-more" />
            </MoreIcon>
            {showMoreList && (
              <MoreList>
                {moreList.map((item, index) => (
                  !item.visible && <MoreListItem key={index} onClick={() => handleTabItemClick(index)}>
                    {item.label}
                  </MoreListItem>
                ))}
              </MoreList>
            )}
          </MoreWrapper>
        )}
      </TabListHeader>

      <TabView>
        {tabList[activeIndex]?.children}
      </TabView>
    </TabContainer>
  )
}

TabList.displayName = 'TabList'
