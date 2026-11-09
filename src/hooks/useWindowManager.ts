import { useContext } from 'react'
import { WindowManagerContext } from '../app/WindowManagerContext'

export function useWindowManager() {
  const context = useContext(WindowManagerContext)
  if (!context) throw new Error('useWindowManager requires WindowManagerProvider')
  return context
}
