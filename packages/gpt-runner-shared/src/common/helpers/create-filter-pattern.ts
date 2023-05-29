import { minimatch } from 'minimatch'
import type { FilterPattern } from '../types'

export function createFilterByPattern(pattern: FilterPattern): (source: string) => boolean {
  if (pattern === null || pattern === undefined)
    return () => true

  if (typeof pattern === 'function')
    return pattern

  if (typeof pattern === 'string')
    return source => minimatch(source, pattern)

  if (pattern instanceof RegExp)
    return source => pattern.test(source)

  if (Array.isArray(pattern)) {
    const matchers = pattern.map(p => createFilterByPattern(p))
    return source => matchers.some(matcher => matcher(source))
  }

  throw new Error(`Invalid pattern: ${pattern}`)
}
