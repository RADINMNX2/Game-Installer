import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { SmartCoreProvider } from './components/SmartCoreContext'
import { ThemeProvider } from './components/ThemeContext'
import { ToastProvider } from './components/Toast'

const container = document.getElementById('root')
if (!container) throw new Error('root element missing')

createRoot(container).render(
  <React.StrictMode>
    <SmartCoreProvider>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </SmartCoreProvider>
  </React.StrictMode>
)
