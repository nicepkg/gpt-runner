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

export type TreeItem<T> = T & { children?: TreeItem<T>[] }
export function travelTree<T extends TreeItem<Record<string, any>>, R extends TreeItem<Record<string, any>> = TreeItem<Record<string, any>> >(tree: T[], callback: (item: T, parent?: T) => void | R): R[] {
  const travel = (tree: T[], parent?: T) => {
    return tree.map((item) => {
      const finalItem = callback(item, parent) || item
      if (item.children)
        finalItem.children = travel(item.children as T[], item)

      return finalItem
    })
  }
  return travel(tree) as R[]
}
