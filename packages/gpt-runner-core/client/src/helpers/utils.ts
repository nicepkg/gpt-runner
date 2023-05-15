import type { ParsedUrlQuery } from 'node:querystring'
import type { MutableRefObject, Ref } from 'react'

export function createEl<T extends keyof HTMLElementTagNameMap>(tag: T,
  attrMap: Partial<HTMLElementTagNameMap[T]>) {
  const el = document.createElement(tag)
  Object.keys(attrMap).forEach((key) => {
    el.setAttribute(key, attrMap[key as keyof HTMLElement] as string)
  })
  return el
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
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

/**
 * Checks if an object has its own property with the specified name.
 *
 * @param obj - The object to check.
 * @param prop - The name of the property to check for.
 * @returns True if the object has its own property with the specified name, false otherwise.
 */
export function hasOwn<T extends object, K extends keyof T>(
  obj: T,
  prop: K,
): boolean {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function formatSourceValue<T = any>(value: any): T {
  let result
  if (value === 'true') {
    result = true
  }
  else if (value === 'false') {
    result = false
  }
  else if (/^-?\d*\.?\d+$/.test(value)) {
    // regex pattern for matching float numbers
    result = parseFloat(value)
  }
  else if (/^-?\d+$/.test(value)) {
    // regex pattern for matching integer numbers
    result = parseInt(value, 10)
  }
  else {
    result = value
  }

  return result as T
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

export function getSearchParams(val: string, url?: string): string {
  const defaultUrl = typeof window !== 'undefined' ? window.location.href : ''
  const finalUrl = url || defaultUrl || ''
  const searchParams = finalUrl.split('?')?.[1] || ''
  const params = new URLSearchParams(searchParams)
  return params.get(val) || ''
}

export function addSearchParams(urlLike: string,
  searchParams: Record<string, any>) {
  const [urlBase = '', urlSearch = ''] = urlLike.split('?')
  const params = new URLSearchParams(urlSearch)
  Object.keys(searchParams).forEach((key) => {
    params.set(key, searchParams[key])
  })
  const urlSearchParams = params.toString()
  if (!urlSearchParams)
    return urlBase
  return `${urlBase}?${urlSearchParams}`
}

export function removeSearchParams(urlLike: string,
  searchParamKeys: string[]) {
  const [urlBase = '', urlSearch = ''] = urlLike.split('?')
  const params = new URLSearchParams(urlSearch)
  searchParamKeys.forEach((key) => {
    params.delete(key)
  })
  const urlSearchParams = params.toString()
  if (!urlSearchParams)
    return urlBase
  return `${urlBase}?${urlSearchParams}`
}
