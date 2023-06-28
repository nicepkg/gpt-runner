import { createContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface LoadingContextProviderProps {
  children: ReactNode
}

export interface ILoadingContext {
  loading: boolean
  setLoading: (isLoading: boolean) => void
  loadingRefMap: React.MutableRefObject<Record<string, boolean>>
}

export const LoadingContext = createContext<ILoadingContext | null>(null)

export function LoadingProvider({ children }: LoadingContextProviderProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const loadingRefMap = useRef<Record<string, boolean>>({})

  const context: ILoadingContext = {
    loading,
    setLoading,
    loadingRefMap,
  }

  return (
    <LoadingContext.Provider value={context}>
      {children}
    </LoadingContext.Provider>
  )
}
