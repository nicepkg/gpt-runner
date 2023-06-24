import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ComponentType, type FC, type PropsWithChildren, useEffect, useRef } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from 'react-error-boundary'
import { AppRouter } from './router'
import { GlobalStyle } from './styles/global.styles'
import { LoadingProvider } from './store/context/loading-context'
import { MarkdownStyle } from './styles/markdown.styles'
import { useGlobalStore } from './store/zustand/global'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    },
  },
})

const FallbackRender: ComponentType<FallbackProps> = ({ error }) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackRender as any}>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export const App: FC = () => {
  const isRunOnce = useRef(false)
  const { langId, updateLangId } = useGlobalStore()

  useEffect(() => {
    if (isRunOnce.current || !langId)
      return
    isRunOnce.current = true

    updateLangId(langId)
  }, [langId])

  return (
    <AppProviders>
      <GlobalStyle />
      <MarkdownStyle />
      <AppRouter />
    </AppProviders>
  )
}
