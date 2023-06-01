import type { RuleSet } from 'styled-components'
import { css } from 'styled-components'

/**
 * The viewport width breakpoints
 */
export enum Breakpoints {
  sm = 375,
  md = 558,
  lg = 1000,
  xl = 1240,
}

export type BreakpointName = keyof typeof Breakpoints

export type StyledType = RuleSet<object>

export function withBreakpoint(breakpoint: BreakpointName,
  style: StyledType) {
  switch (breakpoint) {
    case 'sm':
      return css`
        @media (max-width: ${Breakpoints.md}px) {
          ${style}
        }
      `
    case 'md':
      return css`
        @media (min-width: ${Breakpoints.md}px) {
          ${style}
        }
      `
    case 'lg':
      return css`
        @media (min-width: ${Breakpoints.lg}px) {
          ${style}
        }
      `
    case 'xl':
      return css`
        @media (min-width: ${Breakpoints.xl}px) {
          ${style}
        }
      `
    default:
      return ''
  }
}
