import type { Ref } from 'react'
import { desktopContent } from '../../data/desktop'
import { DesktopHero } from './DesktopHero'
import { CurrentlyWidget } from './widgets/CurrentlyWidget'
import { PhotoWidget } from './widgets/PhotoWidget'
import { QuickLinksWidget } from './widgets/QuickLinksWidget'
import './desktop.css'

export function Desktop({ desktopRef }: { desktopRef?: Ref<HTMLElement> }) {
  return (
    <main ref={desktopRef} tabIndex={-1} className="desktop" aria-labelledby="desktop-heading">
      <div className="desktop__canvas">
        <DesktopHero {...desktopContent.hero} />
        <aside className="desktop__widgets" aria-label="Personal desktop widgets">
          <PhotoWidget photo={desktopContent.photo} />
          <CurrentlyWidget {...desktopContent.currently} />
          <QuickLinksWidget links={desktopContent.quickLinks} />
        </aside>
      </div>
    </main>
  )
}
