import type { FC } from 'react'
import { Suspense } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react'
import Home from './pages/home/index'
import Error404 from './pages/error/404'
import { useLoading } from './hooks/use-loading.hook'
import Chat from './pages/chat'

export const AppRouter: FC = () => {
  const { loading } = useLoading()
  return (
    <>
      {loading && <VSCodeProgressRing />}

      <Suspense fallback={<VSCodeProgressRing />}>
        <Router>
          <Routes>
            <Route index element={<Home />} />
            <Route path="chat" element={<Chat />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Router>
      </Suspense>
    </>
  )
}
