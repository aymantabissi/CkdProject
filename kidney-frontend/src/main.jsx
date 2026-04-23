import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// L-Client ID s-shih dyal NephroAI li khrejti men Google Cloud Console
const GOOGLE_CLIENT_ID = "838179119632-mpabi4kflpnah09s9ioma9bcm2b8h9tm.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)