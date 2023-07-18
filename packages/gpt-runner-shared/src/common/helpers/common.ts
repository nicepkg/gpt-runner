import { AxiosError } from 'axios'
import * as jsonc from 'jsonc-parser'
import type { TreeItem } from '../types'

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
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

export function travelTree<T extends TreeItem<Record<string, any>>, R extends TreeItem<Record<string, any>> = TreeItem<Record<string, any>> >(tree: T[], callback: (item: T, parent?: T) => void | null | undefined | R): R[] {
  const travel = (tree: T[], parent?: T) => {
    const result: R[] = []
    tree.forEach((item) => {
      const callbackResult = callback(item, parent)
      const finalItem = callbackResult === undefined ? item : callbackResult

      if (finalItem && item.children)
        finalItem.children = travel(item.children as T[], item)

      if (finalItem !== null)
        result.push(finalItem as R)
    })

    return result
  }
  return travel(tree) as R[]
}

export function travelTreeDeepFirst<T extends TreeItem<Record<string, any>>, R extends TreeItem<Record<string, any>> = TreeItem<Record<string, any>> >(tree: T[], callback: (item: T, parent?: T) => void | null | undefined | R): R[] {
  const travel = (tree: T[], parent?: T) => {
    const result: R[] = []
    tree.forEach((item) => {
      let children: R[] | undefined

      if (item.children)
        children = travel(item.children as T[], item)

      const callbackResult = callback({ ...item, children }, parent)
      const finalItem = callbackResult === undefined ? item : callbackResult

      if (finalItem !== null)
        result.push(finalItem as R)
    })

    return result
  }
  return travel(tree) as R[]
}

export function tryParseJson(str: string, supportJsonc = false) {
  try {
    const target = str?.trim() ?? ''
    return supportJsonc ? jsonc.parse(target) : JSON.parse(target)
  }
  catch (e) {
    console.error('tryParseJson error: ', str, e)
    return {}
  }
}

export function tryStringifyJson(obj: any) {
  try {
    return JSON.stringify(obj)
  }
  catch (e) {
    console.error('tryStringifyJson error: ', e)
    return ''
  }
}

export function debounce<T extends (...args: any[]) => any>(callback: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined

  return function (this: any, ...args: Parameters<T>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this

    const later = function () {
      timeout = undefined
      callback.apply(context, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait) as any
  } as T
}

const keyIsCalledMap = new Map<string, boolean>()
export function runOnceByKey<T extends (...args: any[]) => any>(callback: T, key: string) {
  return function (this: any, ...args: Parameters<T>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    const keyIsCalled = keyIsCalledMap.get(key)

    if (keyIsCalled)
      return

    const result = callback?.apply(context, args)

    if (result instanceof Promise) {
      result?.then?.(() => {
        keyIsCalledMap.set(key, true)
      })
    }
    else {
      keyIsCalledMap.set(key, true)
    }

    return result
  } as T
}

export function urlRemoveLocalhost(url: string | null | undefined): string {
  if (typeof window === 'undefined')
    return url || ''

  if (!url)
    return ''

  try {
    const uri = new URL(url)
    let result = url
    const currentHostname = window.location.hostname
    const currentPort = window.location.port

    if (['localhost', '127.0.0.1'].includes(uri.hostname))
      uri.hostname = currentHostname

    // if it's shared by tunnel, should keep the port same as the original url
    if (!currentPort || [80, 443].includes(Number(currentPort)))
      uri.port = currentPort

    // sync http or https
    uri.protocol = window.location.protocol

    result = uri.toString()

    if (!url.endsWith('/'))
      result = result.replace(/\/$/, '')

    return result
  }
  catch {
    return url
  }
}

export function objectToQueryString(obj: Record<string, any>, prefix?: string): string {
  const queryStringArray: string[] = []

  for (const key in obj) {
    if (hasOwn(obj, key)) {
      const value = obj[key]
      const encodedKey = encodeURIComponent(prefix ? `${prefix}[${key}]` : key)

      if (Array.isArray(value)) {
        for (const item of value) {
          queryStringArray.push(
            `${encodedKey}[]=${encodeURIComponent(item)}`,
          )
        }
      }
      else if (typeof value === 'object' && value !== null) {
        queryStringArray.push(objectToQueryString(value, encodedKey))
      }
      else {
        queryStringArray.push(`${encodedKey}=${encodeURIComponent(value)}`)
      }
    }
  }

  return queryStringArray.join('&')
}

export function toUnixPath(path: string | undefined | null) {
  if (!path)
    return ''
  return path.replace(/\\+/g, '/')
}

export function getProcessCwd(): string | undefined {
  try {
    return toUnixPath(process.cwd())
  }
  catch (e) {
    return undefined
  }
}

export function getErrorMsg(error: any) {
  const errorMessage = String(
    error instanceof AxiosError
      ? error.response?.data?.message
      : (error as Error)?.message || error || '',
  )
  return errorMessage
}

export function waitForCondition(conditionFn: (...args: any[]) => boolean, timeout = 10000) {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      if (conditionFn()) {
        clearInterval(interval)
        resolve()
      }
      else if (Date.now() - startTime > timeout) {
        clearInterval(interval)
        console.warn('waitForCondition timeout with function', conditionFn.toString())
        reject(new Error('waitForCondition timeout'))
      }
    }, 100)
  })
}

export function isChineseCharacter(char: string): boolean {
  const charCode = char.charCodeAt(0)
  return (charCode >= 0x4E00 && charCode <= 0x9FFF)
         || (charCode >= 0x3400 && charCode <= 0x4DBF)
         || (charCode >= 0x20000 && charCode <= 0x2A6DF)
         || (charCode >= 0x2A700 && charCode <= 0x2B73F)
         || (charCode >= 0x2B740 && charCode <= 0x2B81F)
         || (charCode >= 0x2B820 && charCode <= 0x2CEAF)
         || (charCode >= 0xF900 && charCode <= 0xFAFF)
         || (charCode >= 0x2F800 && charCode <= 0x2FA1F)
}
