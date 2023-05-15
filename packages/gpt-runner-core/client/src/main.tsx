import React from 'react'
import { createRoot } from 'react-dom/client'
import { getConfig } from './constant/config'
import { GlobalStyle } from './styles/global.styles'
import { ChatPage } from './views/chat'

function App() {
  const { pageName } = getConfig()

  return <>
    <GlobalStyle />
    {pageName ? <ChatPage /> : null}
  </>
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
