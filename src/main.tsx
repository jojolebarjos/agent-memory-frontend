import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

import './index.css'

import { WorkspaceProvider } from './components/WorkspaceContext'
import { App } from './pages/App'
import { ConversationPage } from './pages/ConversationPage'

const WEBSOCKET_URL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorkspaceProvider url={WEBSOCKET_URL}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/c/:conversationId" element={<ConversationPage />} />
        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  </StrictMode>
)
