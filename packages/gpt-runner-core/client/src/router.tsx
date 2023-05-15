import type { FC } from 'react'
import { Suspense } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react'
import Home from './pages/home/index'
import Error404 from './pages/error/404'
import { useLoading } from './hooks/use-loading.hook'

export const AppRouter: FC = () => {
  const { loading } = useLoading()
  return (
    <>
      {loading && <VSCodeProgressRing />}

      <Suspense fallback={<VSCodeProgressRing />}>
        <Router>
          <Routes>
            <Route index element={<Home />} />

            {/* Using path="*"" means "match anything", so this route
        acts like a catch-all for URLs that we don't have explicit
        routes for. */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Router>
      </Suspense>
    </>
  )
}
