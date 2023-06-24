import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ComponentType, type FC, type PropsWithChildren, useEffect } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from 'react-error-boundary'
import { AppRouter } from './router'
import { GlobalStyle } from './styles/global.styles'
import { LoadingProvider } from './store/context/loading-context'
import { MarkdownStyle } from './styles/markdown.styles'
import { useGlobalStore } from './store/zustand/global'
import { GlobalThemeStyle } from './styles/theme.styles'
import i18n from './helpers/i18n'

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
  const { langId, themeName } = useGlobalStore()

  useEffect(() => {
    if (!langId)
      return
    i18n.changeLanguage(langId)
    const direction = i18n.dir()
    document.body.dir = direction
  }, [langId])

  useEffect(() => {
    if (!themeName)
      return

    document.body.dataset.theme = themeName
  }, [themeName])

  return (
    <AppProviders>
      <GlobalStyle />
      <GlobalThemeStyle />
      <MarkdownStyle />
      <AppRouter />
    </AppProviders>
  )
}
