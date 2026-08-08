import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { storageService } from './services/storageService'
import { applyThemePreference } from './services/themeService'
import { applyBranding } from './services/brandingService'
import { hydrateSecretsVault } from './services/secretsVault'

async function boot() {
  // Decrypt / migrate secrets before first settings read.
  await hydrateSecretsVault()

  const bootSettings = storageService.getSettings()
  applyThemePreference(bootSettings.theme || 'system')
  applyBranding(bootSettings)

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

boot().catch((err) => {
  console.error('Boot failed:', err)
  // Last-resort render so the user still sees an error surface.
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
