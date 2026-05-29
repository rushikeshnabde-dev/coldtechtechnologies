import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

// Disable browser scroll restoration on every load including refresh
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

// Scroll to top immediately on page load / refresh
window.scrollTo({ top: 0, left: 0, behavior: "instant" });
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// Also fire after full load in case browser tries to restore after hydration
window.addEventListener("load", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}, { once: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
