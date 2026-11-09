import { useEffect, useRef } from 'react'
import { applications, dockOrder } from '../data/apps'
import { Desktop } from '../components/desktop/Desktop'
import { Dock } from '../components/desktop/Dock'
import { MenuBar } from '../components/desktop/MenuBar'
import { WindowManager } from '../components/windows/WindowManager'
import { WindowManagerProvider } from './WindowManagerProvider'
import { useWindowManager } from '../hooks/useWindowManager'

function DesktopShell() {
  const desktopRef = useRef<HTMLElement>(null)
  const { state, activeAppId, openApp } = useWindowManager()

  useEffect(() => {
    if (activeAppId === 'home' && state.focusRequest > 0) {
      desktopRef.current?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [activeAppId, state.focusRequest])

  return (
    <div className="os-shell">
      <MenuBar activeApplicationName={applications[activeAppId].name} />
      <Desktop desktopRef={desktopRef} />
      <WindowManager />
      <Dock onLaunch={openApp} availableAppIds={dockOrder} runningAppIds={state.windows.map((window) => window.appId)} />
    </div>
  )
}

export function App() {
  return <WindowManagerProvider><DesktopShell /></WindowManagerProvider>
}
