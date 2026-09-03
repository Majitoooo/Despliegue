import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CasoProvider } from './context/casoContext.jsx'
import { NavegacionProvider } from './context/navegacionContext.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CasoProvider>
      <NavegacionProvider>
        <App />
      </NavegacionProvider>
    </CasoProvider>
  </StrictMode>,
)