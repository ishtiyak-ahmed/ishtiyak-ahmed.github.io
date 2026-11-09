import { useRef } from 'react'
import { applications } from '../data/apps'
import type { LaunchApplication } from '../data/apps'
import { Desktop } from '../components/desktop/Desktop'
import { Dock } from '../components/desktop/Dock'
import { MenuBar } from '../components/desktop/MenuBar'

export function App() {
  const desktopRef = useRef<HTMLElement>(null)

  // Phase 3 will extend this one dispatch point with real window operations.
  const launchApplication: LaunchApplication = (id) => {
    if (applications[id].launch === 'desktop') {
      desktopRef.current?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }

  return (
    <>
      <MenuBar activeApplicationName={applications.home.name} />
      <Desktop desktopRef={desktopRef} />
      <Dock onLaunch={launchApplication} availableAppIds={['home']} />
    </>
  )
}
