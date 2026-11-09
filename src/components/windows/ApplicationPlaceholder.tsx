import { applications } from '../../data/apps'
import type { WindowApplicationId } from '../../data/apps'
import { DockIcon } from '../desktop/DockIcon'

// Replace this component with each real app in its scheduled phase.
export function ApplicationPlaceholder({ appId }: { appId: WindowApplicationId }) {
  const app = applications[appId]
  return (
    <div className="application-placeholder">
      <div aria-hidden="true"><DockIcon icon={app.icon} /></div>
      <h2>{app.name}</h2>
      <p>{app.window.placeholder.message}</p>
    </div>
  )
}
