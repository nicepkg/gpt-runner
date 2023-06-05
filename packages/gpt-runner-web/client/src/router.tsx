import type { FC } from 'react'
import { Suspense, useEffect } from 'react'
import { Route, HashRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom'
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react'
import Home from './pages/home/index'
import Error404 from './pages/error/404'
import { useLoading } from './hooks/use-loading.hook'
import Chat from './pages/chat'
import { getGlobalConfig } from './helpers/global-config'

const HackRouter: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/')
      navigate(getGlobalConfig().initialRoutePath)
  }, [])

  return <></>
}

export const AppRouter: FC = () => {
  const { loading } = useLoading()

  return (
    <>
      {loading && <VSCodeProgressRing />}

      <Suspense fallback={<VSCodeProgressRing />}>
        <Router>
          <HackRouter></HackRouter>
          <Routes >
            <Route index element={<Home />} />
            <Route path="chat" element={<Chat />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Router>
      </Suspense>
    </>
  )
}
