// Local browser-test harness. Not referenced by the production HTML entry.
import { createRoot } from 'react-dom/client'
import { WindowManagerProvider } from '../../src/app/WindowManagerProvider'
import { useWindowManager } from '../../src/hooks/useWindowManager'
import { AppWindow } from '../../src/components/windows/AppWindow'
import { ExperienceApp } from '../../src/apps/experience/ExperienceApp'
import { MenuBar } from '../../src/components/desktop/MenuBar'
import { Dock } from '../../src/components/desktop/Dock'
import { Desktop } from '../../src/components/desktop/Desktop'
import { experienceFixtures, longHistoryFixtures } from '../fixtures/experiences'
import '../../src/styles/global.css'
import '../../src/components/windows/windows.css'

export function FixtureShell() {
  const { state, activeAppId, openApp } = useWindowManager()
  const params = new URLSearchParams(location.search)
  const entries = params.has('empty') ? [] : params.has('many') ? longHistoryFixtures : experienceFixtures
  return <div className="os-shell">
    <MenuBar activeApplicationName={activeAppId === 'experience' ? 'Experience' : 'Home'} />
    <Desktop />
    <button type="button" style={{ position: 'fixed', top: 45, right: 15, zIndex: 40 }} onClick={() => openApp('experience', 'test-role-older')}>Open linked TEST FIXTURE</button>
    <div className="window-workspace">{state.windows.filter((window) => window.appId === 'experience').map((window) => <AppWindow key={window.instanceId} window={window} layer={1}><ExperienceApp entries={entries} selectionRequest={window.resourceRequest} /></AppWindow>)}</div>
    <Dock onLaunch={openApp} availableAppIds={['home', 'experience']} runningAppIds={state.windows.map((window) => window.appId)} />
  </div>
}

createRoot(document.getElementById('root')!).render(<WindowManagerProvider><FixtureShell /></WindowManagerProvider>)
