export function isNumber<T extends number>(value: T | unknown): value is number {
  return Object.prototype.toString.call(value) === '[object Number]'
}

export function isString<T extends string>(value: T | unknown): value is string {
  return Object.prototype.toString.call(value) === '[object String]'
}

export function isNotEmptyString(value: any): boolean {
  return typeof value === 'string' && value.length > 0
}

export function isBoolean<T extends boolean>(value: T | unknown): value is boolean {
  return Object.prototype.toString.call(value) === '[object Boolean]'
}

export function isFunction<T extends (...args: any[]) => any | void | never>(value: T | unknown): value is T {
  return Object.prototype.toString.call(value) === '[object Function]'
}

export function isObject<T extends object>(value: T | unknown): value is T {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export type CompareFunction<T> = (this: T, a: any, b: any, key?: string) => boolean | undefined

// see: https://github.com/dashed/shallowequal/blob/master/index.original.js
export function isShallowEqual<T>(
  objA: any,
  objB: any,
  compare?: CompareFunction<T>,
  compareContext?: T,
): boolean {
  let ret: boolean | undefined = compare ? compare.call(compareContext!, objA, objB) : undefined

  if (ret !== undefined)
    return !!ret

  if (Object.is(objA, objB))
    return true

  if (typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB)
    return false

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length)
    return false

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB)

  // Test for A's keys different from B.
  for (let idx = 0; idx < keysA.length; idx++) {
    const key = keysA[idx]

    if (!bHasOwnProperty(key))
      return false

    const valueA = objA[key]
    const valueB = objB[key]

    ret = compare ? compare.call(compareContext!, valueA, valueB, key) : undefined

    if (ret === false || (ret === undefined && !Object.is(valueA, valueB)))
      return false
  }

  return true
}

// export function isShallowDeepEqual(
//   objA: any,
//   objB: any,
// ): boolean {
//   return isShallowEqual(objA, objB, (a, b) => {
//     return tryStringifyJson(a, true) === tryStringifyJson(b, true)
//   })
// }
// export function isDeepEqual<T>(objA: any, objB: any): boolean {
//   const compare = (a: any, b: any) => {
//     if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
//       // For objects, perform a deep comparison
//       return isDeepEqual(a, b)
//     }

//     // For primitives, perform a shallow comparison
//     return Object.is(a, b)
//   }

//   return isShallowEqual(objA, objB, compare)
// }

export function isDeepEqual(objA: any, objB: any, maxDepth = 20, visited: any[] = [], depth: number = 0): boolean {
  if (depth > maxDepth) {
    // Limit the maximum recursion depth to prevent "Maximum call stack size exceeded" error
    return true
  }

  if (visited.includes(objA) || visited.includes(objB))
    return true

  const compare = (a: any, b: any) => {
    if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
      // For objects, perform a deep comparison
      return isDeepEqual(a, b, maxDepth, [...visited, a, b], depth + 1)
    }

    // For primitives, perform a shallow comparison
    return Object.is(a, b)
  }

  return isShallowEqual(objA, objB, compare)
}
