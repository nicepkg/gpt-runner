import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ComponentType, FC, PropsWithChildren } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from 'react-error-boundary'
import { AppRouter } from './router'
import { GlobalStyle } from './styles/global.styles'
import { LoadingProvider } from './store/context/loading-context'
import { MarkdownStyle } from './styles/markdown.styles'

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
    <LoadingProvider>
      <ErrorBoundary FallbackComponent={FallbackRender as any}>
        <QueryClientProvider client={queryClient}>
          <>
            {children}
          </>
        </QueryClientProvider>
      </ErrorBoundary>
    </LoadingProvider>

  )
}

export const App: FC = () => {
  return (
    <AppProviders>
      <GlobalStyle />
      <MarkdownStyle />
      <AppRouter />
    </AppProviders>
  )
}
