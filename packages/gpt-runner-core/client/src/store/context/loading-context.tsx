import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import { useDebouncedState } from '../../hooks/use-debounced-state.hook'

interface LoadingContextProviderProps {
  children: ReactNode
}

export interface ILoadingContext {
  loading: boolean
  setLoading: (isLoading: boolean) => void
}

export const LoadingContext = createContext<ILoadingContext | null>(null)

export function LoadingProvider({ children }: LoadingContextProviderProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const debouncedLoading = useDebouncedState(loading, show =>
    show ? 300 : 0,
  )

  const context = { loading: debouncedLoading, setLoading }

  return (
    <LoadingContext.Provider value={context}>
      {children}
    </LoadingContext.Provider>
  )
}
