import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Always scroll to top on page load / refresh
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0)
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
