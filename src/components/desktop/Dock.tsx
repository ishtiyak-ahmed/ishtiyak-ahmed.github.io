import { useState } from 'react'
import { applications, dockOrder } from '../../data/apps'
import type { ApplicationId, LaunchApplication } from '../../data/apps'
import { DockIcon } from './DockIcon'
import './dock.css'

interface DockProps {
  onLaunch: LaunchApplication
  availableAppIds: readonly ApplicationId[]
  runningAppIds?: readonly ApplicationId[]
}

export function Dock({ onLaunch, availableAppIds, runningAppIds = [] }: DockProps) {
  const [dismissedTooltip, setDismissedTooltip] = useState<ApplicationId | null>(null)

  return (
    <nav className="dock" aria-label="Applications">
      <ul>
        {dockOrder.map((id) => {
          const app = applications[id]
          const available = availableAppIds.includes(id)
          const running = runningAppIds.includes(id)
          const tooltipId = `dock-tooltip-${id}`
          return (
            <li key={id} className="dock__item" data-tooltip-dismissed={dismissedTooltip === id || undefined}>
              <button
                type="button"
                className="dock__button"
                aria-label={app.name}
                aria-describedby={tooltipId}
                aria-disabled={!available || undefined}
                onClick={() => { if (available) onLaunch(id) }}
                onFocus={() => setDismissedTooltip(null)}
                onPointerEnter={() => setDismissedTooltip(null)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setDismissedTooltip(id)
                }}
              >
                <DockIcon icon={app.icon} />
                {running && <span className="dock__running" aria-label="Running" role="img" />}
              </button>
              <span className="dock__tooltip" role="tooltip" id={tooltipId}>
                {app.name}
                {running && <span className="sr-only"> — Running</span>}
                {!available && <span className="dock__availability">Not yet available</span>}
              </span>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
