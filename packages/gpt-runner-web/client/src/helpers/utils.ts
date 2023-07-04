import type { ParsedUrlQuery } from 'node:querystring'
import { formatSourceValue } from '@nicepkg/gpt-runner-shared/common'
import type { MutableRefObject, Ref } from 'react'

export function createEl<T extends keyof HTMLElementTagNameMap>(tag: T,
  attrMap: Partial<HTMLElementTagNameMap[T]>) {
  const el = document.createElement(tag)
  Object.keys(attrMap).forEach((key) => {
    el.setAttribute(key, attrMap[key as keyof HTMLElement] as string)
  })
  return el
}

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function')
        ref(value)
      else if (ref)
        (ref as MutableRefObject<T>).current = value
    })
  }
}

export function formatRouteQuery<T extends object>(query?: ParsedUrlQuery): Partial<T> {
  if (!query)
    return {} as Partial<T>

  const formattedQuery: Record<string, any> = {}

  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (Array.isArray(value))
      formattedQuery[key] = value.map(val => formatSourceValue(val))
    else
      formattedQuery[key] = formatSourceValue(value)
  })

  return formattedQuery as Partial<T>
}

// format num to xxk
export function formatNumWithK(num: number) {
  return `${(num / 1000).toFixed(1)}k`
}

export function countTokenQuick(text: string) {
  // int
  return Math.floor(text.length / 3.5)
}

export function isDomHidden(el: HTMLElement) {
  return el.offsetParent === null
}

export function isElementVisible<T extends HTMLElement = HTMLElement, P extends HTMLElement = HTMLElement>(
  element: T,
  parentElement: P,
  intersectionRatio = 1,
): boolean {
  // Get the bounding information of the element and parent element
  const rect = element.getBoundingClientRect()
  const parentRect = parentElement.getBoundingClientRect()

  // Check if the element is within the visible area of the parent element
  const isVisibleHorizontally = rect.left >= parentRect.left && rect.right <= parentRect.right
  const isVisibleVertically = rect.top >= parentRect.top && rect.bottom <= parentRect.bottom

  // If the element is fully within the visible area of the parent element, return true directly
  if (isVisibleHorizontally && isVisibleVertically)
    return true

  // If an intersection ratio is specified, calculate the visible percentage of the element in the parent element
  if (intersectionRatio > 0 && intersectionRatio <= 1) {
    const visibleWidth = Math.min(rect.right, parentRect.right) - Math.max(rect.left, parentRect.left)
    const visibleHeight = Math.min(rect.bottom, parentRect.bottom) - Math.max(rect.top, parentRect.top)
    const visibleArea = visibleWidth * visibleHeight
    const elementArea = rect.width * rect.height
    const visiblePercentage = visibleArea / elementArea

    // Check if the visible percentage meets the requirement
    return visiblePercentage >= intersectionRatio
  }

  // By default, if at least a part of the element is visible within the parent element, return true
  return isVisibleHorizontally || isVisibleVertically
}
