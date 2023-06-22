import { useContext, useRef } from 'react'
import { LoadingContext } from '../store/context/loading-context'
import { useDebouncedState } from './use-debounced-state.hook'

const LOADING_DEBOUNCE_TIMEOUT = 300

export function useLoading() {
  const context = useContext(LoadingContext)

  if (!context)
    throw new Error('useLoading must be used within LoadingProvider')

  const { loading, setLoading: setContextLoading, loadingRefMap } = context
  const loadingRef = useRef(`${Date.now() + Math.random()}`)

  const setLoading = (isLoading: boolean) => {
    loadingRefMap.current[loadingRef.current] = isLoading
    setContextLoading(
      Array.from(Object.values(loadingRefMap.current)).some(
        isLoading => isLoading,
      ),
    )
  }

  const debouncedLoading = useDebouncedState(loading, show =>
    show ? LOADING_DEBOUNCE_TIMEOUT : 0,
  )

  return {
    loading: debouncedLoading,
    setLoading,
  }
}
