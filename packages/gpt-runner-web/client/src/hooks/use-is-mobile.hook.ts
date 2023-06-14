import { useMedia } from 'react-use'
import { Breakpoints } from '../helpers/with-breakpoint'

export function useIsMobile() {
  const defaultIsMobile = typeof window !== 'undefined' && window.innerWidth < Breakpoints.md
  const isMobile = useMedia(`(max-width: ${Breakpoints.md}px)`, defaultIsMobile)

  return isMobile
}
