import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './page/HomePage.jsx'
import { NetworkDataProvider } from './NetworkDataContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <NetworkDataProvider>
    <HomePage />
    </NetworkDataProvider>
  </StrictMode>,
)
