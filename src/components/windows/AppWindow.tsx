import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion, useIsPresent, useReducedMotion } from 'motion/react'
import { applications } from '../../data/apps'
import type { WindowDefinition } from '../../data/apps'
import type { WindowInstance } from '../../app/windowState'
import { useWindowManager } from '../../hooks/useWindowManager'
import { WindowControls } from './WindowControls'

export function AppWindow({ window, layer, children }: { window: WindowInstance; layer: number; children: ReactNode }) {
  const { activeAppId, focusApp, state } = useWindowManager()
  const ref = useRef<HTMLElement>(null)
  const present = useIsPresent()
  const reduceMotion = useReducedMotion()
  const app = applications[window.appId]
  const config: WindowDefinition = app.window
  const size = window.expanded && config.expanded ? config.expanded : config.normal
  const active = present && activeAppId === window.appId && !window.minimized
  const hidden = window.minimized || !present

  useEffect(() => {
    if (active && ref.current && !ref.current.contains(document.activeElement)) {
      ref.current.focus({ preventScroll: true })
    }
  }, [active, state.focusRequest])

  return (
    <div className="window-position" style={{ zIndex: layer }}>
      <motion.section
        ref={ref}
        role="dialog"
        aria-modal="false"
        aria-labelledby={`window-title-${window.instanceId}`}
        aria-describedby={active ? 'active-window-description' : undefined}
        aria-hidden={hidden || undefined}
        inert={hidden}
        tabIndex={-1}
        className="app-window"
        data-app-id={window.appId}
        data-active={active}
        data-minimized={window.minimized}
        data-expanded={window.expanded}
        style={{ '--window-width': `${size.width}px`, '--window-height': size.height === 'content' ? 'auto' : `${size.height}px` } as CSSProperties}
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
        animate={{ opacity: window.minimized ? 0 : 1, scale: !reduceMotion && window.minimized ? 0.98 : 1 }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
        transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
        onPointerDownCapture={() => {
          if (hidden) return
          focusApp(window.appId)
          // Wait for the pointer's default focus action, preserving control focus.
          requestAnimationFrame(() => {
            if (ref.current && !ref.current.inert && !ref.current.contains(document.activeElement)) {
              ref.current.focus({ preventScroll: true })
            }
          })
        }}
        onFocusCapture={() => { if (!hidden) focusApp(window.appId) }}
      >
        <header className="app-window__titlebar">
          <WindowControls appId={window.appId} expanded={window.expanded} />
          <span className="app-window__title" id={`window-title-${window.instanceId}`}>{app.name}</span>
        </header>
        <div className="app-window__content">{children}</div>
      </motion.section>
    </div>
  )
}
