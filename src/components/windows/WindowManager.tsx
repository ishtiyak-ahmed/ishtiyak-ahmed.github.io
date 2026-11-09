import { AnimatePresence } from 'motion/react'
import { useWindowManager } from '../../hooks/useWindowManager'
import { AppWindow } from './AppWindow'
import { ApplicationContent } from '../../apps/ApplicationContent'
import './windows.css'

export function WindowManager() {
  const { state } = useWindowManager()
  return (
    <section className="window-workspace" aria-label="Application windows">
      <span id="active-window-description" className="sr-only">Active application window</span>
      <AnimatePresence>
        {/* Keep DOM order stable so raising a window during pointer-down does
            not detach a pressed control before its click is delivered. */}
        {state.windows.toSorted((a, b) => a.instanceId - b.instanceId).map((window) => (
          <AppWindow key={window.instanceId} window={window}
            layer={state.windows.findIndex((entry) => entry.appId === window.appId) + 1}>
            <ApplicationContent appId={window.appId} />
          </AppWindow>
        ))}
      </AnimatePresence>
    </section>
  )
}
