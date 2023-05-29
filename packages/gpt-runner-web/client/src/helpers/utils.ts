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

export function getErrorMsg(error: any) {
  const errorMessage = String(
    (error as Error)?.message || error || '',
  )
  return errorMessage
}
