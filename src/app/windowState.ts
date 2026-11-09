import { applications } from '../data/apps.ts'
import type { ApplicationId, WindowApplicationId } from '../data/apps.ts'

export interface ResourceRequest { resourceId: string; requestId: number }

export interface WindowInstance {
  appId: WindowApplicationId
  instanceId: number
  minimized: boolean
  expanded: boolean
  resourceRequest?: ResourceRequest
}

export interface WindowState {
  // Open windows only, ordered from back to front. Absence means closed.
  windows: WindowInstance[]
  nextInstanceId: number
  focusRequest: number
}

export type WindowAction =
  | { type: 'open'; appId: ApplicationId; resourceId?: string }
  | { type: 'close' | 'minimize' | 'restore' | 'focus' | 'toggleExpand'; appId: WindowApplicationId }
  | { type: 'showDesktop' }

export const initialWindowState: WindowState = { windows: [], nextInstanceId: 1, focusRequest: 0 }

export function activeApplicationId(state: WindowState): ApplicationId {
  return state.windows.findLast((window) => !window.minimized)?.appId ?? 'home'
}

export function windowReducer(state: WindowState, action: WindowAction): WindowState {
  if (action.type === 'showDesktop' || (action.type === 'open' && action.appId === 'home')) {
    return { ...state, windows: state.windows.map((window) => ({ ...window, minimized: true })), focusRequest: state.focusRequest + 1 }
  }

  const appId = action.appId as WindowApplicationId
  const current = state.windows.find((window) => window.appId === appId)
  const remaining = state.windows.filter((window) => window.appId !== appId)

  if (action.type === 'open') {
    return {
      ...state,
      windows: [...remaining, {
        ...(current ? { ...current, minimized: false } : { appId, instanceId: state.nextInstanceId, minimized: false, expanded: false }),
        ...(action.resourceId ? { resourceRequest: { resourceId: action.resourceId, requestId: state.focusRequest + 1 } } : {}),
      }],
      nextInstanceId: state.nextInstanceId + (current ? 0 : 1),
      focusRequest: state.focusRequest + 1,
    }
  }
  if (!current) return state

  switch (action.type) {
    case 'close':
      return { ...state, windows: remaining, focusRequest: state.focusRequest + 1 }
    case 'minimize':
      return { ...state, windows: state.windows.map((window) => window.appId === appId ? { ...window, minimized: true } : window), focusRequest: state.focusRequest + 1 }
    case 'restore':
      return { ...state, windows: [...remaining, { ...current, minimized: false }], focusRequest: state.focusRequest + 1 }
    case 'focus':
      if (current.minimized || activeApplicationId(state) === appId) return state
      return { ...state, windows: [...remaining, current], focusRequest: state.focusRequest + 1 }
    case 'toggleExpand':
      if (!('expanded' in applications[appId].window) || current.minimized) return state
      return { ...state, windows: [...remaining, { ...current, expanded: !current.expanded }], focusRequest: state.focusRequest + 1 }
  }
}
