import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ComponentType, type FC, type PropsWithChildren, memo, useEffect } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import { AppRouter } from './router'
import { GlobalStyle } from './styles/global.styles'
import { LoadingProvider } from './store/context/loading-context'
import { MarkdownStyle } from './styles/markdown.styles'
import { useGlobalStore } from './store/zustand/global'
import { GlobalThemeStyle } from './styles/theme.styles'
import { initI18n } from './helpers/i18n'
import { Toast } from './components/toast'

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

initI18n()

const FallbackRender: ComponentType<FallbackProps> = memo(({ error }) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
})

export const AppProviders: FC<PropsWithChildren> = memo(({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={FallbackRender as any}>
      <QueryClientProvider client={queryClient}>
        <Toast></Toast>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
})

export const App: FC = memo(() => {
  const { langId, themeName } = useGlobalStore()
  const { i18n } = useTranslation()

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
})
