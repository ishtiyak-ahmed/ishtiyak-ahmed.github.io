// Test-only page, not imported by the production HTML entry.
import { createRoot } from 'react-dom/client'
import { WindowManagerProvider } from '../../src/app/WindowManagerProvider'
import { useWindowManager } from '../../src/hooks/useWindowManager'
import { AppWindow } from '../../src/components/windows/AppWindow'
import { FinderApp } from '../../src/apps/finder/FinderApp'
import { MenuBar } from '../../src/components/desktop/MenuBar'
import { Dock } from '../../src/components/desktop/Dock'
import { Desktop } from '../../src/components/desktop/Desktop'
import { projectFixtures } from '../fixtures/projects'
import '../../src/styles/global.css'
import '../../src/components/windows/windows.css'

export function FixtureShell() {
  const { state, activeAppId, openApp } = useWindowManager()
  return <div className="os-shell">
    <MenuBar activeApplicationName={activeAppId === 'projects' ? 'Projects' : 'Home'} /><Desktop />
    <div style={{ position: 'fixed', top: 42, right: 10, zIndex: 40 }}>
      <button type="button" onClick={() => openApp('projects', '/ishtiyak/projects/test-alpha-folder')}>Open requested TEST FIXTURE</button>
      <button type="button" onClick={() => openApp('projects', 'missing-project')}>Open invalid TEST FIXTURE</button>
    </div>
    <div className="window-workspace">{state.windows.filter((window) => window.appId === 'projects').map((window) => <AppWindow key={window.instanceId} window={window} layer={1}><FinderApp entries={projectFixtures} selectionRequest={window.resourceRequest} /></AppWindow>)}</div>
    <Dock onLaunch={openApp} availableAppIds={['home', 'projects']} runningAppIds={state.windows.map((window) => window.appId)} />
  </div>
}

createRoot(document.getElementById('root')!).render(<WindowManagerProvider projectEntries={projectFixtures}><FixtureShell /></WindowManagerProvider>)
