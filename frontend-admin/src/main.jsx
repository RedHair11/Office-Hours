import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/AdminContext.jsx'
import ProfessorContextProvider from './context/ProfessorContext.jsx'
import AppContextProvider from './context/AppContext.jsx'

// Rendering the application into the DOM
ReactDOM.createRoot(document.getElementById('root')).render(

  // Wrapping the app with necessary context providers and the BrowserRouter for routing
  <BrowserRouter>

    {/* AdminContextProvider: Provides the admin context for the app */}
    <AdminContextProvider>

      {/* ProfessorContextProvider: Provides the professor context for the app */}
      <ProfessorContextProvider>

        {/* AppContextProvider: Provides the general app context */}
        <AppContextProvider>

          {/* Main App component */}
          <App />
          
        </AppContextProvider>
      </ProfessorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>,
)
