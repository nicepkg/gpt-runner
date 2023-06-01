import { useMedia } from 'react-use'
import { Breakpoints } from '../helpers/with-breakpoint'

export function useIsMobile() {
  const isMobile = useMedia(`(max-width: ${Breakpoints.md}px)`, false)

  return isMobile
}
