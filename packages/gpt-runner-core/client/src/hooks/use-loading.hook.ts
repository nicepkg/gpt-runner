import { useContext } from 'react'
import { LoadingContext } from '../store/context/loading-context'

export function useLoading() {
  const context = useContext(LoadingContext)

  if (!context)
    throw new Error('useLoading must be used within LoadingProvider')

  return context
}
