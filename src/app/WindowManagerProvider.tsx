import { useEffect, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'
import { WindowManagerContext } from './WindowManagerContext'
import { activeApplicationId, initialWindowState, windowReducer } from './windowState'
import { PROJECTS_ROOT, projectHash, projects, resolveProjectLocation } from '../data/projects'
import type { Project } from '../data/projects'
import { parsePortfolioRoute } from '../routing/projectRoutes'
import { navigateHash, useHashNavigation } from '../routing/hashNavigation'

export function WindowManagerProvider({ children, projectEntries = projects }: { children: ReactNode; projectEntries?: readonly Project[] }) {
  const [state, dispatch] = useReducer(windowReducer, initialWindowState)
  const navigation = useHashNavigation()
  const lastLocation = useRef<string | null>(null)
  const handledRevision = useRef(-1)

  useEffect(() => {
    if (navigation.source !== 'browser' || handledRevision.current === navigation.revision) return
    handledRevision.current = navigation.revision
    const route = parsePortfolioRoute(navigation.hash, projectEntries)
    if (route.kind === 'projects') {
      lastLocation.current = route.projectId
      dispatch({ type: 'open', appId: 'projects', resourceId: route.projectId ?? PROJECTS_ROOT })
    } else if (route.kind === 'desktop') dispatch({ type: 'showDesktop' })
  }, [navigation, projectEntries])

  function leaveFinder(replace = false) {
    if (parsePortfolioRoute(window.location.hash, projectEntries).kind === 'projects') navigateHash('#/', replace)
  }
  return (
    <WindowManagerContext value={{
      state,
      activeAppId: activeApplicationId(state),
      openApp: (appId, resourceId) => {
        if (appId === 'home') { navigateHash('#/'); dispatch({ type: 'showDesktop' }); return }
        if (appId === 'projects') {
          const current = state.windows.find((entry) => entry.appId === 'projects')
          const location = resourceId === undefined ? current ? lastLocation.current : null : resolveProjectLocation(resourceId, projectEntries)
          if (location === undefined) return
          lastLocation.current = location
          navigateHash(projectHash(location, projectEntries)!)
        }
        dispatch({ type: 'open', appId, resourceId })
      },
      navigateProject: (location) => {
        const hash = projectHash(location, projectEntries)
        if (hash) { lastLocation.current = location; navigateHash(hash) }
      },
      closeApp: (appId) => {
        if (appId === 'projects') { lastLocation.current = null; leaveFinder(true) }
        dispatch({ type: 'close', appId })
      },
      minimizeApp: (appId) => { if (appId === 'projects') leaveFinder(true); dispatch({ type: 'minimize', appId }) },
      restoreApp: (appId) => dispatch({ type: 'restore', appId }),
      focusApp: (appId) => dispatch({ type: 'focus', appId }),
      toggleExpand: (appId) => dispatch({ type: 'toggleExpand', appId }),
      showDesktop: () => { navigateHash('#/'); dispatch({ type: 'showDesktop' }) },
    }}>
      {children}
    </WindowManagerContext>
  )
}
