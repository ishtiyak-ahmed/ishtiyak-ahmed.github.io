import { createContext } from 'react'
import type { ApplicationId, WindowApplicationId } from '../data/apps'
import type { WindowState } from './windowState'

export interface WindowManagerApi {
  state: WindowState
  activeAppId: ApplicationId
  openApp: (id: ApplicationId, resourceId?: string) => void
  navigateProject?: (location: string | null) => void
  closeApp: (id: WindowApplicationId) => void
  minimizeApp: (id: WindowApplicationId) => void
  restoreApp: (id: WindowApplicationId) => void
  focusApp: (id: WindowApplicationId) => void
  toggleExpand: (id: WindowApplicationId) => void
  showDesktop: () => void
}

export const WindowManagerContext = createContext<WindowManagerApi | null>(null)
