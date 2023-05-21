import { Debug } from '../helpers/debug'
import { useSingleRef } from './use-single-ref.hook'

export function useDebug(place: string) {
  const debug = useSingleRef(() => new Debug(place))

  return (label: string, data?: unknown) => debug.log(label, data)
}
