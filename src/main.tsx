import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

import './index.css'

import { WorkspaceProvider } from './components/WorkspaceContext'
import { DefaultPage } from './pages/DefaultPage'
import { ConversationPage } from './pages/ConversationPage'
import { DocumentKeyPage } from './pages/DocumentByKeyPage'
import { Layout } from './pages/Layout'

const WEBSOCKET_URL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorkspaceProvider url={WEBSOCKET_URL}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DefaultPage />} />
            <Route path="/c/:conversationId" element={<ConversationPage />} />
            <Route path="/k/:key" element={<DocumentKeyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  </StrictMode>
)
