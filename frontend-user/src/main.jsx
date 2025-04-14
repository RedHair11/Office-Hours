import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'

// Create the root of the application and render it to the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* AppContextProvider wraps the entire app, providing global state */}
    <AppContextProvider>
      {/* Main App component */}
      <App />
    </AppContextProvider>
  </BrowserRouter>,
)
