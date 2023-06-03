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

export function tryParseJson(str: string) {
  try {
    return JSON.parse(str)
  }
  catch (e) {
    return {}
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
