import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'

import './index.css'

import { WorkspaceProvider } from './components/WorkspaceContext'
import { HomePage } from './pages/HomePage'
import { ConversationPage } from './pages/ConversationPage'
import { DocumentByKeyPage } from './pages/DocumentByKeyPage'
import { DocumentByTagPage } from './pages/DocumentByTagPage'
import { Layout } from './pages/Layout'

const WEBSOCKET_URL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorkspaceProvider url={WEBSOCKET_URL}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/c/:conversationId" element={<ConversationPage />} />
            <Route path="/k/:key" element={<DocumentByKeyPage />} />
            <Route path="/t/:tag" element={<DocumentByTagPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  </StrictMode>
)
