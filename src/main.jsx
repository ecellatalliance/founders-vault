import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeDemoUsers } from './utils/initDemoData.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Initialize demo users
initializeDemoUsers()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
