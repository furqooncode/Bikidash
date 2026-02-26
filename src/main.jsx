import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import { ControlProvider }  from './Context/control.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ControlProvider>
      <App />
    </ControlProvider>
  </StrictMode>,
)
