import type { CSSProperties, ReactNode } from 'react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMotionValue } from 'framer-motion'
import { useElementSizeRealTime } from '../../hooks/use-element-size-real-time.hook'
import { useDebounceFn } from '../../hooks/use-debounce-fn.hook'
import { isElementVisible } from '../../helpers/utils'
import {
  ActiveTabIndicator,
  MoreIconWrapper,
  MoreList,
  MoreListItem,
  MoreWrapper,
  StyledMoreIcon,
  TabContainer,
  TabItemLabel,
  TabItemWrapper,
  TabListHeader,
  TabListWrapper,
  TabView,
} from './tab.styles'

export interface TabItem<T extends string = string> {
  label: ReactNode
  id: T
  children?: ReactNode
}

export interface TabProps<T extends string = string> {
  defaultActiveId?: T
  activeId?: T
  items: TabItem<T>[]
  tabListStyles?: CSSProperties
  tabItemStyles?: CSSProperties
  onChange?: (activeTabId: T) => void
}

export function Tab_<T extends string = string>(props: TabProps<T>) {
  const {
    defaultActiveId,
    activeId: activeIdFromProp,
    items = [],
    tabListStyles,
    tabItemStyles,
    onChange: onChangeFromProp,
  } = props

  const DEFAULT_ACTIVE_ID = items?.[0]?.id
  const TAB_ID_ATTR = 'data-tab-id'
  const [activeIdFromPrivate, setActiveIdFromPrivate] = useState<T>()
  const [moreList, setMoreList] = useState<TabItem<T>[]>([])
  const [moreListVisible, setMoreListVisible] = useState(false)
  const [tabRef, tabSize] = useElementSizeRealTime<HTMLDivElement>()
  const showMore = moreList.length > 0

  // motion
  const indicatorWidth = useMotionValue(0)
  const indicatorLeft = useMotionValue(0)

  const activeId = useMemo(() => {
    return activeIdFromProp ?? activeIdFromPrivate ?? defaultActiveId ?? DEFAULT_ACTIVE_ID
  }, [activeIdFromProp, activeIdFromPrivate, defaultActiveId])

  const activeIdHistory = useRef<T[]>([])

  const setActiveId = useCallback((id: T) => {
    onChangeFromProp ? onChangeFromProp(id) : setActiveIdFromPrivate(id)
  }, [onChangeFromProp])

  const tabIdTabItemMap = useMemo(() => {
    const map = {} as Record<T, TabItem<T>>

    items.forEach((item) => {
      map[item.id] = item
    })
    return map
  }, [items])

  useEffect(() => {
    // if items change and the activeId is not in the new items, set the activeId to the previous activeId
    if (!tabIdTabItemMap[activeId]) {
      const validActiveId = activeIdHistory.current.reverse().find(id => Boolean(tabIdTabItemMap[id])) || items?.[0]?.id
      setActiveId(validActiveId)
    }
  }, [items, activeId, setActiveId, tabIdTabItemMap])

  useEffect(() => {
    // update activeIdHistory
    if (activeIdHistory.current[activeIdHistory.current.length - 1] !== activeId)
      activeIdHistory.current.push(activeId)
  }, [activeId])

  const getTabItemById = useCallback((id: T): TabItem<T> | undefined => {
    return tabIdTabItemMap[id]
  }, [tabIdTabItemMap])

  const getLabelDoms = useCallback(() => {
    return Array.from(tabRef.current?.querySelectorAll(`[${TAB_ID_ATTR}]`) || []) as HTMLElement[]
  }, [tabRef.current, items])

  const getActiveLabelDom = useCallback(() => {
    return tabRef.current?.querySelector<HTMLElement>(`[${TAB_ID_ATTR}="${activeId}"]`) ?? null
  }, [tabRef.current, activeId])

  const handleTabItemClick = useCallback((item: TabItem<T>) => {
    setActiveId(item.id)
    setMoreListVisible(false)
  }, [setActiveId, setMoreListVisible])

  useEffect(() => {
    const activeLabelDom = getActiveLabelDom()

    if (!activeLabelDom || !tabRef.current)
      return

    const scrollLeft = activeLabelDom.offsetLeft - (tabRef.current.offsetWidth / 2 - activeLabelDom.offsetWidth / 2)

    tabRef.current?.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    })
  }, [getActiveLabelDom, tabSize.width, tabRef.current, activeId])

  // let it scroll when mouse wheel on tab list
  const handleTabListScroll = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    const tabListWrapper = event.currentTarget
    const scrollAmount = event.deltaY

    tabListWrapper.scrollLeft += scrollAmount
  }, [])

  const updateMoreList = useCallback(() => {
    const labelDoms = getLabelDoms()
    const _moreList: TabItem<T>[] = []

    Array.from(labelDoms).forEach((item) => {
      const tabId = item.getAttribute(TAB_ID_ATTR) as T
      const tabItem = getTabItemById(tabId)
      const isVisible = isElementVisible(item, item.parentElement!, 0.6)

      if (!tabItem || isVisible)
        return

      _moreList.push({
        ...tabItem,
      })
    })

    setMoreList(_moreList)
  }, [getLabelDoms, setMoreList, getTabItemById])

  const debounceUpdateMoreList = useDebounceFn(updateMoreList)

  const updateIndicatorPosition = useCallback(() => {
    const activeLabelDom = getActiveLabelDom()

    if (!activeLabelDom)
      return

    const { offsetLeft, offsetWidth } = activeLabelDom

    indicatorWidth.set(offsetWidth)
    indicatorLeft.set(offsetLeft)
    debounceUpdateMoreList()
  }, [getActiveLabelDom, debounceUpdateMoreList])

  useEffect(() => {
    updateIndicatorPosition()
  }, [updateIndicatorPosition, tabSize.width])

  useEffect(() => {
    updateMoreList()
  }, [updateMoreList, activeId, tabSize.width])

  return (
    <TabContainer>
      <TabListHeader data-show-more={showMore}>
        <TabListWrapper
          ref={tabRef}
          data-show-more={showMore}
          onWheel={handleTabListScroll}
          style={tabListStyles}
        >
          {items.map(item => (
            <div {...{
              key: item.id,
              [TAB_ID_ATTR]: item.id,
            }}>
              <TabItemWrapper onClick={() => handleTabItemClick(item)}>
                <TabItemLabel
                  className={activeId === item.id ? 'tab-item-active' : ''}
                  tabIndex={activeId === item.id ? 0 : -1}
                  style={tabItemStyles}
                >
                  {item.label}
                </TabItemLabel>
              </TabItemWrapper>
            </div>
          ))}

          <ActiveTabIndicator
            style={{
              width: indicatorWidth,
              x: indicatorLeft,
            }}
          />
        </TabListWrapper>

        {showMore && (
          <MoreWrapper>
            <MoreIconWrapper onClick={() => setMoreListVisible(!moreListVisible)}>
              <StyledMoreIcon className="codicon-more" />
            </MoreIconWrapper>
            {moreListVisible && <MoreList>
              {moreList.map(item => (
                <MoreListItem key={item.id} onClick={() => handleTabItemClick(item)}>
                  {item.label}
                </MoreListItem>
              ))}
            </MoreList>
            }
          </MoreWrapper>
        )}
      </TabListHeader>

      {items.map((item) => {
        return (
          <TabView key={item.id} style={{
            display: activeId === item.id ? 'flex' : 'none',
          }}>
            {item.children}
          </TabView>
        )
      })}

    </TabContainer>
  )
}

Tab_.displayName = 'Tab'

export const Tab = memo(Tab_) as typeof Tab_
