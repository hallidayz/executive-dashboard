import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { storageService } from './services/storageService'
import { applyThemePreference } from './services/themeService'
import { applyBranding } from './services/brandingService'

// Apply theme + brand colors before first paint to avoid a flash.
const bootSettings = storageService.getSettings()
applyThemePreference(bootSettings.theme || 'system')
applyBranding(bootSettings)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
