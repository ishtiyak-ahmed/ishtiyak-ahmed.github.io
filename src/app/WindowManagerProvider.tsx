import { useReducer } from 'react'
import type { ReactNode } from 'react'
import { WindowManagerContext } from './WindowManagerContext'
import { activeApplicationId, initialWindowState, windowReducer } from './windowState'

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, initialWindowState)

  return (
    <WindowManagerContext value={{
      state,
      activeAppId: activeApplicationId(state),
      openApp: (appId) => dispatch({ type: 'open', appId }),
      closeApp: (appId) => dispatch({ type: 'close', appId }),
      minimizeApp: (appId) => dispatch({ type: 'minimize', appId }),
      restoreApp: (appId) => dispatch({ type: 'restore', appId }),
      focusApp: (appId) => dispatch({ type: 'focus', appId }),
      toggleExpand: (appId) => dispatch({ type: 'toggleExpand', appId }),
      showDesktop: () => dispatch({ type: 'showDesktop' }),
    }}>
      {children}
    </WindowManagerContext>
  )
}
