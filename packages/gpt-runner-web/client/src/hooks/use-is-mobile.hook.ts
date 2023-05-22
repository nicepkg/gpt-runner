import { useMedia } from 'react-use'
import { Breakpoints } from '../helpers/with-breakpoint'

export function useIsMobile() {
  const isMobile = useMedia(`(max-width: ${Breakpoints.sm}px)`, false)

  return isMobile
}
