import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

import './index.css'

import { WorkspaceProvider } from './components/WorkspaceContext'
import { App } from './pages/App'
import { ConversationPage } from './pages/ConversationPage'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <WorkspaceProvider url={WS_URL}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/c/:conversationId" element={<ConversationPage />} />
        </Routes>
      </WorkspaceProvider>
    </BrowserRouter>
  </StrictMode>
)
