import { Maximize2, Minus, Minimize2, X } from 'lucide-react'
import { applications } from '../../data/apps'
import type { WindowApplicationId } from '../../data/apps'
import { useWindowManager } from '../../hooks/useWindowManager'

export function WindowControls({ appId, expanded }: { appId: WindowApplicationId; expanded: boolean }) {
  const { closeApp, minimizeApp, toggleExpand } = useWindowManager()
  const app = applications[appId]
  const canExpand = 'expanded' in app.window
  const ExpandIcon = expanded ? Minimize2 : Maximize2

  return (
    <div className="window-controls" aria-label={`${app.name} window controls`}>
      <button type="button" className="window-control window-control--close" aria-label={`Close ${app.name}`} onClick={() => closeApp(appId)}>
        <span><X aria-hidden="true" /></span>
      </button>
      <button type="button" className="window-control window-control--minimize" aria-label={`Minimize ${app.name}`} onClick={() => minimizeApp(appId)}>
        <span><Minus aria-hidden="true" /></span>
      </button>
      <button type="button" className="window-control window-control--expand" disabled={!canExpand}
        aria-label={canExpand ? `${expanded ? 'Restore normal size of' : 'Expand'} ${app.name}` : `Expansion not supported for ${app.name}`}
        onClick={() => toggleExpand(appId)}>
        <span><ExpandIcon aria-hidden="true" /></span>
      </button>
    </div>
  )
}
